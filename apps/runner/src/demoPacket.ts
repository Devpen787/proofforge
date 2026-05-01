import { rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runLocalMission } from "./index";
import { buildEvidencePacket, createPublicPacketView, writeEvidencePacketFiles } from "../../../packages/evidence/src/index";
import { convertWorkLeadToMission, workLeadSchema } from "../../../packages/mission/src/index";
import { createEarnedPayout } from "../../../packages/payments/src/index";
import { addMissionToProject, addWorkLeadToProject, createProject, recordAcceptedProof } from "../../../packages/projects/src/index";
import { createLocalStorageAdapter, createZeroGStorageAdapter } from "../../../packages/storage/src/index";
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
const project = addMissionToProject(
  addWorkLeadToProject(
    createProject({
      id: "project_docs_onboarding",
      name: "Docs Onboarding Sprint",
      handle: "docs-onboarding",
      purpose: "Turn install friction into accepted proof packets.",
      founder: "alex",
      lanes: ["Docs validation", "Bug reproduction"],
      rewardPool: 240
    }),
    lead
  ),
  mission
);
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
let files = await writeEvidencePacketFiles(packet, resolve(outputDir, "packet"));
const storageAdapter = createStorageAdapter();
const storageReceipt = await storageAdapter.putFile({
  path: files.jsonPath,
  contentType: "application/json"
});

const packetWithStorageRef = {
  ...packet,
  status: "accepted" as const,
  protocolRefs: {
    ...packet.protocolRefs,
    storageUri: storageReceipt.uri
  }
};

files = await writeEvidencePacketFiles(packetWithStorageRef, resolve(outputDir, "packet"));
const payout = createEarnedPayout({
  packet: packetWithStorageRef,
  mission,
  projectId: "project_docs_onboarding",
  recipient: "alex",
  approvedBy: "fixture-maintainer"
});
const payoutPath = resolve(outputDir, "packet", "payout.json");
await writeFile(payoutPath, JSON.stringify(payout, null, 2), "utf8");
const projectWithCredit = recordAcceptedProof(project, {
  packet: packetWithStorageRef,
  payout,
  contributor: "alex"
});
const projectPath = resolve(outputDir, "packet", "project.json");
await writeFile(projectPath, JSON.stringify(projectWithCredit, null, 2), "utf8");
const publicPacket = createPublicPacketView({
  packet: packetWithStorageRef,
  project: "Docs Onboarding Sprint",
  acceptedBy: "fixture-maintainer",
  acceptedAt: payout.createdAt
});
const publicPacketPath = resolve(outputDir, "packet", "public-packet.json");
await writeFile(publicPacketPath, JSON.stringify(publicPacket, null, 2), "utf8");

console.log("ProofForge demo packet generated.");
console.log(`Evidence packet: ${files.jsonPath}`);
console.log(`Case file: ${files.markdownPath}`);
console.log(`Public packet: ${publicPacketPath}`);
console.log(`Earned payout: ${payoutPath}`);
console.log(`Project state: ${projectPath}`);
console.log(`Storage provider: ${storageReceipt.provider}`);
console.log(`Storage URI: ${storageReceipt.uri}`);
if (storageReceipt.txHash) {
  console.log(`0G tx: ${storageReceipt.txHash}`);
}
console.log(`Verifier status: ${packet.verifierResult.status}`);
console.log(`Human approval: ${packet.humanApproval.status}`);
console.log(`Payout status: ${payout.status}`);
console.log(`Project accepted packets: ${projectWithCredit.acceptedPacketIds.length}`);

function createStorageAdapter() {
  const evmRpc = process.env.ZERO_G_EVM_RPC;
  const indexerRpc = process.env.ZERO_G_INDEXER_RPC;
  const privateKey = process.env.ZERO_G_PRIVATE_KEY;

  if (evmRpc && indexerRpc && privateKey) {
    return createZeroGStorageAdapter({
      evmRpc,
      indexerRpc,
      privateKey
    });
  }

  return createLocalStorageAdapter(resolve(outputDir, "storage"));
}
