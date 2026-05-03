import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { importGitHubContributionHistory } from "@proofforge/sources";

interface ImportHistoryArgs {
  login: string;
  outputDir: string;
  perPage?: number;
}

export function parseImportHistoryArgs(argv: string[]): ImportHistoryArgs {
  const login = readFlag(argv, "--login") ?? readFlag(argv, "--user");
  if (!login) {
    throw new Error(
      "Usage: npm run import:github-history -- --login <github-login>"
    );
  }

  const perPageRaw = readFlag(argv, "--per-page");
  const parsedPerPage = perPageRaw ? Number(perPageRaw) : undefined;
  if (
    parsedPerPage !== undefined &&
    (!Number.isInteger(parsedPerPage) || parsedPerPage <= 0)
  ) {
    throw new Error("--per-page must be a positive integer.");
  }

  return {
    login,
    outputDir: readFlag(argv, "--out") ?? "demo-output/imports",
    perPage: parsedPerPage
  };
}

export async function importGitHubHistoryToFile(
  args: ImportHistoryArgs
): Promise<string> {
  const imported = await importGitHubContributionHistory({
    login: args.login,
    perPage: args.perPage
  });
  const outputDir = resolve(process.cwd(), args.outputDir);
  await mkdir(outputDir, { recursive: true });

  const outputPath = join(outputDir, `github_${args.login}_history.json`);
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
  importGitHubHistoryToFile(parseImportHistoryArgs(process.argv.slice(2)))
    .then((outputPath) => {
      console.log("ProofForge GitHub history imported.");
      console.log(`Output: ${outputPath}`);
      console.log(
        "Imported activity is observed history, not accepted credit."
      );
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
