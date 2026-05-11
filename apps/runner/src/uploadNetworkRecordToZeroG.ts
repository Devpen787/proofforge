import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createZeroGStorageAdapter } from "@proofforge/storage";
import { loadLocalEnv } from "./loadLocalEnv";

interface UploadArgs {
  inputPath: string;
  outputPath: string;
}

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index === -1 ? undefined : argv[index + 1];
}

export function parseUploadNetworkRecordArgs(argv: string[]): UploadArgs {
  const inputPath = readFlag(argv, "--in");
  if (!inputPath) {
    throw new Error(
      "Usage: npm run 0g:upload-record -- --in <proof-network-record.json>"
    );
  }

  return {
    inputPath: resolve(inputPath),
    outputPath:
      readFlag(argv, "--out") ??
      resolve(
        dirname(inputPath),
        `${basename(inputPath, ".json")}.0g-receipt.json`
      )
  };
}

export async function uploadNetworkRecordToZeroG(
  args: UploadArgs
): Promise<string> {
  await loadLocalEnv();

  const evmRpc = process.env.ZERO_G_EVM_RPC;
  const indexerRpc = process.env.ZERO_G_INDEXER_RPC;
  const privateKey = process.env.ZERO_G_PRIVATE_KEY?.trim();

  if (!evmRpc || !indexerRpc || !privateKey) {
    throw new Error(
      "Missing ZERO_G_EVM_RPC, ZERO_G_INDEXER_RPC, or ZERO_G_PRIVATE_KEY."
    );
  }

  JSON.parse(await readFile(args.inputPath, "utf8"));

  const adapter = createZeroGStorageAdapter({
    evmRpc,
    indexerRpc,
    privateKey
  });
  const receipt = await adapter.putFile({
    path: args.inputPath,
    contentType: "application/json"
  });

  const outputPath = resolve(args.outputPath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(receipt, null, 2), "utf8");
  return outputPath;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  uploadNetworkRecordToZeroG(
    parseUploadNetworkRecordArgs(process.argv.slice(2))
  )
    .then((outputPath) => {
      console.log("ProofForge network record uploaded to 0G.");
      console.log(`Receipt: ${outputPath}`);
      console.log(
        "The browser never receives the private key; upload runs in runner tooling."
      );
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
