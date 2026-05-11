import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Indexer } from "@0gfoundation/0g-storage-ts-sdk";
import {
  verifyAcceptanceSignatureRecord,
  type AcceptanceSignatureVerification
} from "./verifyAcceptanceSignature";
import { loadLocalEnv } from "./loadLocalEnv";

interface ZeroGReceiptLike {
  provider?: string;
  uri?: string;
  rootHash?: string;
  txHash?: string;
}

interface ProofNetworkRecordLike {
  id?: string;
  version?: string;
  appState?: unknown;
  receipts?: {
    walletAddress?: string;
    walletProvider?: string;
    walletSignature?: string;
    walletMessage?: string;
  };
}

export interface ProofForgeSyncManifest {
  version: "proof-sync-manifest/v1";
  recordId: string;
  createdAt: string;
  record: {
    sha256: string;
    bytes: number;
  };
  storage: {
    provider: "0g";
    uri: string;
    rootHash: string;
    txHash?: string;
  };
  acceptance: AcceptanceSignatureVerification;
  import: {
    command: string;
    browser: string;
  };
  boundaries: string[];
}

interface PublishArgs {
  command: "publish";
  recordPath: string;
  receiptPath: string;
  outputPath: string;
}

interface PullArgs {
  command: "pull";
  manifestPath: string;
  recordPath?: string;
  outputPath: string;
}

type SyncArgs = PublishArgs | PullArgs;

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index === -1 ? undefined : argv[index + 1];
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function parseJson<T>(body: string, label: string): T {
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error(`${label} is not valid JSON.`);
  }
}

function isZeroGReceipt(
  receipt: ZeroGReceiptLike
): receipt is Required<Pick<ZeroGReceiptLike, "uri" | "rootHash">> &
  ZeroGReceiptLike {
  return (
    receipt.provider === "0g" &&
    typeof receipt.uri === "string" &&
    typeof receipt.rootHash === "string"
  );
}

function assertRecord(
  record: ProofNetworkRecordLike
): asserts record is ProofNetworkRecordLike & {
  id: string;
  version: string;
  appState: unknown;
} {
  if (
    record.version !== "proof-network-record/v1" ||
    typeof record.id !== "string" ||
    !record.appState
  ) {
    throw new Error("Input is not a ProofForge network record.");
  }
}

export function parseSyncNetworkRecordArgs(argv: string[]): SyncArgs {
  const command = argv[0];

  if (command === "publish") {
    const recordPath = readFlag(argv, "--record");
    const receiptPath = readFlag(argv, "--receipt");
    if (!recordPath || !receiptPath) {
      throw new Error(
        "Usage: npm run sync:publish-record -- --record <record.json> --receipt <0g-receipt.json>"
      );
    }

    return {
      command,
      recordPath: resolve(recordPath),
      receiptPath: resolve(receiptPath),
      outputPath:
        readFlag(argv, "--out") ??
        resolve(
          dirname(recordPath),
          `${basename(recordPath, ".json")}.sync.json`
        )
    };
  }

  if (command === "pull") {
    const manifestPath = readFlag(argv, "--manifest");
    if (!manifestPath) {
      throw new Error(
        "Usage: npm run sync:pull-record -- --manifest <sync.json>"
      );
    }

    return {
      command,
      manifestPath: resolve(manifestPath),
      recordPath: readFlag(argv, "--record")
        ? resolve(readFlag(argv, "--record") as string)
        : undefined,
      outputPath:
        readFlag(argv, "--out") ??
        resolve(
          dirname(manifestPath),
          `${basename(manifestPath, ".sync.json")}.proof-network-record.json`
        )
    };
  }

  throw new Error(
    "Usage: npm run sync:publish-record -- --record <record.json> --receipt <0g-receipt.json> OR npm run sync:pull-record -- --manifest <sync.json>"
  );
}

export async function createSyncManifest(args: PublishArgs): Promise<string> {
  const recordBody = await readFile(args.recordPath, "utf8");
  const record = parseJson<ProofNetworkRecordLike>(
    recordBody,
    "Network record"
  );
  assertRecord(record);

  const receipt = parseJson<ZeroGReceiptLike>(
    await readFile(args.receiptPath, "utf8"),
    "0G receipt"
  );
  if (!isZeroGReceipt(receipt)) {
    throw new Error("Receipt is not a 0G network record receipt.");
  }

  const acceptance = verifyAcceptanceSignatureRecord(record);
  if (acceptance.status === "mismatch") {
    throw new Error("Cannot publish sync manifest for mismatched signature.");
  }

  const outputPath = resolve(args.outputPath);
  const manifest: ProofForgeSyncManifest = {
    version: "proof-sync-manifest/v1",
    recordId: record.id,
    createdAt: new Date().toISOString(),
    record: {
      sha256: sha256(recordBody),
      bytes: Buffer.byteLength(recordBody, "utf8")
    },
    storage: {
      provider: "0g",
      uri: receipt.uri,
      rootHash: receipt.rootHash,
      txHash: receipt.txHash
    },
    acceptance,
    import: {
      command:
        "npm run sync:pull-record -- --manifest <sync.json> --out <record.json>",
      browser:
        "Open ProofForge Settings, choose Import workspace file, and select the pulled proof network record."
    },
    boundaries: [
      "This sync manifest points to an immutable ProofForge network record.",
      "The content hash must match before import.",
      "Browser wallet acceptance signatures can be independently verified.",
      "GitHub permissions, maintainer authority, and payout settlement stay with their original systems."
    ]
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(manifest, null, 2), "utf8");
  return outputPath;
}

function assertManifest(
  value: unknown
): asserts value is ProofForgeSyncManifest {
  const manifest = value as Partial<ProofForgeSyncManifest>;
  if (
    manifest.version !== "proof-sync-manifest/v1" ||
    typeof manifest.recordId !== "string" ||
    !manifest.record ||
    typeof manifest.record.sha256 !== "string" ||
    !manifest.storage ||
    manifest.storage.provider !== "0g" ||
    typeof manifest.storage.rootHash !== "string"
  ) {
    throw new Error("Input is not a ProofForge sync manifest.");
  }
}

async function downloadRecordFromZeroG(
  rootHash: string,
  outputPath: string
): Promise<void> {
  await loadLocalEnv();
  const indexerRpc = process.env.ZERO_G_INDEXER_RPC;
  if (!indexerRpc) {
    throw new Error(
      "Missing ZERO_G_INDEXER_RPC. Set it to pull records from 0G."
    );
  }

  const indexer = new Indexer(indexerRpc);
  const error = await indexer.download(rootHash, outputPath, true);
  if (error !== null) {
    throw error;
  }
}

export async function pullSyncRecord(args: PullArgs): Promise<string> {
  const manifest = parseJson<unknown>(
    await readFile(args.manifestPath, "utf8"),
    "Sync manifest"
  );
  assertManifest(manifest);

  const outputPath = resolve(args.outputPath);
  await mkdir(dirname(outputPath), { recursive: true });

  if (args.recordPath) {
    await writeFile(
      outputPath,
      await readFile(args.recordPath, "utf8"),
      "utf8"
    );
  } else {
    await downloadRecordFromZeroG(manifest.storage.rootHash, outputPath);
  }

  const recordBody = await readFile(outputPath, "utf8");
  const actualHash = sha256(recordBody);
  if (actualHash !== manifest.record.sha256) {
    throw new Error(
      `Pulled record hash mismatch. Expected ${manifest.record.sha256}, got ${actualHash}.`
    );
  }

  const record = parseJson<ProofNetworkRecordLike>(
    recordBody,
    "Pulled network record"
  );
  assertRecord(record);
  if (record.id !== manifest.recordId) {
    throw new Error(
      `Pulled record id mismatch. Expected ${manifest.recordId}, got ${record.id}.`
    );
  }

  const acceptance = verifyAcceptanceSignatureRecord(record);
  if (acceptance.status === "mismatch") {
    throw new Error("Pulled record has a mismatched acceptance signature.");
  }

  return outputPath;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const args = parseSyncNetworkRecordArgs(process.argv.slice(2));
  const action =
    args.command === "publish"
      ? createSyncManifest(args)
      : pullSyncRecord(args);

  action
    .then((outputPath) => {
      console.log(
        args.command === "publish"
          ? "ProofForge sync manifest written."
          : "ProofForge network record pulled and verified."
      );
      console.log(`Output: ${outputPath}`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
