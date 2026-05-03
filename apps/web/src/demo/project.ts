export const demoProject = {
  name: "Docs Onboarding Sprint",
  status: "Active",
  purpose: "Turn install friction into accepted proof packets.",
  pool: "$240",
  people: "8",
  agents: "2",
  acceptedProof: "12",
  successRate: "91%",
  availablePool: "$160",
  opportunities: [
    {
      title: "Validate installation docs",
      detail: "Ensure install works on a clean Ubuntu machine.",
      reward: "$8",
      safety: "Safe",
      proofability: "91%",
      action: "Run"
    },
    {
      title: "Reproduce Windows build error",
      detail: "Capture logs and environment details.",
      reward: "$12",
      safety: "Low risk",
      proofability: "84%",
      action: "Run"
    },
    {
      title: "Improve quick start guide",
      detail: "Make first 5 minutes crystal clear.",
      reward: "$10",
      safety: "Safe",
      proofability: "88%",
      action: "Plan"
    },
    {
      title: "Verify PR fixes issue #4821",
      detail: "Confirm the fix works in all supported OS.",
      reward: "$18",
      safety: "Approval",
      proofability: "76%",
      action: "Review"
    }
  ],
  activeWork: [
    {
      lane: "Ready",
      count: "3",
      cards: [
        { title: "Check Mac install flow", meta: "$6 · 89%" },
        { title: "Validate config docs", meta: "$8 · 90%" },
        { title: "Fix broken links", meta: "$5 · 87%" }
      ]
    },
    {
      lane: "Running",
      count: "2",
      cards: [
        { title: "Validate install docs", meta: "docs-runner-01 · 60%" },
        { title: "Reproduce CLI crash", meta: "cli-runner-02 · 30%" }
      ]
    },
    {
      lane: "Needs review",
      count: "1",
      cards: [{ title: "Starter guide clarity", meta: "packet-4821 · 2h ago" }]
    },
    {
      lane: "Accepted",
      count: "2",
      cards: [
        { title: "Ubuntu install flow", meta: "+12 rep" },
        { title: "Docs fixes batch 1", meta: "+8 rep" }
      ]
    }
  ],
  benefits: [
    {
      label: "Contributor badge",
      threshold: "1 proof",
      status: "Unlocked",
      progress: 100
    },
    {
      label: "Reviewer eligibility",
      threshold: "3 proofs",
      status: "2 / 3",
      progress: 66
    },
    {
      label: "Early access tools",
      threshold: "5 proofs",
      status: "2 / 5",
      progress: 40
    },
    {
      label: "Steward role",
      threshold: "10 proofs",
      status: "2 / 10",
      progress: 20
    }
  ],
  proofLedger: {
    acceptedPackets: "12",
    pendingPackets: "3",
    earnedPayouts: "$240",
    latestProof: "packet_docs_install_demo",
    topContributors: ["Alex", "docsnode.eth"],
    history: [
      {
        label: "Install docs validated",
        detail: "Accepted by commons reviewer",
        value: "$8"
      },
      {
        label: "Windows crash reproduced",
        detail: "Maintainer-ready evidence",
        value: "$12"
      },
      {
        label: "Mac setup checked",
        detail: "Revision requested",
        value: "revise"
      }
    ]
  },
  peopleRoster: [
    { name: "Alex", role: "Proof node", status: "Active" },
    { name: "docsnode.eth", role: "Reviewer", status: "Active" },
    { name: "maintainer.alice", role: "Maintainer", status: "Pending" }
  ],
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

export const demoSourceConnections = [
  {
    name: "GitHub issues",
    state: "Live in demo",
    detail: "Imported public issue with repo, owner, and source URL."
  },
  {
    name: "Marketplace task",
    state: "Manual V1",
    detail: "Pasted buyer task; conversion waits for missing terms."
  },
  {
    name: "Wallet / receipt",
    state: "V2 signal",
    detail: "Reference only in V1. No custody or settlement."
  }
];

export const demoProjectLedgerRows = [
  {
    work: "Validate installation docs",
    source: "GitHub issue",
    proof: "packet_docs_install_demo",
    status: "Accepted",
    value: "$8 earned"
  },
  {
    work: "Starter guide clarity",
    source: "Project backlog",
    proof: "packet_starter_clarity",
    status: "Review",
    value: "+8 credit pending"
  },
  {
    work: "External QA task",
    source: "Marketplace",
    proof: "Work Lead",
    status: "Needs detail",
    value: "$25 external"
  }
];

export const demoV2Signals = [
  "GitHub contribution history import",
  "Wallet and receipt verification",
  "Foundry / Aderyn proof missions"
];

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

export const demoAgentIdentity = {
  id: "docs-runner-01",
  owner: "Alex",
  identityRef: "local:docs-runner-01",
  registryRef: "ERC-8004 / 8004scan-ready",
  skillRef: "ERC-8239 skill manifest-ready",
  type: "Local proof node",
  status: "Ready",
  project: "Docs Onboarding Sprint",
  acceptedProofs: "12",
  earnedCredit: "$63",
  allowed: [
    "Clone public repositories",
    "Run commands",
    "Capture logs",
    "Package evidence"
  ],
  skills: [
    "docs-validation",
    "repo-clone",
    "command-runner",
    "evidence-packager"
  ],
  skillAttestation:
    "V1 records skill use in the packet; V2 can anchor skill identity and skill-use events onchain.",
  blocked: ["Open PRs", "Post comments", "Spend funds", "Access secrets"]
};

export const demoCoordinationTrace = [
  {
    role: "Runner",
    actor: "docs-runner-01",
    action: "Captured command output and environment"
  },
  {
    role: "Verifier",
    actor: "verifier-01",
    action: "Checked artifacts independently"
  },
  {
    role: "Packager",
    actor: "packager-01",
    action: "Built case file and public-safe packet"
  },
  {
    role: "Human approval",
    actor: "Alex",
    action: "Approves before maintainer submission"
  }
];

export const demoMyWork = [
  {
    title: "Validate installation docs",
    project: "Docs Onboarding Sprint",
    state: "Ready to run",
    action: "Review mission",
    value: "$8 + credit"
  },
  {
    title: "External QA task imported",
    project: "Marketplace task",
    state: "Needs clarification",
    action: "Ask clarification",
    value: "$25 external"
  },
  {
    title: "packet_docs_install_demo",
    project: "Docs Onboarding Sprint",
    state: "Case file ready",
    action: "Submit proof",
    value: "+12 reputation"
  }
];
