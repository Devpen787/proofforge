import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { importEthGlobalPrizeLeads } from "@proofforge/sources";

interface ImportArgs {
  event: string;
  outputDir: string;
}

export function parseEthGlobalImportArgs(argv: string[]): ImportArgs {
  const event = readFlag(argv, "--event") ?? "Open Agents";

  return {
    event,
    outputDir: readFlag(argv, "--out") ?? "demo-output/imports"
  };
}

export async function importEthGlobalPrizesToFile(
  args: ImportArgs
): Promise<string> {
  const imported = await importEthGlobalPrizeLeads({ event: args.event });
  const outputDir = resolve(process.cwd(), args.outputDir);
  await mkdir(outputDir, { recursive: true });

  const slug = args.event
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const outputPath = join(outputDir, `ethglobal-${slug}.work-leads.json`);
  await writeFile(outputPath, JSON.stringify(imported, null, 2), "utf8");

  return outputPath;
}

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  if (index === -1) return undefined;
  return argv[index + 1];
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  importEthGlobalPrizesToFile(parseEthGlobalImportArgs(process.argv.slice(2)))
    .then((outputPath) => {
      console.log("ProofForge ETHGlobal prize requirements imported.");
      console.log(`Output: ${outputPath}`);
      console.log("No wallet action, submission, or payment was created.");
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
