import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Indexer } from "@0gfoundation/0g-storage-ts-sdk";
import { loadLocalEnv } from "./loadLocalEnv";

interface ZeroGReceiptLike {
  provider?: string;
  uri?: string;
  rootHash?: string;
  txHash?: string;
}

interface ProjectRecordLike {
  version?: string;
  id?: string;
  project?: {
    id?: string;
    name?: string;
    source?: string;
  };
  state?: unknown;
  sources?: unknown[];
  missions?: unknown[];
  ledger?: unknown[];
}

interface ProjectSyncManifest {
  version: "proof-project-sync-manifest/v1";
  recordId: string;
  project: {
    id: string;
    name: string;
    source: string;
  };
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

function assertProjectRecord(
  record: ProjectRecordLike
): asserts record is ProjectRecordLike & {
  version: "proof-project-record/v1";
  id: string;
  project: { id: string; name: string; source: string };
  state: unknown;
} {
  if (
    record.version !== "proof-project-record/v1" ||
    typeof record.id !== "string" ||
    typeof record.project?.id !== "string" ||
    typeof record.project.name !== "string" ||
    typeof record.project.source !== "string" ||
    !record.state
  ) {
    throw new Error("Input is not a ProofForge project record.");
  }
}

function assertReceipt(receipt: ZeroGReceiptLike): asserts receipt is {
  provider: "0g";
  uri: string;
  rootHash: string;
  txHash?: string;
} {
  if (
    receipt.provider !== "0g" ||
    typeof receipt.uri !== "string" ||
    typeof receipt.rootHash !== "string"
  ) {
    throw new Error("Receipt is not a 0G project record receipt.");
  }
}

function assertManifest(value: unknown): asserts value is ProjectSyncManifest {
  const manifest = value as Partial<ProjectSyncManifest>;
  if (
    manifest.version !== "proof-project-sync-manifest/v1" ||
    typeof manifest.recordId !== "string" ||
    !manifest.record ||
    typeof manifest.record.sha256 !== "string" ||
    !manifest.storage ||
    manifest.storage.provider !== "0g" ||
    typeof manifest.storage.rootHash !== "string"
  ) {
    throw new Error("Input is not a ProofForge project sync manifest.");
  }
}

export function parseSyncProjectRecordArgs(argv: string[]): SyncArgs {
  const command = argv[0];

  if (command === "publish") {
    const recordPath = readFlag(argv, "--record");
    const receiptPath = readFlag(argv, "--receipt");
    if (!recordPath || !receiptPath) {
      throw new Error(
        "Usage: npm run sync:publish-project -- --record <project-record.json> --receipt <0g-receipt.json>"
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
          `${basename(recordPath, ".json")}.project-sync.json`
        )
    };
  }

  if (command === "pull") {
    const manifestPath = readFlag(argv, "--manifest");
    if (!manifestPath) {
      throw new Error(
        "Usage: npm run sync:pull-project -- --manifest <project-sync.json>"
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
          `${basename(manifestPath, ".project-sync.json")}.proof-project-record.json`
        )
    };
  }

  throw new Error(
    "Usage: npm run sync:publish-project -- --record <project-record.json> --receipt <0g-receipt.json> OR npm run sync:pull-project -- --manifest <project-sync.json>"
  );
}

export async function createProjectSyncManifest(
  args: PublishArgs
): Promise<string> {
  const recordBody = await readFile(args.recordPath, "utf8");
  const record = parseJson<ProjectRecordLike>(recordBody, "Project record");
  assertProjectRecord(record);

  const receipt = parseJson<ZeroGReceiptLike>(
    await readFile(args.receiptPath, "utf8"),
    "0G receipt"
  );
  assertReceipt(receipt);

  const manifest: ProjectSyncManifest = {
    version: "proof-project-sync-manifest/v1",
    recordId: record.id,
    project: record.project,
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
    import: {
      command:
        "npm run sync:pull-project -- --manifest <project-sync.json> --out <project-record.json>",
      browser:
        "Open ProofForge Settings, choose Import workspace file, and select the pulled project record."
    },
    boundaries: [
      "This manifest syncs project metadata and proof references, not GitHub permissions.",
      "Accepted proof and payout references remain externally verifiable.",
      "0G stores the immutable project snapshot; mutable collaboration can move to Ceramic, GUN, or OrbitDB."
    ]
  };

  const outputPath = resolve(args.outputPath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(manifest, null, 2), "utf8");
  return outputPath;
}

async function downloadProjectRecordFromZeroG(
  rootHash: string,
  outputPath: string
): Promise<void> {
  await loadLocalEnv();
  const indexerRpc = process.env.ZERO_G_INDEXER_RPC;
  if (!indexerRpc) {
    throw new Error(
      "Missing ZERO_G_INDEXER_RPC. Set it to pull project records from 0G."
    );
  }

  const indexer = new Indexer(indexerRpc);
  const error = await indexer.download(rootHash, outputPath, true);
  if (error !== null) throw error;
}

export async function pullProjectSyncRecord(args: PullArgs): Promise<string> {
  const manifest = parseJson<unknown>(
    await readFile(args.manifestPath, "utf8"),
    "Project sync manifest"
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
    await downloadProjectRecordFromZeroG(manifest.storage.rootHash, outputPath);
  }

  const recordBody = await readFile(outputPath, "utf8");
  const actualHash = sha256(recordBody);
  if (actualHash !== manifest.record.sha256) {
    throw new Error(
      `Pulled project record hash mismatch. Expected ${manifest.record.sha256}, got ${actualHash}.`
    );
  }

  const record = parseJson<ProjectRecordLike>(
    recordBody,
    "Pulled project record"
  );
  assertProjectRecord(record);
  if (record.id !== manifest.recordId) {
    throw new Error(
      `Pulled project record id mismatch. Expected ${manifest.recordId}, got ${record.id}.`
    );
  }

  return outputPath;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const args = parseSyncProjectRecordArgs(process.argv.slice(2));
  const action =
    args.command === "publish"
      ? createProjectSyncManifest(args)
      : pullProjectSyncRecord(args);

  action
    .then((outputPath) => {
      console.log(
        args.command === "publish"
          ? "ProofForge project sync manifest written."
          : "ProofForge project record pulled and verified."
      );
      console.log(`Output: ${outputPath}`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
