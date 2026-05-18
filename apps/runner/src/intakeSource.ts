import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  createWorkLeadFromSourceIntake,
  type SourceIntakeResult
} from "@proofforge/sources";

interface IntakeArgs {
  sourceUrl: string;
  title?: string;
  description?: string;
  project?: string;
  acceptanceOwner?: string;
  proofRequirement?: string;
  valuePath?: string;
  outputDir: string;
}

export function parseIntakeArgs(argv: string[]): IntakeArgs {
  const sourceUrl = readFlag(argv, "--url") ?? argv[0];
  if (!sourceUrl) {
    throw new Error(
      [
        "Usage: npm run intake:source -- --url <source-url>",
        "Optional: --title --description --project --owner --proof --value --out"
      ].join("\n")
    );
  }

  return {
    sourceUrl,
    title: readFlag(argv, "--title"),
    description: readFlag(argv, "--description"),
    project: readFlag(argv, "--project"),
    acceptanceOwner: readFlag(argv, "--owner"),
    proofRequirement: readFlag(argv, "--proof"),
    valuePath: readFlag(argv, "--value"),
    outputDir: readFlag(argv, "--out") ?? "demo-output/imports"
  };
}

export async function intakeSourceToFile(args: IntakeArgs): Promise<string> {
  const imported = createWorkLeadFromSourceIntake(args);
  return writeSourceIntake(args.outputDir, imported);
}

async function writeSourceIntake(
  outputDirInput: string,
  imported: SourceIntakeResult
): Promise<string> {
  const outputDir = resolve(process.cwd(), outputDirInput);
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

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const args = parseIntakeArgs(process.argv.slice(2));
  const imported = createWorkLeadFromSourceIntake(args);

  writeSourceIntake(args.outputDir, imported)
    .then((outputPath) => {
      console.log("ProofForge source intake recorded.");
      console.log(`Output: ${outputPath}`);
      console.log(`Status: ${imported.diagnosis.status}`);
      console.log(`Recommendation: ${imported.diagnosis.recommendation}`);
      console.log("No external submission, comment, PR, or payment was made.");
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
