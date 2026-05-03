import { pathToFileURL } from "node:url";
import { loadLocalEnv } from "./loadLocalEnv";

interface ZeroGConfigStatus {
  ready: boolean;
  evmRpc: string;
  indexerRpc: string;
  hasPrivateKey: boolean;
  privateKeyShape: "missing" | "invalid" | "valid";
  privateKeyLength: number;
  privateKeyTrimmedLength: number;
  privateKeyHasPrefix: boolean;
  privateKeyHexOnly: boolean;
}

export async function checkZeroGConfig(): Promise<ZeroGConfigStatus> {
  await loadLocalEnv();

  const evmRpc = process.env.ZERO_G_EVM_RPC ?? "";
  const indexerRpc = process.env.ZERO_G_INDEXER_RPC ?? "";
  const privateKey = process.env.ZERO_G_PRIVATE_KEY ?? "";
  const trimmedPrivateKey = privateKey.trim();
  const privateKeyShape = trimmedPrivateKey
    ? /^0x[a-fA-F0-9]{64}$/.test(trimmedPrivateKey)
      ? "valid"
      : "invalid"
    : "missing";

  return {
    ready: Boolean(evmRpc && indexerRpc && privateKeyShape === "valid"),
    evmRpc,
    indexerRpc,
    hasPrivateKey: Boolean(trimmedPrivateKey),
    privateKeyShape,
    privateKeyLength: privateKey.length,
    privateKeyTrimmedLength: trimmedPrivateKey.length,
    privateKeyHasPrefix: trimmedPrivateKey.startsWith("0x"),
    privateKeyHexOnly: /^0x?[a-fA-F0-9]*$/.test(trimmedPrivateKey)
  };
}

function printZeroGConfigStatus(status: ZeroGConfigStatus): void {
  console.log("ProofForge 0G configuration");
  console.log(`EVM RPC: ${status.evmRpc || "missing"}`);
  console.log(`Indexer RPC: ${status.indexerRpc || "missing"}`);
  console.log(
    `Private key: ${status.hasPrivateKey ? status.privateKeyShape : "missing"}`
  );
  console.log(`Private key length: ${status.privateKeyLength}`);
  console.log(`Private key trimmed length: ${status.privateKeyTrimmedLength}`);
  console.log(`Private key starts with 0x: ${status.privateKeyHasPrefix}`);
  console.log(`Private key characters are hex: ${status.privateKeyHexOnly}`);
  console.log(`Ready for live 0G upload: ${status.ready ? "yes" : "no"}`);

  if (!status.ready) {
    console.log(
      "Add a funded Galileo testnet private key to .env.local as ZERO_G_PRIVATE_KEY."
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  checkZeroGConfig()
    .then(printZeroGConfigStatus)
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
