export const demoBuilderPassport = {
  contributorId: "contributor_alex",
  handle: "alex",
  displayName: "Alex",
  observedCount: 7,
  acceptedProofCount: 2,
  linkedValueSignalCount: 1,
  agentRunCount: 5,
  projectIds: ["docs-onboarding", "bug-repro-guild", "sdk-onboarding"],
  specialties: ["docs-validation", "bug-reproduction", "browser-qa"],
  proofPoints: 24
};

export const demoObservedContributions = [
  {
    title: "Improve docs install steps",
    project: "Docs Onboarding Sprint",
    source: "GitHub PR",
    status: "Observed",
    value: "Needs proof link"
  },
  {
    title: "Validate installation docs",
    project: "Docs Onboarding Sprint",
    source: "Proof Pack",
    status: "Accepted",
    value: "$8 earned"
  },
  {
    title: "External checkout QA task",
    project: "Marketplace task",
    source: "Manual source",
    status: "Needs proof",
    value: "$25 external"
  }
];

export const demoPassportSignals = [
  {
    label: "GitHub history",
    value: "Import command ready",
    tone: "good" as const
  },
  {
    label: "Credit boundary",
    value: "Observed is not accepted",
    tone: "bad" as const
  },
  {
    label: "Accepted proof",
    value: "2 packets",
    tone: "good" as const
  },
  {
    label: "Wallet receipt",
    value: "Linked after acceptance",
    tone: "good" as const
  },
  {
    label: "Agent history",
    value: "5 owner-rolled runs",
    tone: "good" as const
  }
];

export const demoProjectRecommendations = [
  {
    project: "Docs Onboarding Sprint",
    reason: "Accepted docs proof and active runner history",
    next: "Validate config docs"
  },
  {
    project: "Bug Repro Guild",
    reason: "Observed GitHub activity needs proof linkage",
    next: "Reproduce Windows build error"
  },
  {
    project: "SDK Onboarding",
    reason: "Similar docs-validation specialty",
    next: "Check Mac install flow"
  }
];

export const demoHackathonPrizeReadiness = [
  {
    label: "Repository proof",
    detail: "Public repo, setup notes, and sponsor-readable source.",
    status: "Required",
    field: "sourceUrl"
  },
  {
    label: "Protocol-use proof",
    detail: "Show the sponsor API, SDK, contract, or protocol path used.",
    status: "Required",
    field: "integrationSummary"
  },
  {
    label: "Feedback file",
    detail: "Track sponsor-requested FEEDBACK.md style artifacts.",
    status: "Required",
    field: "feedbackArtifact"
  },
  {
    label: "Sponsor acceptance",
    detail: "Prize claim stays blocked until reviewer acceptance exists.",
    status: "Blocked",
    field: "reviewDecision"
  }
];

export const demoV2CompletionItems = [
  {
    label: "GitHub connection",
    value: "OAuth + webhook references modeled",
    tone: "good" as const
  },
  {
    label: "Wallet receipts",
    value: "Read-only tx references importable",
    tone: "good" as const
  },
  {
    label: "Graph storage",
    value: "Local JSON persistence ready",
    tone: "good" as const
  },
  {
    label: "Marketplace sync",
    value: "ETHGlobal/manual snapshots tracked",
    tone: "good" as const
  },
  {
    label: "Roles",
    value: "Project permissions enforced",
    tone: "good" as const
  },
  {
    label: "Credentials",
    value: "Issued only after accepted proof",
    tone: "good" as const
  }
];

export const demoV2ConnectionRows = [
  {
    label: "GitHub",
    detail: "alex-dev connected with webhook endpoint reference.",
    status: "Configured"
  },
  {
    label: "Wallet",
    detail: "0x1111...1111 linked as identity and receipt reference.",
    status: "Verified ref"
  },
  {
    label: "ETHGlobal",
    detail: "Open Agents prize leads mapped into proof requirements.",
    status: "Adapter ready"
  },
  {
    label: "Credential",
    detail: "Builder Passport badge waits for accepted packet.",
    status: "Proof-gated"
  }
];
