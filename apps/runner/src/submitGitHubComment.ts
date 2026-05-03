import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseGitHubIssueUrl } from "@proofforge/sources";
import { loadLocalEnv } from "./loadLocalEnv";

interface SubmitArgs {
  issueUrl: string;
  packetPath: string;
  evidencePath: string;
  outputPath: string;
  dryRun: boolean;
}

export async function submitGitHubComment(args: SubmitArgs): Promise<string> {
  await loadLocalEnv();
  const ref = parseGitHubIssueUrl(args.issueUrl);
  const body = await renderCommentBody(args.packetPath, args.evidencePath);

  let result:
    | { status: "draft"; issueUrl: string; body: string }
    | { status: "posted"; issueUrl: string; commentUrl: string; body: string };

  if (args.dryRun) {
    result = { status: "draft", issueUrl: ref.htmlUrl, body };
  } else {
    const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
    if (!token) {
      throw new Error(
        "GITHUB_TOKEN or GH_TOKEN is required to post a comment."
      );
    }
    const response = await fetch(
      `https://api.github.com/repos/${ref.owner}/${ref.repo}/issues/${ref.issueNumber}/comments`,
      {
        method: "POST",
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
          "user-agent": "proofforge-maintainer-submitter"
        },
        body: JSON.stringify({ body })
      }
    );
    if (!response.ok) {
      throw new Error(`GitHub comment failed with status ${response.status}.`);
    }
    const payload = (await response.json()) as { html_url?: string };
    result = {
      status: "posted",
      issueUrl: ref.htmlUrl,
      commentUrl: payload.html_url ?? ref.htmlUrl,
      body
    };
  }

  await writeFile(args.outputPath, JSON.stringify(result, null, 2), "utf8");
  return args.outputPath;
}

async function renderCommentBody(packetPath: string, evidencePath: string) {
  const packet = JSON.parse(await readFile(packetPath, "utf8")) as {
    id: string;
    mission: { id: string; title: string; sourceUrl: string };
    status: string;
    verifierResult: { status: string };
    protocolRefs?: { storageUri?: string };
  };
  const evidence = JSON.parse(await readFile(evidencePath, "utf8")) as {
    artifacts: Record<string, string>;
  };

  return [
    "ProofForge packet ready for maintainer review.",
    "",
    `- Packet: ${packet.id}`,
    `- Mission: ${packet.mission.id}`,
    `- Source: ${packet.mission.sourceUrl}`,
    `- Status: ${packet.status}`,
    `- Verifier: ${packet.verifierResult.status}`,
    `- Storage: ${packet.protocolRefs?.storageUri ?? "local"}`,
    `- Public packet artifact: ${publicArtifactName(evidence.artifacts.publicPacket)}`,
    "",
    "The proof agent ran in evidence-only mode. It did not open a PR, post before approval, access secrets, or spend funds."
  ].join("\n");
}

function publicArtifactName(path: string | undefined): string {
  return path?.split("/").pop() ?? "public-packet.json";
}

function parseArgs(argv: string[]): SubmitArgs {
  const issueUrl = readFlag(argv, "--issue");
  if (!issueUrl) throw new Error("Missing --issue <github-issue-url>.");
  const packetPath = resolve(
    readFlag(argv, "--packet") ??
      "demo-output/docs-install/packet/evidence-packet.json"
  );
  const evidencePath = resolve(
    readFlag(argv, "--evidence") ??
      "demo-output/docs-install/packet/submission-evidence.json"
  );
  const outputPath = resolve(
    readFlag(argv, "--out") ??
      `${dirname(packetPath)}/github-maintainer-comment.json`
  );

  return {
    issueUrl,
    packetPath,
    evidencePath,
    outputPath,
    dryRun: !argv.includes("--post")
  };
}

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index === -1 ? undefined : argv[index + 1];
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  submitGitHubComment(parseArgs(process.argv.slice(2)))
    .then((outputPath) => {
      console.log("ProofForge GitHub maintainer comment prepared.");
      console.log(`Output: ${outputPath}`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
