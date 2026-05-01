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
    tone: "safe"
  },
  {
    title: "Validate installation docs",
    repo: "oss/docsync",
    reward: "$8",
    runtime: "30 min",
    risk: "Safe",
    tone: "safe"
  },
  {
    title: "Verify PR fixes issue #4821",
    repo: "subquery/subql",
    reward: "$18",
    runtime: "60 min",
    risk: "Approval",
    tone: "warning"
  }
];

export const demoSourcePipeline = [
  { label: "Imported", value: "8" },
  { label: "Proofable", value: "5" },
  { label: "Ready", value: "2" },
  { label: "Triage", value: "3" }
];

export const demoProject = {
  name: "Docs Onboarding Sprint",
  status: "Active",
  purpose: "Turn install friction into accepted proof packets.",
  pool: "$240",
  people: "1",
  agents: "0",
  acceptedProof: "1",
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

export const demoActivity = [
  "Proof packet generated",
  "Verifier checks passed",
  "Storage URI recorded",
  "Maintainer packet ready"
];
