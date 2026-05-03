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
  { label: "Run", detail: "Sandboxed work" },
  { label: "Verify", detail: "Independent checks" },
  { label: "Accept", detail: "Human review" },
  { label: "Earn", detail: "Payout, credit, access" }
];

export const demoSourcePipeline = [
  { label: "Imported", value: "8" },
  { label: "Proofable", value: "5" },
  { label: "Ready", value: "2" },
  { label: "Triage", value: "3" }
];

export const demoSourceTypes = [
  {
    name: "GitHub issue",
    detail: "Public bugs, PRs, docs requests",
    status: "Live import"
  },
  {
    name: "Marketplace job",
    detail: "Paid external work with buyer requirements",
    status: "Manual import"
  },
  {
    name: "Foundation backlog",
    detail: "Ecosystem maintenance work",
    status: "Planned"
  },
  {
    name: "Project backlog",
    detail: "Steward-created work for a tracked project",
    status: "Live demo"
  },
  {
    name: "Contribution history",
    detail: "GitHub work you already touched",
    status: "Planned"
  }
];

export const demoImportExample = {
  source: "GitHub issue",
  command:
    "npm run import:github -- --url https://github.com/microsoft/vscode/issues/1 --out demo-output/imports",
  result: "Creates a Work Lead. No comments, PRs, or payments are created."
};

export const demoEthGlobalImportExample = {
  source: "ETHGlobal submission requirements",
  command:
    'npm run import:ethglobal -- --event "Open Agents" --out demo-output/imports',
  result:
    "Reads hackathon sponsor requirements for ProofForge's own submission plan. This is not normal user work inventory."
};

export const demoExternalMarketExample = {
  source: "External marketplace",
  command: "Paste buyer request or marketplace job URL",
  result:
    "Creates a Work Lead with buyer, payout rail, missing info, and proof requirements."
};

export const demoProjectBacklogExample = {
  source: "Tracked project backlog",
  command: "Suggest work inside Docs Onboarding Sprint",
  result:
    "Creates project-linked work that can become a Mission after owner, proof, and value terms are clear."
};

export const demoBountySource = {
  sponsor: "External buyer",
  event: "Marketplace or foundation program",
  prize: "Proof-backed verification task",
  sourceUrl: "External task URL",
  valuePath: "External payout, reputation, access, or project credit",
  requirements: [
    "Acceptance owner is known",
    "Reward path or non-cash benefit is explicit",
    "Evidence artifacts are defined",
    "External submission requires human approval"
  ]
};
