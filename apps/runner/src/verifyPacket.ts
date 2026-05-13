import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  verifyEvidencePacket,
  type PacketVerificationFinding
} from "@proofforge/verifier";

interface CliOptions {
  packetPath: string;
  artifactBaseDir?: string;
  json: boolean;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const packetPath = resolve(options.packetPath);
  const packet = JSON.parse(await readFile(packetPath, "utf8"));
  const report = await verifyEvidencePacket({
    packet,
    artifactBaseDir: options.artifactBaseDir ?? dirname(packetPath)
  });

  if (options.json) {
    process.stdout.write(
      `${JSON.stringify(
        {
          ok: report.ok,
          protocolVersion: report.protocolVersion,
          digest: report.digest,
          findings: report.findings
        },
        null,
        2
      )}\n`
    );
  } else {
    process.stdout.write(renderReport(report));
  }

  if (!report.ok) {
    process.exitCode = 1;
  }
}

function parseArgs(args: string[]): CliOptions {
  const positional: string[] = [];
  let artifactBaseDir: string | undefined;
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--artifact-base-dir") {
      artifactBaseDir = requireValue(args, index, arg);
      index += 1;
      continue;
    }
    if (arg.startsWith("--artifact-base-dir=")) {
      artifactBaseDir = arg.slice("--artifact-base-dir=".length);
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
    positional.push(arg);
  }

  const packetPath = positional[0];
  if (!packetPath) {
    printHelp();
    throw new Error("Missing packet path.");
  }

  return {
    packetPath,
    artifactBaseDir: artifactBaseDir ? resolve(artifactBaseDir) : undefined,
    json
  };
}

function requireValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}.`);
  }
  return value;
}

function printHelp(): void {
  process.stdout.write(`Usage:
  npm run verify:packet -- <packet.json> [--artifact-base-dir <dir>] [--json]

Verifies a ProofForge Evidence Packet as PFEP-v0 proof.
`);
}

function renderReport(report: {
  ok: boolean;
  protocolVersion: string;
  digest: string | null;
  findings: PacketVerificationFinding[];
}): string {
  const lines = [
    `ProofForge packet verification: ${report.ok ? "passed" : "failed"}`,
    `Protocol: ${report.protocolVersion}`,
    `Digest: ${report.digest ?? "unavailable"}`
  ];

  if (report.findings.length === 0) {
    lines.push("Findings: none");
  } else {
    lines.push("Findings:");
    for (const finding of report.findings) {
      lines.push(
        `- [${finding.severity}] ${finding.code}: ${finding.message}${
          finding.path ? ` (${finding.path})` : ""
        }`
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`verify:packet failed: ${message}\n`);
  process.exitCode = 1;
});
