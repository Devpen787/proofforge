import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { verifyAcceptanceSignatureRecord } from "./verifyAcceptanceSignature";

interface ProofNetworkRecordLike {
  id: string;
  packet?: {
    id?: string;
    mission?: string;
    project?: string;
    storage?: string;
    verifier?: string;
    acceptedBy?: string;
  };
  receipts?: {
    walletAddress?: string;
    walletProvider?: string;
    walletSignature?: string;
    walletMessage?: string;
    payoutReceipt?: string;
    zeroGReceipt?: string;
  };
  boundaries?: string[];
}

interface GitHubHandoffArgs {
  recordPath: string;
  issueUrl: string;
  outputDir: string;
}

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index === -1 ? undefined : argv[index + 1];
}

export function parseGitHubHandoffArgs(argv: string[]): GitHubHandoffArgs {
  const recordPath = readFlag(argv, "--record");
  const issueUrl = readFlag(argv, "--issue-url");

  if (!recordPath || !issueUrl) {
    throw new Error(
      "Usage: npm run github:handoff -- --record <proof-network-record.json> --issue-url <github-issue-url>"
    );
  }

  return {
    recordPath: resolve(recordPath),
    issueUrl,
    outputDir:
      readFlag(argv, "--out") ?? resolve(dirname(recordPath), "github-handoff")
  };
}

function parseIssueUrl(issueUrl: string) {
  const match = issueUrl.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)(?:[/?#].*)?$/
  );
  if (!match) {
    throw new Error(
      "Issue URL must look like https://github.com/OWNER/REPO/issues/NUMBER."
    );
  }

  return {
    owner: match[1],
    repo: match[2],
    issueNumber: match[3],
    repoSlug: `${match[1]}/${match[2]}`
  };
}

function commandFor(issueUrl: string) {
  return `gh issue comment ${issueUrl} --body-file proof-comment.md`;
}

function commentFor(record: ProofNetworkRecordLike, issueUrl: string) {
  const signature = verifyAcceptanceSignatureRecord(record);
  const lines = [
    "ProofForge proof packet ready for maintainer review.",
    "",
    `Source: ${issueUrl}`,
    `Record: ${record.id}`,
    `Packet: ${record.packet?.id ?? "unknown"}`,
    `Project: ${record.packet?.project ?? "unknown"}`,
    `Mission: ${record.packet?.mission ?? "unknown"}`,
    `Verifier: ${record.packet?.verifier ?? "unknown"}`,
    `Storage: ${record.receipts?.zeroGReceipt ?? record.packet?.storage ?? "local"}`,
    `Acceptance signature: ${signature.status}${signature.method ? ` (${signature.method})` : ""}`,
    record.receipts?.walletAddress
      ? `Reviewer wallet: ${record.receipts.walletAddress}`
      : "Reviewer wallet: not recorded",
    record.receipts?.payoutReceipt
      ? `Payout receipt: ${record.receipts.payoutReceipt}`
      : "Payout receipt: not released yet",
    "",
    "Boundaries:",
    "- ProofForge prepared evidence and review context.",
    "- GitHub remains the source of repo authority.",
    "- No PR, comment, or payout was created before human approval."
  ];

  return `${lines.join("\n")}\n`;
}

export async function createGitHubHandoff(
  args: GitHubHandoffArgs
): Promise<string> {
  const record = JSON.parse(
    await readFile(args.recordPath, "utf8")
  ) as ProofNetworkRecordLike;
  const issue = parseIssueUrl(args.issueUrl);
  const outputDir = resolve(args.outputDir);
  await mkdir(outputDir, { recursive: true });

  const commentPath = join(outputDir, "proof-comment.md");
  const manifestPath = join(outputDir, "github-handoff.json");
  await writeFile(commentPath, commentFor(record, args.issueUrl), "utf8");
  await writeFile(
    manifestPath,
    JSON.stringify(
      {
        version: "proof-github-handoff/v1",
        recordId: record.id,
        issueUrl: args.issueUrl,
        repo: issue.repoSlug,
        issueNumber: issue.issueNumber,
        command: commandFor(args.issueUrl),
        files: {
          comment: commentPath
        },
        boundaries: [
          "ProofForge does not hold GitHub credentials.",
          "The user or maintainer posts with their own GitHub CLI/session.",
          "GitHub remains the authoritative issue and PR system."
        ]
      },
      null,
      2
    ),
    "utf8"
  );

  return manifestPath;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  createGitHubHandoff(parseGitHubHandoffArgs(process.argv.slice(2)))
    .then((outputPath) => {
      console.log("ProofForge GitHub handoff written.");
      console.log(`Manifest: ${outputPath}`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
