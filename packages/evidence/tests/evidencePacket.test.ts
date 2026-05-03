import { describe, expect, it } from "vitest";
import {
  evidencePacketSchema,
  isEvidencePacket,
  parseEvidencePacket
} from "../src/index";

const validPacket = {
  id: "packet_001",
  createdAt: "2026-05-01T10:00:00.000Z",
  status: "verified",
  mission: {
    id: "mission_docs_install_001",
    title: "Validate installation docs",
    sourceUrl: "https://github.com/proofforge/fixture/issues/1",
    objective:
      "Run the documented install command and capture whether it works.",
    acceptanceOwner: "fixture-maintainer"
  },
  source: {
    type: "fixture",
    url: "https://github.com/proofforge/fixture/issues/1"
  },
  objective:
    "Prove whether the documented install command works in a clean environment.",
  runnerResult: {
    id: "run_001",
    command: "npm run proof:check",
    exitCode: 1,
    startedAt: "2026-05-01T10:00:01.000Z",
    completedAt: "2026-05-01T10:00:03.000Z",
    durationMs: 2000,
    stdoutPath: "runs/run_001/stdout.log",
    stderrPath: "runs/run_001/stderr.log",
    environmentPath: "runs/run_001/environment.json"
  },
  verifierResult: {
    id: "verify_001",
    runnerResultId: "run_001",
    status: "passed",
    checkedAt: "2026-05-01T10:00:04.000Z",
    checks: [
      {
        name: "runner artifacts exist",
        passed: true,
        detail:
          "runner-result.json, stdout.log, stderr.log, and environment.json are referenced"
      }
    ],
    summary: "Runner artifacts are internally consistent."
  },
  artifacts: [
    {
      id: "artifact_stdout",
      label: "stdout",
      path: "runs/run_001/stdout.log",
      mediaType: "text/plain",
      sha256: "a".repeat(64)
    }
  ],
  requirementsSatisfied: [
    {
      label: "Maintainer-ready case file",
      status: "satisfied",
      evidence: "case-file.md was generated with verifier and privacy state."
    }
  ],
  riskFlags: [
    {
      level: "low",
      label: "evidence-only",
      detail: "No external action was taken."
    }
  ],
  privacyReview: {
    secretsDetected: 0,
    localPathsMasked: true,
    rawLogsPublic: false,
    notes: ["No secrets detected in fixture output."]
  },
  humanApproval: {
    required: true,
    status: "pending"
  },
  maintainerSummary:
    "The install check failed in a clean fixture environment. Logs are attached.",
  protocolRefs: {}
};

describe("evidencePacketSchema", () => {
  it("accepts a complete evidence packet", () => {
    expect(isEvidencePacket(validPacket)).toBe(true);
    expect(parseEvidencePacket(validPacket).id).toBe("packet_001");
    expect(
      parseEvidencePacket(validPacket).requirementsSatisfied[0].status
    ).toBe("satisfied");
  });

  it("rejects packets without verifier output", () => {
    const invalid = { ...validPacket, verifierResult: undefined };
    expect(evidencePacketSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects packets that claim an unsupported status", () => {
    const invalid = { ...validPacket, status: "paid" };
    expect(evidencePacketSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects artifacts without stable hashes", () => {
    const invalid = {
      ...validPacket,
      artifacts: [{ ...validPacket.artifacts[0], sha256: "not-a-hash" }]
    };
    expect(evidencePacketSchema.safeParse(invalid).success).toBe(false);
  });
});
