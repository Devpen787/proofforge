export const demoPacket = {
  id: "packet_docs_install_demo",
  objective:
    "Run the documented install check and prove whether it works in a clean environment.",
  summary:
    "The fixture install check failed because docs-ready.flag is missing. Runner artifacts and verifier checks passed.",
  result:
    "Docs install flow fails in a clean fixture because docs-ready.flag is missing.",
  recommendedAction:
    "Accept the packet as a valid docs validation proof and open a follow-up mission for the missing setup step.",
  artifacts: [
    "evidence-packet.json",
    "case-file.md",
    "runner-result.json",
    "stdout.log",
    "stderr.log",
    "environment.json"
  ],
  requirementsSatisfied: [
    "Public source issue attached",
    "Clean-environment run captured",
    "Maintainer-ready case file generated",
    "No public comment or PR was created"
  ],
  valueRefs: {
    bountySource: "GitHub-backed commons reward",
    payoutMethod: "External/manual",
    walletStatus: "Optional recipient, not settlement",
    receiptRef: "Attach tx hash or external receipt after release"
  },
  privacyReview: [
    "Secrets detected: 0",
    "Local paths masked",
    "Raw logs private",
    "No external actions taken"
  ],
  securityReview: [
    "Sandbox required",
    "Write access blocked",
    "Secrets never mounted",
    "Public submission locked until approval"
  ],
  sharedWithMaintainer: [
    "summary",
    "evidence packet",
    "policy file",
    "environment summary"
  ],
  keptPrivate: [
    "raw logs",
    "local paths",
    "payout record",
    "internal runner notes"
  ]
};

export const demoConvertedPacket = {
  id: "packet_checkout_qa_demo",
  objective:
    "Verify checkout behavior in Chrome and Safari after the buyer clarified target browser versions.",
  summary:
    "The checkout flow was tested with defined browser targets. Evidence includes screenshots, console logs, environment summary, and verifier notes.",
  result:
    "Checkout completes in Chrome. Safari requires a follow-up because payment confirmation logs are incomplete.",
  recommendedAction:
    "Accept as evidence-only QA proof and open a follow-up mission for the Safari confirmation gap.",
  artifacts: [
    "evidence-packet.json",
    "case-file.md",
    "browser-report.json",
    "chrome.png",
    "safari.png",
    "environment.json"
  ],
  requirementsSatisfied: [
    "Buyer acceptance owner attached",
    "Browser versions clarified",
    "Browser logs and screenshots captured",
    "No customer or payment data exposed"
  ],
  valueRefs: {
    bountySource: "Marketplace QA task",
    payoutMethod: "External platform",
    walletStatus: "Optional recipient, not settlement",
    receiptRef: "Attach external payout receipt after release"
  },
  privacyReview: [
    "Secrets detected: 0",
    "Customer data absent",
    "Screenshots reviewed",
    "No external actions taken"
  ],
  securityReview: [
    "Sandbox required",
    "Network restricted to test target",
    "No payment credentials mounted",
    "Public submission locked until approval"
  ],
  sharedWithMaintainer: [
    "summary",
    "browser evidence",
    "policy file",
    "environment summary"
  ],
  keptPrivate: [
    "raw browser traces",
    "local paths",
    "payout record",
    "internal runner notes"
  ]
};

export const demoArtifacts = [
  {
    name: "evidence-packet.json",
    visibility: "Maintainer",
    purpose:
      "Full verified packet with mission, run, policy, verifier, and payout context."
  },
  {
    name: "case-file.md",
    visibility: "Maintainer",
    purpose: "Human-readable review surface for the packet."
  },
  {
    name: "policy.json",
    visibility: "Maintainer",
    purpose:
      "Policy decision showing the mission stayed local and evidence-only."
  },
  {
    name: "public-packet.json",
    visibility: "Public-safe",
    purpose:
      "Shareable proof summary with local paths and private refs removed."
  },
  {
    name: "payout.json",
    visibility: "Private",
    purpose: "Earned payout record created after acceptance."
  },
  {
    name: "project.json",
    visibility: "Project",
    purpose:
      "Project credit ledger showing who earned credit for accepted proof."
  }
];

export const demoPublicArtifacts = demoArtifacts.filter(
  (artifact) => artifact.visibility === "Public-safe"
);
