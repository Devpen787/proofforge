import { mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { runLocalMission } from "../../../apps/runner/src/index";
import { convertWorkLeadToMission, workLeadSchema } from "../../../packages/mission/src/index";
import { verifyRunnerArtifacts } from "../../../packages/verifier/src/index";
import {
  buildEvidencePacket,
  evidencePacketSchema,
  writeEvidencePacketFiles
} from "../src/index";

const workLead = workLeadSchema.parse({
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

describe("buildEvidencePacket", () => {
  it("builds JSON and markdown evidence files from real runner and verifier artifacts", async () => {
    const mission = convertWorkLeadToMission(workLead);
    const outputDir = await mkdtemp(join(tmpdir(), "proofforge-packet-"));
    const runnerResult = await runLocalMission({
      fixtureDir: resolve("apps/runner/fixtures/docs-install"),
      outputDir,
      command: "npm run proof:check",
      runId: "run_packet_fixture"
    });
    const verifierResult = await verifyRunnerArtifacts({
      runnerResult,
      expectedCommand: mission.allowedActions.includes("run allowlisted command")
        ? "npm run proof:check"
        : "npm test"
    });

    const packet = await buildEvidencePacket({
      id: "packet_docs_install_001",
      mission,
      runnerResult,
      verifierResult,
      approvedBy: "alex"
    });

    expect(evidencePacketSchema.safeParse(packet).success).toBe(true);
    expect(packet.status).toBe("verified");
    expect(packet.artifacts).toHaveLength(3);
    expect(packet.humanApproval.status).toBe("approved");
    expect(packet.maintainerSummary).toContain("No external action was taken");

    const files = await writeEvidencePacketFiles(packet, join(outputDir, "packet"));

    await expect(stat(files.jsonPath)).resolves.toBeTruthy();
    await expect(stat(files.markdownPath)).resolves.toBeTruthy();
    await expect(readFile(files.markdownPath, "utf8")).resolves.toContain("Evidence Case File");
  });
});
