export const demoMission = {
  title: "Validate installation docs",
  repo: "proofforge/fixture",
  reward: "$8",
  runtime: "30 min",
  risk: "Safe"
};

export const demoWork = [
  {
    title: "Reproduce CLI crash on Windows",
    repo: "polkadot-js/api",
    reward: "$12",
    runtime: "45 min",
    risk: "Low risk",
    owner: "Repo maintainer",
    tone: "safe"
  },
  {
    title: "Validate installation docs",
    repo: "oss/docsync",
    reward: "$8",
    runtime: "30 min",
    risk: "Safe",
    owner: "Commons reviewer",
    tone: "safe"
  },
  {
    title: "Verify PR fixes issue #4821",
    repo: "subquery/subql",
    reward: "$18",
    runtime: "60 min",
    risk: "Approval",
    owner: "Maintainer",
    tone: "warning"
  }
];

export const demoProofLoop = [
  { label: "Work", detail: "Existing issue or task" },
  { label: "Run", detail: "Sandboxed agent work" },
  { label: "Verify", detail: "Independent checks" },
  { label: "Packet", detail: "Evidence case file" },
  { label: "Credit", detail: "Reputation or payout" }
];

export const demoSourcePipeline = [
  { label: "Imported", value: "8" },
  { label: "Proofable", value: "5" },
  { label: "Ready", value: "2" },
  { label: "Triage", value: "3" }
];

export const demoSourceTypes = [
  { name: "GitHub issue", detail: "Public bugs, PRs, docs requests", status: "Live import" },
  { name: "Foundation backlog", detail: "Ecosystem maintenance work", status: "Planned" },
  { name: "Marketplace task", detail: "External QA and verification work", status: "Manual paste" },
  { name: "Community request", detail: "Project steward suggestions", status: "Manual paste" }
];

export const demoImportExample = {
  source: "GitHub issue",
  command: "npm run import:github -- --url https://github.com/microsoft/vscode/issues/1 --out demo-output/imports",
  result: "Creates a Work Lead. No comments, PRs, or payments are created."
};

export const demoProject = {
  name: "Docs Onboarding Sprint",
  status: "Active",
  purpose: "Turn install friction into accepted proof packets.",
  pool: "$240",
  people: "8",
  agents: "2",
  acceptedProof: "12",
  proofLedger: {
    acceptedPackets: "12",
    pendingPackets: "3",
    earnedPayouts: "$240",
    latestProof: "packet_docs_install_demo",
    topContributors: ["Alex", "docsnode.eth"]
  },
  agentDelegations: [
    {
      name: "docs-runner-01",
      status: "Active",
      allowed: "Docs checks, logs",
      blocked: "PRs, posts, payments"
    },
    {
      name: "issue-triage-01",
      status: "Review",
      allowed: "Import issues, score proofability",
      blocked: "Public comments"
    }
  ],
  lanes: ["Docs validation", "Bug reproduction"],
  backlog: [
    { title: "Validate installation docs", status: "mission-ready" },
    { title: "Check Mac install flow", status: "proofable" },
    { title: "Reproduce Windows build error", status: "needs triage" }
  ],
  credit: {
    contributor: "alex",
    packet: "packet_docs_install_demo",
    points: "12",
    payout: "payout_packet_docs_install_demo"
  }
};

export const demoWorkLead = {
  title: "External QA task imported",
  source: "Marketplace",
  rawRequest: "Buyer asks for proof checkout works in Chrome and Safari.",
  proofability: "72%",
  risk: "Medium",
  reward: "$25 external payout",
  acceptsProof: "External buyer",
  missing: "Exact browser versions",
  recommendation: "Ask one clarification before running.",
  canConvert: "Not yet",
  conversionReason: "Missing exact browser versions and acceptance contact.",
  nextQuestion: "Which Chrome and Safari versions should be tested?",
  categories: ["Marketplace task", "Browser QA", "Evidence-only"]
};

export const demoPacket = {
  id: "packet_docs_install_demo",
  objective: "Run the documented install check and prove whether it works in a clean environment.",
  summary: "The fixture install check failed because docs-ready.flag is missing. Runner artifacts and verifier checks passed.",
  artifacts: ["evidence-packet.json", "case-file.md", "runner-result.json", "stdout.log", "stderr.log", "environment.json"]
};

export const demoArtifacts = [
  {
    name: "evidence-packet.json",
    visibility: "Maintainer",
    purpose: "Full verified packet with mission, run, policy, verifier, and payout context."
  },
  {
    name: "case-file.md",
    visibility: "Maintainer",
    purpose: "Human-readable review surface for the packet."
  },
  {
    name: "policy.json",
    visibility: "Maintainer",
    purpose: "Policy decision showing the mission stayed local and evidence-only."
  },
  {
    name: "public-packet.json",
    visibility: "Public-safe",
    purpose: "Shareable proof summary with local paths and private refs removed."
  },
  {
    name: "payout.json",
    visibility: "Private",
    purpose: "Earned payout record created after acceptance."
  },
  {
    name: "project.json",
    visibility: "Project",
    purpose: "Project credit ledger showing who earned credit for accepted proof."
  }
];

export const demoPublicArtifacts = demoArtifacts.filter((artifact) => artifact.visibility === "Public-safe");

export const demoUnlockProgress = {
  currentTier: "Trusted Starter",
  nextTier: "Agent Delegation",
  acceptedPackets: 2,
  neededPackets: 5,
  percent: 40,
  nextReward: "Attach more project agents after 3 more accepted packets."
};

export const demoActivity = [
  "Proof packet generated",
  "Verifier checks passed",
  "Storage URI recorded",
  "Maintainer packet ready"
];
