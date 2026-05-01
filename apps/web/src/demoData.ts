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

export const demoPacket = {
  id: "packet_docs_install_demo",
  objective: "Run the documented install check and prove whether it works in a clean environment.",
  summary: "The fixture install check failed because docs-ready.flag is missing. Runner artifacts and verifier checks passed.",
  artifacts: ["evidence-packet.json", "case-file.md", "runner-result.json", "stdout.log", "stderr.log", "environment.json"]
};

export const demoActivity = [
  "Proof packet generated",
  "Verifier checks passed",
  "Storage URI recorded",
  "Maintainer packet ready"
];
