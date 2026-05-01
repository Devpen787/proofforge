import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { importGitHubIssueLead } from "@proofforge/sources";

interface ImportArgs {
  url: string;
  outputDir: string;
}

export function parseImportArgs(argv: string[]): ImportArgs {
  const url = readFlag(argv, "--url") ?? argv.find((value) => value.startsWith("https://github.com/"));
  if (!url) {
    throw new Error("Usage: npm run import:github -- --url https://github.com/owner/repo/issues/123");
  }

  return {
    url,
    outputDir: readFlag(argv, "--out") ?? "demo-output/imports"
  };
}

export async function importGitHubIssueToFile(args: ImportArgs): Promise<string> {
  const imported = await importGitHubIssueLead({ url: args.url });
  const outputDir = resolve(process.cwd(), args.outputDir);
  await mkdir(outputDir, { recursive: true });

  const outputPath = join(outputDir, `${imported.lead.id}.work-lead.json`);
  await writeFile(outputPath, JSON.stringify(imported, null, 2), "utf8");

  return outputPath;
}

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  if (index === -1) return undefined;
  return argv[index + 1];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  importGitHubIssueToFile(parseImportArgs(process.argv.slice(2)))
    .then((outputPath) => {
      console.log("ProofForge work lead imported.");
      console.log(`Output: ${outputPath}`);
      console.log("No public comments, PRs, or payments were created.");
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
