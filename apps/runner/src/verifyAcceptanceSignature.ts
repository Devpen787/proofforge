import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { verifyMessage, verifyTypedData } from "ethers";

export interface AcceptanceSignatureVerification {
  status: "verified" | "demo_only" | "missing" | "mismatch";
  method?: "eip712" | "personal_sign" | "local_demo";
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

interface Eip712MessageLike {
  types?: Record<string, Array<{ name: string; type: string }>>;
  primaryType?: string;
  domain?: Record<string, unknown>;
  message?: Record<string, unknown>;
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
      method: undefined,
      reason: "No acceptance signature and message were recorded."
    };
  }

  if (walletProvider !== "browser") {
    return {
      status: "demo_only",
      walletProvider,
      walletAddress,
      method: "local_demo",
      signature,
      reason:
        "Signature was produced by the explicit local demo signer, not a browser wallet."
    };
  }

  if (!walletAddress) {
    return {
      status: "missing",
      walletProvider,
      method: detectSignatureMethod(message),
      signature,
      reason:
        "Browser wallet signature exists but no wallet address was recorded."
    };
  }

  try {
    const method = detectSignatureMethod(message);
    const recoveredAddress =
      method === "eip712"
        ? verifyEip712Acceptance(message, signature)
        : verifyMessage(message, signature);
    const verified =
      recoveredAddress.toLowerCase() === walletAddress.toLowerCase();

    return {
      status: verified ? "verified" : "mismatch",
      walletProvider,
      walletAddress,
      recoveredAddress,
      method,
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
      method: detectSignatureMethod(message),
      signature,
      reason:
        error instanceof Error ? error.message : "Signature recovery failed."
    };
  }
}

function detectSignatureMethod(message: string): "eip712" | "personal_sign" {
  try {
    const parsed = JSON.parse(message) as Eip712MessageLike;
    if (
      parsed.primaryType &&
      parsed.domain &&
      parsed.message &&
      parsed.types?.[parsed.primaryType]
    ) {
      return "eip712";
    }
  } catch {
    // Non-JSON messages are personal_sign payloads.
  }

  return "personal_sign";
}

function verifyEip712Acceptance(message: string, signature: string): string {
  const parsed = JSON.parse(message) as Eip712MessageLike;
  if (
    !parsed.domain ||
    !parsed.types ||
    !parsed.primaryType ||
    !parsed.message
  ) {
    throw new Error("EIP-712 acceptance message is incomplete.");
  }

  const { EIP712Domain: _domain, ...types } = parsed.types;
  void _domain;
  return verifyTypedData(parsed.domain, types, parsed.message, signature);
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
