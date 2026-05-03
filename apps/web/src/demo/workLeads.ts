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

export const demoWorkLeadDiagnosis = [
  {
    label: "Acceptance owner",
    value: "External buyer identified",
    tone: "good"
  },
  {
    label: "Evidence shape",
    value: "Browser logs + screenshots",
    tone: "good"
  },
  { label: "Missing detail", value: "Exact browser versions", tone: "bad" },
  { label: "Conversion gate", value: "Blocked until clarified", tone: "bad" }
] as const;

export const demoProjectWorkLead = {
  title: "Project work lead created",
  source: "Project steward",
  rawRequest:
    "Docs Onboarding Sprint needs one more proof packet for the quickstart path on a clean machine.",
  proofability: "84%",
  risk: "Low",
  reward: "$12 commons credit",
  acceptsProof: "Project steward",
  missing: "Exact OS target",
  recommendation:
    "Ask the steward to confirm Ubuntu 24.04 or Mac before converting to a Mission."
};

export const demoMaintainerPackets = [
  {
    title: "Validate installation docs",
    status: "Ready",
    detail: "86% confidence, privacy passed"
  },
  {
    title: "CLI crash on Windows",
    status: "Needs review",
    detail: "Low risk reproduction packet"
  },
  {
    title: "Mac install issue",
    status: "Revision",
    detail: "Missing environment detail"
  }
];
