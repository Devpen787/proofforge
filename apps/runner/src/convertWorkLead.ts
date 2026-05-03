import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  convertWorkLeadToMission,
  parseWorkLead,
  type WorkLead
} from "@proofforge/mission";

interface ConvertArgs {
  inputPath: string;
  outputDir: string;
}

export function parseConvertArgs(argv: string[]): ConvertArgs {
  const inputPath = readFlag(argv, "--in") ?? argv[0];
  if (!inputPath) {
    throw new Error(
      "Usage: npm run convert:lead -- --in demo-output/imports/example.work-lead.json"
    );
  }

  return {
    inputPath,
    outputDir: readFlag(argv, "--out") ?? "demo-output/missions"
  };
}

export async function convertWorkLeadFile(args: ConvertArgs): Promise<string> {
  const lead = await readWorkLead(args.inputPath);
  const mission = convertWorkLeadToMission(lead);
  const outputDir = resolve(process.cwd(), args.outputDir);
  await mkdir(outputDir, { recursive: true });

  const cleanName = basename(args.inputPath)
    .replace(/\.work-lead\.json$/, "")
    .replace(/\.json$/, "");
  const outputPath = join(outputDir, `${cleanName}.mission.json`);
  await writeFile(outputPath, JSON.stringify(mission, null, 2), "utf8");

  return outputPath;
}

async function readWorkLead(inputPath: string): Promise<WorkLead> {
  const body = JSON.parse(
    await readFile(resolve(process.cwd(), inputPath), "utf8")
  );
  return parseWorkLead(body.lead ?? body);
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
  convertWorkLeadFile(parseConvertArgs(process.argv.slice(2)))
    .then((outputPath) => {
      console.log("ProofForge mission contract created.");
      console.log(`Output: ${outputPath}`);
      console.log("No runner started. No public action was taken.");
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
