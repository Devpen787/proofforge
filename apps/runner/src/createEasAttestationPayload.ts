import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { verifyAcceptanceSignatureRecord } from "./verifyAcceptanceSignature";

interface ProofNetworkRecordLike {
  id: string;
  packet?: {
    id?: string;
    mission?: string;
    project?: string;
    storage?: string;
    verifier?: string;
    acceptedBy?: string;
  };
  receipts?: {
    walletAddress?: string;
    walletProvider?: string;
    walletSignature?: string;
    walletMessage?: string;
    payoutReceipt?: string;
    zeroGReceipt?: string;
  };
}

interface EasPayloadArgs {
  recordPath: string;
  outputPath: string;
}

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index === -1 ? undefined : argv[index + 1];
}

export function parseEasPayloadArgs(argv: string[]): EasPayloadArgs {
  const recordPath = readFlag(argv, "--record");
  if (!recordPath) {
    throw new Error(
      "Usage: npm run eas:payload -- --record <proof-network-record.json>"
    );
  }

  return {
    recordPath: resolve(recordPath),
    outputPath:
      readFlag(argv, "--out") ??
      resolve(dirname(recordPath), "accepted-proof.eas-payload.json")
  };
}

export async function createEasAttestationPayload(
  args: EasPayloadArgs
): Promise<string> {
  const record = JSON.parse(
    await readFile(args.recordPath, "utf8")
  ) as ProofNetworkRecordLike;
  const acceptance = verifyAcceptanceSignatureRecord(record);
  if (acceptance.status === "mismatch" || acceptance.status === "missing") {
    throw new Error("Accepted proof needs a valid or explicit demo signature.");
  }

  const payload = {
    version: "proof-eas-attestation-payload/v1",
    schema:
      "bytes32 recordHash,string recordId,string packetId,string project,string mission,string storageUri,address reviewer,string payoutReceipt",
    recordId: record.id,
    data: {
      recordId: record.id,
      packetId: record.packet?.id ?? "",
      project: record.packet?.project ?? "",
      mission: record.packet?.mission ?? "",
      storageUri: record.receipts?.zeroGReceipt ?? record.packet?.storage ?? "",
      reviewer:
        acceptance.status === "verified" ? acceptance.walletAddress : undefined,
      payoutReceipt: record.receipts?.payoutReceipt ?? ""
    },
    acceptance,
    boundaries: [
      "This payload prepares an EAS attestation; it does not submit a transaction.",
      "A wallet must still confirm any onchain attestation.",
      "The attestation points to accepted proof; it is not a payout settlement."
    ]
  };

  const outputPath = resolve(args.outputPath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");
  return outputPath;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  createEasAttestationPayload(parseEasPayloadArgs(process.argv.slice(2)))
    .then((outputPath) => {
      console.log("ProofForge EAS attestation payload written.");
      console.log(`Payload: ${outputPath}`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
