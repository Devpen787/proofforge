import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { verifyMessage } from "ethers";

export interface AcceptanceSignatureVerification {
  status: "verified" | "demo_only" | "missing" | "mismatch";
  walletProvider?: string;
  walletAddress?: string;
  recoveredAddress?: string;
  signature?: string;
  reason: string;
}

interface ProofNetworkRecordLike {
  receipts?: {
    walletAddress?: string;
    walletProvider?: string;
    walletSignature?: string;
    walletMessage?: string;
  };
}

export function verifyAcceptanceSignatureRecord(
  record: ProofNetworkRecordLike
): AcceptanceSignatureVerification {
  const walletProvider = record.receipts?.walletProvider;
  const walletAddress = record.receipts?.walletAddress;
  const signature = record.receipts?.walletSignature;
  const message = record.receipts?.walletMessage;

  if (!signature || !message) {
    return {
      status: "missing",
      walletProvider,
      walletAddress,
      reason: "No acceptance signature and message were recorded."
    };
  }

  if (walletProvider !== "browser") {
    return {
      status: "demo_only",
      walletProvider,
      walletAddress,
      signature,
      reason:
        "Signature was produced by the explicit local demo signer, not a browser wallet."
    };
  }

  if (!walletAddress) {
    return {
      status: "missing",
      walletProvider,
      signature,
      reason:
        "Browser wallet signature exists but no wallet address was recorded."
    };
  }

  try {
    const recoveredAddress = verifyMessage(message, signature);
    const verified =
      recoveredAddress.toLowerCase() === walletAddress.toLowerCase();

    return {
      status: verified ? "verified" : "mismatch",
      walletProvider,
      walletAddress,
      recoveredAddress,
      signature,
      reason: verified
        ? "Recovered signer matches the recorded wallet address."
        : "Recovered signer does not match the recorded wallet address."
    };
  } catch (error) {
    return {
      status: "mismatch",
      walletProvider,
      walletAddress,
      signature,
      reason:
        error instanceof Error ? error.message : "Signature recovery failed."
    };
  }
}

export async function verifyAcceptanceSignatureFile(
  inputPath: string
): Promise<AcceptanceSignatureVerification> {
  const record = JSON.parse(
    await readFile(inputPath, "utf8")
  ) as ProofNetworkRecordLike;
  return verifyAcceptanceSignatureRecord(record);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error(
      "Usage: npm run verify:acceptance -- <proof-network-record.json>"
    );
    process.exitCode = 1;
  } else {
    verifyAcceptanceSignatureFile(inputPath)
      .then((result) => {
        console.log(JSON.stringify(result, null, 2));
        if (result.status === "mismatch") process.exitCode = 1;
      })
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
      });
  }
}
