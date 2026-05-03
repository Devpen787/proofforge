export const demoMission = {
  title: "Validate installation docs",
  repo: "proofforge/fixture",
  reward: "$8",
  runtime: "30 min",
  risk: "Safe",
  valuePath: "External commons reward, tracked after acceptance",
  sourceUrl: "https://github.com/proofforge/fixture/issues/1",
  submissionRequirements: [
    "Public source issue attached",
    "Clean-environment run captured",
    "Maintainer-ready case file generated",
    "No public comment or PR without approval"
  ]
};

export const demoConvertedMission = {
  title: "Checkout QA verification",
  repo: "external/checkout-flow",
  reward: "$25",
  runtime: "45 min",
  risk: "Medium",
  valuePath: "External buyer payout, tracked as external value",
  sourceUrl: "https://example.com/marketplace/checkout-qa-4821",
  submissionRequirements: [
    "Buyer acceptance owner attached",
    "Browser versions clarified",
    "Browser logs and screenshots captured",
    "No real customer or payment data exposed"
  ]
};

export const demoFirstRunSteps = [
  { label: "Choose mission", detail: "Use a safe starter task." },
  { label: "Confirm safety", detail: "No public action or payment." },
  { label: "Run proof", detail: "Execute locally and capture logs." },
  { label: "Review packet", detail: "Check evidence before sharing." },
  { label: "Submit or save", detail: "Human approval decides." },
  { label: "See outcome", detail: "Accepted proof creates earned value." }
];

export const demoSafetyDefaults = [
  "No public posts",
  "No pull requests",
  "No payments",
  "No secrets mounted",
  "Local sandbox only",
  "Human approval before submission"
];

export const demoPayoutTimeline = [
  { label: "Packet submitted", value: "pending review" },
  { label: "Packet accepted", value: "earned payout" },
  { label: "Manual release", value: "released payout" }
];

export const demoMissionTerms = [
  { label: "Project", value: "Docs Onboarding Sprint" },
  { label: "Acceptance owner", value: "Commons reviewer" },
  { label: "Proof node", value: "docs-runner-01" },
  { label: "Recipient", value: "Alex" },
  { label: "Release method", value: "External/manual" },
  { label: "Custody", value: "No funds held by ProofForge" }
];

export const demoRunnerTrace = [
  {
    label: "Sandbox run",
    detail: "Clean fixture workspace, secrets unmounted.",
    status: "complete",
    artifact: "runner-result.json"
  },
  {
    label: "Verifier",
    detail: "Checked command exit, environment, and required artifacts.",
    status: "complete",
    artifact: "verifier-result.json"
  },
  {
    label: "Packet",
    detail: "Maintainer-ready file prepared for approval.",
    status: "approval",
    artifact: "case-file.md"
  }
];
