import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { parsePayout, releasePayout } from "../../../packages/payments/src/index";

interface CliArgs {
  inputPath: string;
  outputPath: string;
}

export async function releasePayoutFile(inputPath: string, outputPath: string, now = new Date()): Promise<string> {
  const payout = parsePayout(JSON.parse(await readFile(inputPath, "utf8")));
  const released = releasePayout(payout, { now });
  const target = resolve(outputPath);

  await writeFile(target, JSON.stringify(released, null, 2), "utf8");
  return target;
}

function parseArgs(argv: string[]): CliArgs {
  const inputIndex = argv.indexOf("--in");
  const outputIndex = argv.indexOf("--out");

  if (inputIndex === -1 || !argv[inputIndex + 1]) {
    throw new Error("Missing --in <payout-json>.");
  }

  const inputPath = resolve(argv[inputIndex + 1]);
  const outputPath =
    outputIndex === -1 || !argv[outputIndex + 1]
      ? resolve(dirname(inputPath), "released-payout.json")
      : resolve(argv[outputIndex + 1]);

  return { inputPath, outputPath };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const outputPath = await releasePayoutFile(args.inputPath, args.outputPath);

  console.log("ProofForge payout released.");
  console.log(`Input: ${args.inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log("Release is a manual accounting mark in the MVP; no money moved automatically.");
}

if (process.argv[1]?.endsWith("releasePayout.ts")) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
