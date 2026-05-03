import type { ActiveMission } from "../app/types";

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

export const demoMissionCatalog: Record<ActiveMission, typeof demoMission> = {
  docs: demoMission,
  windows: {
    title: "Reproduce Windows build error",
    repo: "proofforge/fixture",
    reward: "$12",
    runtime: "35 min",
    risk: "Low risk",
    valuePath: "External commons reward, tracked after acceptance",
    sourceUrl: "https://github.com/proofforge/fixture/issues/2",
    submissionRequirements: [
      "Public source issue attached",
      "Windows environment captured",
      "Failure logs packaged for maintainer review",
      "No public comment or PR without approval"
    ]
  },
  mac: {
    title: "Check Mac install flow",
    repo: "proofforge/fixture",
    reward: "$6",
    runtime: "25 min",
    risk: "Safe",
    valuePath: "Project backlog reward, tracked after acceptance",
    sourceUrl: "https://github.com/proofforge/fixture/issues/3",
    submissionRequirements: [
      "Project backlog source attached",
      "macOS install run captured",
      "Environment summary included",
      "No public comment or PR without approval"
    ]
  },
  config: {
    title: "Validate config docs",
    repo: "proofforge/fixture",
    reward: "$8",
    runtime: "30 min",
    risk: "Safe",
    valuePath: "External commons reward, tracked after acceptance",
    sourceUrl: "https://github.com/proofforge/fixture/issues/4",
    submissionRequirements: [
      "Public source issue attached",
      "Config examples tested in clean workspace",
      "Observed mismatches packaged as evidence",
      "No public comment or PR without approval"
    ]
  },
  links: {
    title: "Fix broken links",
    repo: "proofforge/fixture",
    reward: "$5",
    runtime: "20 min",
    risk: "Safe",
    valuePath: "Project backlog reward, tracked after acceptance",
    sourceUrl: "https://github.com/proofforge/fixture/issues/5",
    submissionRequirements: [
      "Project backlog source attached",
      "Dead links listed with locations",
      "Replacement targets or follow-up notes included",
      "No public comment or PR without approval"
    ]
  },
  checkout: demoConvertedMission,
  request: {
    title: "Project work request",
    repo: "project/request",
    reward: "$10",
    runtime: "30 min",
    risk: "Safe",
    valuePath: "Project-defined reward, tracked after acceptance",
    sourceUrl: "project://work-request",
    submissionRequirements: [
      "Project steward request attached",
      "Acceptance owner confirmed",
      "Evidence target captured",
      "No public comment or PR without approval"
    ]
  }
};

export function getDemoMission(activeMission: ActiveMission) {
  return demoMissionCatalog[activeMission];
}

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
    label: "Assess work",
    detail: "Checked source, repo, evidence target, value path, and risk.",
    status: "complete",
    artifact: "mission.json"
  },
  {
    label: "Run bounded agent",
    detail:
      "Clean fixture workspace, secrets unmounted, external actions locked.",
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
