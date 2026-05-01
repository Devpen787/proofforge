import type { WorkLead } from "@proofforge/mission";
import { parseWorkLead } from "@proofforge/mission";

export interface GitHubIssueRef {
  owner: string;
  repo: string;
  issueNumber: number;
  apiUrl: string;
  htmlUrl: string;
}

export interface GitHubIssuePayload {
  html_url: string;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  labels: Array<string | { name?: string | null }>;
  user?: { login?: string | null } | null;
  repository_url?: string;
}

export interface WorkSourceImport {
  source: "github";
  importedAt: string;
  ref: GitHubIssueRef;
  lead: WorkLead;
  diagnosis: {
    proofability: number;
    missing: string[];
    recommendation: string;
  };
}

export type IssueFetch = (url: string, init?: { headers?: Record<string, string> }) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

export function parseGitHubIssueUrl(input: string): GitHubIssueRef {
  const url = new URL(input);
  if (url.hostname !== "github.com") {
    throw new Error("Only github.com issue URLs are supported.");
  }

  const [owner, repo, section, number] = url.pathname.split("/").filter(Boolean);
  if (!owner || !repo || section !== "issues" || !number || !/^\d+$/.test(number)) {
    throw new Error("Expected a GitHub issue URL like https://github.com/owner/repo/issues/123.");
  }

  return {
    owner,
    repo,
    issueNumber: Number(number),
    apiUrl: `https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
    htmlUrl: `https://github.com/${owner}/${repo}/issues/${number}`
  };
}

export async function importGitHubIssueLead(input: {
  url: string;
  fetch?: IssueFetch;
  now?: Date;
}): Promise<WorkSourceImport> {
  const ref = parseGitHubIssueUrl(input.url);
  const fetcher = input.fetch ?? globalThis.fetch;
  if (!fetcher) {
    throw new Error("No fetch implementation available.");
  }

  const response = await fetcher(ref.apiUrl, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "proofforge-source-importer"
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub issue import failed with status ${response.status}.`);
  }

  const issue = parseGitHubIssuePayload(await response.json());
  const labels = issue.labels.map(labelName);
  const missing = diagnoseMissingInfo(issue, labels);
  const proofability = scoreProofability(issue, labels, missing);
  const recommendation = buildRecommendation(proofability, missing);

  return {
    source: "github",
    importedAt: (input.now ?? new Date()).toISOString(),
    ref,
    lead: parseWorkLead({
      id: `github_${ref.owner}_${ref.repo}_${ref.issueNumber}`.toLowerCase(),
      sourceType: "github_issue",
      sourceUrl: ref.htmlUrl,
      title: issue.title,
      rawRequest: issue.body?.trim() || issue.title,
      repo: `${ref.owner}/${ref.repo}`,
      acceptanceOwner: issue.user?.login ? `@${issue.user.login}` : "GitHub issue owner",
      desiredEvidence: desiredEvidenceFor(labels, issue.title),
      riskLevel: labels.some((label) => label.includes("security")) ? "high" : "low",
      proofability,
      status: proofability >= 80 && missing.length === 0 ? "mission_ready" : "needs_triage",
      reward: {
        amount: 0,
        currency: "USD",
        type: "reputation"
      },
      missing,
      blockedActions: [
        "open pull requests without approval",
        "post public comments without approval",
        "use repository secrets",
        "modify maintainer settings"
      ]
    }),
    diagnosis: {
      proofability,
      missing,
      recommendation
    }
  };
}

function parseGitHubIssuePayload(input: unknown): GitHubIssuePayload {
  if (!input || typeof input !== "object") {
    throw new Error("GitHub response was not an issue object.");
  }

  const issue = input as Partial<GitHubIssuePayload> & { pull_request?: unknown };
  if (issue.pull_request) {
    throw new Error("GitHub pull request URLs should use a PR verifier import path.");
  }
  if (!issue.html_url || !issue.title || !issue.number) {
    throw new Error("GitHub issue response is missing required fields.");
  }

  return {
    html_url: issue.html_url,
    number: issue.number,
    title: issue.title,
    body: issue.body ?? null,
    state: issue.state ?? "open",
    labels: issue.labels ?? [],
    user: issue.user ?? null,
    repository_url: issue.repository_url
  };
}

function labelName(label: string | { name?: string | null }): string {
  return (typeof label === "string" ? label : label.name || "").toLowerCase();
}

function diagnoseMissingInfo(issue: GitHubIssuePayload, labels: string[]): string[] {
  const body = issue.body?.toLowerCase() || "";
  const missing: string[] = [];

  if (!body.includes("repro") && !body.includes("steps") && !labels.some((label) => label.includes("repro"))) {
    missing.push("reproduction steps");
  }
  if (!body.includes("expected") && !body.includes("actual")) {
    missing.push("expected vs actual behavior");
  }
  if (!body.includes("version") && !body.includes("node") && !body.includes("python") && !body.includes("os")) {
    missing.push("environment details");
  }

  return missing;
}

function scoreProofability(issue: GitHubIssuePayload, labels: string[], missing: string[]): number {
  let score = 58;
  const body = issue.body?.toLowerCase() || "";

  if (issue.state === "open") score += 8;
  if (labels.some((label) => label.includes("bug"))) score += 8;
  if (labels.some((label) => label.includes("help") || label.includes("good first"))) score += 6;
  if (labels.some((label) => label.includes("repro"))) score += 10;
  if (body.includes("```")) score += 8;
  if (body.includes("error") || body.includes("crash") || body.includes("fail")) score += 8;
  score -= missing.length * 9;

  return Math.max(0, Math.min(100, score));
}

function desiredEvidenceFor(labels: string[], title: string): string[] {
  const lowerTitle = title.toLowerCase();
  if (labels.some((label) => label.includes("docs")) || lowerTitle.includes("docs")) {
    return ["command transcript", "environment manifest", "broken documentation step"];
  }

  return ["reproduction command", "runner logs", "environment manifest", "maintainer-ready summary"];
}

function buildRecommendation(proofability: number, missing: string[]): string {
  if (proofability >= 80 && missing.length === 0) {
    return "Convert to a mission. The issue has enough structure to produce a useful proof packet.";
  }
  if (missing.length > 0) {
    return `Ask for ${missing.join(", ")} before running agents.`;
  }
  return "Keep as a work lead until an acceptance owner or evidence path is clearer.";
}
