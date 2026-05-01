import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { runLocalMission } from "./index";
import { buildEvidencePacket, writeEvidencePacketFiles } from "../../../packages/evidence/src/index";
import { convertWorkLeadToMission, workLeadSchema } from "../../../packages/mission/src/index";
import { verifyRunnerArtifacts } from "../../../packages/verifier/src/index";

const outputDir = resolve("demo-output/docs-install");

const lead = workLeadSchema.parse({
  id: "lead_docs_install_001",
  sourceType: "fixture",
  sourceUrl: "https://github.com/proofforge/fixture/issues/1",
  title: "Validate installation docs",
  rawRequest: "Run the documented install check and prove whether it works in a clean environment.",
  repo: "proofforge/fixture",
  acceptanceOwner: "fixture-maintainer",
  desiredEvidence: ["runner-result.json", "stdout.log", "stderr.log", "environment.json"],
  riskLevel: "low",
  proofability: 92,
  status: "mission_ready",
  reward: {
    amount: 8,
    currency: "USD",
    type: "external"
  },
  missing: [],
  blockedActions: ["open pull request", "post public comment", "access private repositories"]
});

await rm(outputDir, { recursive: true, force: true });

const mission = convertWorkLeadToMission(lead);
const runnerResult = await runLocalMission({
  fixtureDir: resolve("apps/runner/fixtures/docs-install"),
  outputDir,
  command: "npm run proof:check",
  runId: "run_docs_install_demo"
});
const verifierResult = await verifyRunnerArtifacts({
  runnerResult,
  expectedCommand: "npm run proof:check"
});
const packet = await buildEvidencePacket({
  id: "packet_docs_install_demo",
  mission,
  runnerResult,
  verifierResult,
  approvedBy: "alex"
});
const files = await writeEvidencePacketFiles(packet, resolve(outputDir, "packet"));

console.log("ProofForge demo packet generated.");
console.log(`Evidence packet: ${files.jsonPath}`);
console.log(`Case file: ${files.markdownPath}`);
console.log(`Verifier status: ${packet.verifierResult.status}`);
console.log(`Human approval: ${packet.humanApproval.status}`);
