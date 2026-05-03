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

export interface EthGlobalPrizePayload {
  name: string;
  about?: string;
  docs?: unknown[];
  prizes: Array<{
    title: string;
    description: string;
    qualifications?: string;
  }>;
}

export interface EthGlobalPrizeImport {
  source: "ethglobal";
  importedAt: string;
  event: string;
  leads: WorkLead[];
  sponsors: number;
  prizeCount: number;
}

export const ethAgentSourceCategories = [
  "open_source_rewards",
  "task_marketplace",
  "grant_program",
  "security_bounty",
  "hackathon_prize",
  "agent_payment_rail",
  "agent_marketplace"
] as const;

export const adapterStatuses = [
  "live",
  "manual_reference",
  "planned",
  "research_only"
] as const;

export type EthAgentSourceCategory = (typeof ethAgentSourceCategories)[number];

export type AdapterStatus = (typeof adapterStatuses)[number];

export interface EthAgentSourceCatalogEntry {
  id: string;
  name: string;
  category: EthAgentSourceCategory;
  adapterStatus: AdapterStatus;
  homepageUrl: string;
  docsUrl?: string;
  developerDocsUrl?: string;
  opportunityUrl?: string;
  paymentNotes: string;
  bestFor: string[];
  sourceTypes: WorkLead["sourceType"][];
  requiredQualification: string[];
  blockedClaims: string[];
}

export const ethAgentSourceCatalog: EthAgentSourceCatalogEntry[] = [
  {
    id: "github-issues",
    name: "GitHub Issues",
    category: "open_source_rewards",
    adapterStatus: "live",
    homepageUrl: "https://github.com/",
    developerDocsUrl: "https://docs.github.com/en/rest/issues",
    opportunityUrl:
      "https://github.com/search?q=label%3A%22good+first+issue%22+label%3A%22help+wanted%22&type=issues",
    paymentNotes:
      "Usually reputation-only unless linked to an external bounty, grant, or sponsor program.",
    bestFor: [
      "bug reproduction",
      "docs validation",
      "failing test generation",
      "PR verification"
    ],
    sourceTypes: ["github_issue", "github_pr"],
    requiredQualification: [
      "canonical issue or PR URL",
      "repository",
      "acceptance owner",
      "proof objective",
      "required evidence"
    ],
    blockedClaims: [
      "do not imply payment unless a bounty or reward source is explicit",
      "do not post comments or open PRs without approval"
    ]
  },
  {
    id: "ethglobal",
    name: "ETHGlobal Sponsor Prizes",
    category: "hackathon_prize",
    adapterStatus: "live",
    homepageUrl: "https://ethglobal.com/",
    docsUrl: "https://ethglobal.com/events",
    opportunityUrl: "https://ethglobal.com/events",
    paymentNotes:
      "Prize payment depends on event and sponsor rules; ProofForge can track requirements and evidence, not award decisions.",
    bestFor: [
      "sponsor requirement tracking",
      "integration evidence",
      "demo readiness",
      "submission checklist proof"
    ],
    sourceTypes: ["ethglobal_prize"],
    requiredQualification: [
      "event",
      "sponsor",
      "prize requirements",
      "submission artifacts",
      "human approval before submission"
    ],
    blockedClaims: [
      "do not claim sponsor integration without evidence",
      "do not submit hackathon projects automatically"
    ]
  },
  {
    id: "onlydust",
    name: "OnlyDust",
    category: "open_source_rewards",
    adapterStatus: "manual_reference",
    homepageUrl: "https://www.onlydust.com/",
    docsUrl: "https://docs.onlydust.com/",
    opportunityUrl: "https://app.onlydust.com/",
    paymentNotes:
      "Contributor rewards depend on project budgets and ecosystem rules; payments may be crypto or fiat depending on the program.",
    bestFor: [
      "funded OSS contributions",
      "docs work",
      "issue fixes",
      "reviewable project contribution proof"
    ],
    sourceTypes: ["bounty_source", "foundation_backlog"],
    requiredQualification: [
      "OnlyDust project",
      "linked repository or task",
      "reward path",
      "acceptance owner",
      "submission requirements"
    ],
    blockedClaims: [
      "do not advertise guaranteed reward without source terms",
      "do not treat contribution activity as accepted credit automatically"
    ]
  },
  {
    id: "dework",
    name: "Dework",
    category: "task_marketplace",
    adapterStatus: "manual_reference",
    homepageUrl: "https://dework.xyz/",
    docsUrl: "https://dework.gitbook.io/",
    opportunityUrl: "https://dework.xyz/",
    paymentNotes:
      "External marketplace payment; ProofForge should track buyer, requirements, reward asset, and receipt references only.",
    bestFor: [
      "DAO tasks",
      "marketplace work",
      "bounty-like scoped requests",
      "buyer review packets"
    ],
    sourceTypes: ["marketplace_task", "bounty_source"],
    requiredQualification: [
      "buyer or workspace",
      "canonical task URL",
      "payout method",
      "required artifacts",
      "acceptance owner"
    ],
    blockedClaims: [
      "do not imply ProofForge custody",
      "do not submit externally without approval"
    ]
  },
  {
    id: "gitcoin-grants",
    name: "Gitcoin Grants",
    category: "grant_program",
    adapterStatus: "manual_reference",
    homepageUrl: "https://grants.gitcoin.co/",
    docsUrl: "https://gitcoin.co/apps/gitcoin-grants-stack",
    opportunityUrl: "https://grants.gitcoin.co/",
    paymentNotes:
      "Grant funding is round-specific and usually project-level; ProofForge should track milestone evidence, not represent grants as small guaranteed tasks.",
    bestFor: [
      "public goods funding evidence",
      "milestone proof",
      "impact reporting",
      "maintenance proof"
    ],
    sourceTypes: ["foundation_backlog", "bounty_source"],
    requiredQualification: [
      "grant round",
      "project profile",
      "funding terms",
      "milestones",
      "review owner"
    ],
    blockedClaims: [
      "do not show as paid task unless award terms are explicit",
      "do not treat donation/funding as proof of contribution"
    ]
  },
  {
    id: "ethereum-foundation-esp",
    name: "Ethereum Foundation Ecosystem Support Program",
    category: "grant_program",
    adapterStatus: "manual_reference",
    homepageUrl: "https://esp.ethereum.foundation/",
    docsUrl: "https://esp.ethereum.foundation/applicants",
    opportunityUrl: "https://esp.ethereum.foundation/wishlist",
    paymentNotes:
      "Grant funding is application and milestone based; ProofForge can package open-source delivery evidence.",
    bestFor: [
      "Ethereum public goods",
      "infrastructure grants",
      "research deliverables",
      "milestone verification"
    ],
    sourceTypes: ["foundation_backlog"],
    requiredQualification: [
      "wishlist or RFP link",
      "open-source output",
      "milestone terms",
      "review owner",
      "evidence artifacts"
    ],
    blockedClaims: [
      "do not imply EF acceptance before review",
      "do not treat grant application as task approval"
    ]
  },
  {
    id: "immunefi",
    name: "Immunefi",
    category: "security_bounty",
    adapterStatus: "manual_reference",
    homepageUrl: "https://immunefi.com/",
    docsUrl: "https://immunefi.com/explore/",
    opportunityUrl: "https://immunefi.com/explore/",
    paymentNotes:
      "Rewards are program-specific; the bounty page defines scope, severity, payout rules, and safe harbor.",
    bestFor: [
      "smart contract vulnerability reports",
      "protocol security review",
      "safe proof-of-concept evidence",
      "patch verification"
    ],
    sourceTypes: ["bounty_source"],
    requiredQualification: [
      "program URL",
      "in-scope target",
      "impact category",
      "disclosure rules",
      "non-destructive proof requirements"
    ],
    blockedClaims: [
      "do not run exploitative actions",
      "do not submit speculative findings as verified",
      "do not disclose publicly before program approval"
    ]
  },
  {
    id: "cantina",
    name: "Cantina",
    category: "security_bounty",
    adapterStatus: "manual_reference",
    homepageUrl: "https://cantina.xyz/",
    docsUrl: "https://docs.cantina.xyz/",
    opportunityUrl: "https://cantina.xyz/competitions",
    paymentNotes:
      "Contest and bounty payouts are defined by the relevant competition, program, or engagement.",
    bestFor: [
      "audit contest evidence",
      "smart contract review packets",
      "finding reproduction",
      "fix verification"
    ],
    sourceTypes: ["bounty_source"],
    requiredQualification: [
      "competition or program URL",
      "scope",
      "submission deadline",
      "severity rules",
      "report requirements"
    ],
    blockedClaims: [
      "do not claim finding validity before review",
      "do not bypass contest submission rules"
    ]
  },
  {
    id: "x402",
    name: "x402",
    category: "agent_payment_rail",
    adapterStatus: "research_only",
    homepageUrl: "https://www.x402.org/",
    docsUrl: "https://docs.cdp.coinbase.com/x402/docs/client-server-model",
    developerDocsUrl:
      "https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works",
    opportunityUrl: "https://docs.cdp.coinbase.com/x402/bazaar",
    paymentNotes:
      "Useful for charging agents per request or paying for APIs; it is a payment rail, not a work source by itself.",
    bestFor: [
      "paid API endpoints",
      "agent-to-service payments",
      "per-request tool access",
      "service discovery through x402 Bazaar"
    ],
    sourceTypes: ["marketplace_task", "bounty_source"],
    requiredQualification: [
      "service endpoint",
      "price",
      "network and token",
      "facilitator",
      "spend limits",
      "receipt logging"
    ],
    blockedClaims: [
      "do not imply ProofForge supports live settlement until implemented",
      "do not let agents spend without policy limits and approval"
    ]
  },
  {
    id: "olas",
    name: "Olas",
    category: "agent_marketplace",
    adapterStatus: "research_only",
    homepageUrl: "https://olas.network/",
    docsUrl: "https://docs.olas.network/",
    developerDocsUrl: "https://docs.olas.network/open-autonomy/",
    opportunityUrl: "https://build.olas.network/dev-incentives",
    paymentNotes:
      "Rewards and service monetization depend on Olas programs, staking, Mech Marketplace demand, and protocol rules.",
    bestFor: [
      "agent service development",
      "agent operation",
      "developer incentives",
      "service proof packets"
    ],
    sourceTypes: ["bounty_source", "foundation_backlog"],
    requiredQualification: [
      "program or service URL",
      "agent/service requirements",
      "reward terms",
      "operator responsibilities",
      "accepted proof shape"
    ],
    blockedClaims: [
      "do not imply guaranteed agent income",
      "do not claim registry/reputation support until integrated"
    ]
  },
  {
    id: "nevermined",
    name: "Nevermined",
    category: "agent_payment_rail",
    adapterStatus: "research_only",
    homepageUrl: "https://nevermined.ai/",
    docsUrl: "https://nevermined.ai/docs",
    developerDocsUrl:
      "https://docs.nevermined.app/docs/getting-started/quickstart",
    opportunityUrl:
      "https://docs.nevermined.app/docs/development-guide/registration",
    paymentNotes:
      "Useful for registering paid agents, APIs, and plans; ProofForge should treat it as payment/access metadata until integrated.",
    bestFor: [
      "paid agent APIs",
      "plan-based access",
      "usage-gated services",
      "agent monetization evidence"
    ],
    sourceTypes: ["marketplace_task", "bounty_source"],
    requiredQualification: [
      "agent or API endpoint",
      "plan terms",
      "entitlement check",
      "buyer requirements",
      "receipt or access record"
    ],
    blockedClaims: [
      "do not imply live payment-plan validation until implemented",
      "do not treat access purchase as accepted work proof"
    ]
  }
];

export function listEthAgentSourceCatalog(input?: {
  category?: EthAgentSourceCategory;
  adapterStatus?: AdapterStatus;
}): EthAgentSourceCatalogEntry[] {
  return ethAgentSourceCatalog.filter((entry) => {
    if (input?.category && entry.category !== input.category) return false;
    if (input?.adapterStatus && entry.adapterStatus !== input.adapterStatus) {
      return false;
    }
    return true;
  });
}

export function getEthAgentSourceCatalogEntry(
  id: string
): EthAgentSourceCatalogEntry {
  const entry = ethAgentSourceCatalog.find((source) => source.id === id);
  if (!entry) throw new Error(`Unknown ETH agent source: ${id}.`);
  return entry;
}

export type IssueFetch = (
  url: string,
  init?: { headers?: Record<string, string> }
) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

export type JsonFetch = (
  url: string,
  init?: { headers?: Record<string, string> }
) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

export function parseGitHubIssueUrl(input: string): GitHubIssueRef {
  const url = new URL(input);
  if (url.hostname !== "github.com") {
    throw new Error("Only github.com issue URLs are supported.");
  }

  const [owner, repo, section, number] = url.pathname
    .split("/")
    .filter(Boolean);
  if (
    !owner ||
    !repo ||
    section !== "issues" ||
    !number ||
    !/^\d+$/.test(number)
  ) {
    throw new Error(
      "Expected a GitHub issue URL like https://github.com/owner/repo/issues/123."
    );
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
    throw new Error(
      `GitHub issue import failed with status ${response.status}.`
    );
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
      acceptanceOwner: issue.user?.login
        ? `@${issue.user.login}`
        : "GitHub issue owner",
      sponsor: ref.owner,
      desiredEvidence: desiredEvidenceFor(labels, issue.title),
      submissionRequirements: [
        {
          label: "Canonical public issue",
          detail: ref.htmlUrl,
          required: true
        },
        {
          label: "Maintainer-ready evidence",
          detail:
            "Proof Pack must include logs, environment, verifier result, and a summary that can be posted only after approval.",
          required: true
        }
      ],
      riskLevel: labels.some((label) => label.includes("security"))
        ? "high"
        : "low",
      proofability,
      status:
        proofability >= 80 && missing.length === 0
          ? "mission_ready"
          : "needs_triage",
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

export async function importEthGlobalPrizeLeads(input: {
  event: string;
  fetch?: JsonFetch;
  now?: Date;
}): Promise<EthGlobalPrizeImport> {
  const event = input.event.trim();
  if (!event) throw new Error("ETHGlobal event is required.");

  const fetcher = input.fetch ?? globalThis.fetch;
  if (!fetcher) throw new Error("No fetch implementation available.");

  const url = `https://ethglobalskills.vercel.app/api/prizes?event=${encodeURIComponent(event)}`;
  const response = await fetcher(url, {
    headers: {
      accept: "application/json",
      "user-agent": "proofforge-source-importer"
    }
  });
  if (!response.ok) {
    throw new Error(
      `ETHGlobal prize import failed with status ${response.status}.`
    );
  }

  const payload = await response.json();
  const sponsors = parseEthGlobalPrizeResults(payload);
  const sourceUrl = `https://ethglobal.com/events/${slugify(event)}`;
  const leads = sponsors.flatMap((sponsor) =>
    sponsor.prizes.map((prize, index) =>
      parseWorkLead({
        id: `ethglobal_${slugify(event)}_${slugify(sponsor.name)}_${index + 1}`,
        sourceType: "ethglobal_prize",
        sourceUrl,
        title: `${sponsor.name}: ${prize.title}`,
        rawRequest: [prize.description, prize.qualifications]
          .filter(Boolean)
          .join("\n\n"),
        repo: `${slugify(sponsor.name)}/ethglobal-${slugify(event)}`,
        acceptanceOwner: sponsor.name,
        sponsor: sponsor.name,
        bountyUrl: sourceUrl,
        desiredEvidence: [
          "public repository link",
          "setup or run instructions",
          "working demo evidence",
          "protocol-use explanation",
          "maintainer-ready proof packet"
        ],
        submissionRequirements: extractPrizeRequirements(prize),
        riskLevel: "medium",
        proofability: prize.qualifications ? 84 : 72,
        status: prize.qualifications ? "proofable" : "needs_triage",
        reward: {
          amount: 0,
          currency: "Sponsor prize",
          type: "external"
        },
        missing: prize.qualifications ? [] : ["sponsor qualification details"],
        blockedActions: [
          "submit hackathon project without human approval",
          "claim sponsor integration without evidence",
          "sign transactions or spend funds",
          "publish private keys or wallet secrets"
        ]
      })
    )
  );

  return {
    source: "ethglobal",
    importedAt: (input.now ?? new Date()).toISOString(),
    event,
    leads,
    sponsors: sponsors.length,
    prizeCount: leads.length
  };
}

function parseGitHubIssuePayload(input: unknown): GitHubIssuePayload {
  if (!input || typeof input !== "object") {
    throw new Error("GitHub response was not an issue object.");
  }

  const issue = input as Partial<GitHubIssuePayload> & {
    pull_request?: unknown;
  };
  if (issue.pull_request) {
    throw new Error(
      "GitHub pull request URLs should use a PR verifier import path."
    );
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

function diagnoseMissingInfo(
  issue: GitHubIssuePayload,
  labels: string[]
): string[] {
  const body = issue.body?.toLowerCase() || "";
  const missing: string[] = [];

  if (
    !body.includes("repro") &&
    !body.includes("steps") &&
    !labels.some((label) => label.includes("repro"))
  ) {
    missing.push("reproduction steps");
  }
  if (!body.includes("expected") && !body.includes("actual")) {
    missing.push("expected vs actual behavior");
  }
  if (
    !body.includes("version") &&
    !body.includes("node") &&
    !body.includes("python") &&
    !body.includes("os")
  ) {
    missing.push("environment details");
  }

  return missing;
}

function scoreProofability(
  issue: GitHubIssuePayload,
  labels: string[],
  missing: string[]
): number {
  let score = 58;
  const body = issue.body?.toLowerCase() || "";

  if (issue.state === "open") score += 8;
  if (labels.some((label) => label.includes("bug"))) score += 8;
  if (
    labels.some(
      (label) => label.includes("help") || label.includes("good first")
    )
  )
    score += 6;
  if (labels.some((label) => label.includes("repro"))) score += 10;
  if (body.includes("```")) score += 8;
  if (body.includes("error") || body.includes("crash") || body.includes("fail"))
    score += 8;
  score -= missing.length * 9;

  return Math.max(0, Math.min(100, score));
}

function desiredEvidenceFor(labels: string[], title: string): string[] {
  const lowerTitle = title.toLowerCase();
  if (
    labels.some((label) => label.includes("docs")) ||
    lowerTitle.includes("docs")
  ) {
    return [
      "command transcript",
      "environment manifest",
      "broken documentation step"
    ];
  }

  return [
    "reproduction command",
    "runner logs",
    "environment manifest",
    "maintainer-ready summary"
  ];
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

function parseEthGlobalPrizeResults(input: unknown): EthGlobalPrizePayload[] {
  if (!input || typeof input !== "object") {
    throw new Error("ETHGlobal response was not an object.");
  }
  const results = (input as { results?: unknown }).results;
  if (!Array.isArray(results)) {
    throw new Error("ETHGlobal response is missing results.");
  }

  return results
    .filter((item): item is EthGlobalPrizePayload => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<EthGlobalPrizePayload>;
      return Boolean(candidate.name && Array.isArray(candidate.prizes));
    })
    .map((item) => ({
      name: item.name,
      about: item.about,
      docs: item.docs ?? [],
      prizes: item.prizes.filter((prize) => prize.title && prize.description)
    }));
}

function extractPrizeRequirements(
  prize: EthGlobalPrizePayload["prizes"][number]
) {
  const qualification = prize.qualifications?.trim();
  const requirements = [
    {
      label: "Public project submission",
      detail:
        "Submission must include a public project/repository or demo artifact reviewers can inspect.",
      required: true
    },
    {
      label: "Protocol-use proof",
      detail:
        "Proof Pack must explain which sponsor API, SDK, contract, or protocol feature was used.",
      required: true
    }
  ];

  if (qualification) {
    requirements.push({
      label: "Sponsor qualification",
      detail: qualification.replace(/\s+/g, " "),
      required: true
    });
  }

  return requirements;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
