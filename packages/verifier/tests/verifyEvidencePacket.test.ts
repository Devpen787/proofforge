import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { EvidencePacket } from "@proofforge/evidence";
import {
  digestEvidencePacket,
  proofForgeEvidenceProtocolVersion,
  verifyEvidencePacket
} from "../src/index";

describe("verifyEvidencePacket", () => {
  it("passes a PFEP-v0 packet and produces a stable digest", async () => {
    const fixture = await createPacketFixture();
    const report = await verifyEvidencePacket({ packet: fixture.packet });

    expect(report.ok).toBe(true);
    expect(report.protocolVersion).toBe(proofForgeEvidenceProtocolVersion);
    expect(report.digest).toBe(digestEvidencePacket(fixture.packet));
    expect(report.digest).toBe(
      digestEvidencePacket(reverseTopLevelKeys(fixture.packet))
    );
    expect(
      report.findings.some((finding) => finding.severity === "error")
    ).toBe(false);
    expect(report.findings).not.toContainEqual(
      expect.objectContaining({ code: "packet.version_derived" })
    );
  });

  it("accepts legacy packets without an explicit PFEP version with a warning", async () => {
    const fixture = await createPacketFixture();
    const legacyPacket = Object.fromEntries(
      Object.entries(fixture.packet).filter(([key]) => key !== "pfepVersion")
    );

    const report = await verifyEvidencePacket({ packet: legacyPacket });

    expect(report.ok).toBe(true);
    expect(report.packet?.pfepVersion).toBe(proofForgeEvidenceProtocolVersion);
    expect(report.findings).toContainEqual(
      expect.objectContaining({
        severity: "warning",
        code: "packet.version_derived"
      })
    );
  });

  it("fails a malformed packet with schema findings", async () => {
    const report = await verifyEvidencePacket({
      packet: {
        id: "packet_bad"
      }
    });

    expect(report.ok).toBe(false);
    expect(report.digest).toBeNull();
    expect(
      report.findings.some(
        (finding) => finding.code === "packet.schema_invalid"
      )
    ).toBe(true);
  });

  it("fails when a local artifact is missing", async () => {
    const fixture = await createPacketFixture();
    await rm(fixture.stdoutPath);

    const report = await verifyEvidencePacket({ packet: fixture.packet });

    expect(report.ok).toBe(false);
    expect(report.findings).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "artifact.missing"
      })
    );
  });

  it("fails when an artifact hash does not match file contents", async () => {
    const fixture = await createPacketFixture();
    await writeFile(fixture.stdoutPath, "changed output", "utf8");

    const report = await verifyEvidencePacket({ packet: fixture.packet });

    expect(report.ok).toBe(false);
    expect(report.findings).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "artifact.hash_mismatch"
      })
    );
  });

  it("fails an accepted packet with a failed verifier result", async () => {
    const fixture = await createPacketFixture();
    const packet: EvidencePacket = {
      ...fixture.packet,
      verifierResult: {
        ...fixture.packet.verifierResult,
        status: "failed"
      }
    };

    const report = await verifyEvidencePacket({ packet });

    expect(report.ok).toBe(false);
    expect(report.findings).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "packet.status_requires_passed_verifier"
      })
    );
  });

  it("fails public-unsafe privacy review states", async () => {
    const fixture = await createPacketFixture();
    const packet: EvidencePacket = {
      ...fixture.packet,
      privacyReview: {
        secretsDetected: 1,
        localPathsMasked: false,
        rawLogsPublic: true,
        notes: ["unsafe test packet"]
      }
    };

    const report = await verifyEvidencePacket({ packet });

    expect(report.ok).toBe(false);
    expect(report.findings.map((finding) => finding.code)).toEqual(
      expect.arrayContaining([
        "privacy.secrets_detected",
        "privacy.local_paths_not_masked",
        "privacy.raw_logs_public"
      ])
    );
  });
});

async function createPacketFixture(): Promise<{
  packet: EvidencePacket;
  stdoutPath: string;
}> {
  const dir = await mkdtemp(join(tmpdir(), "proofforge-packet-"));
  const stdoutPath = join(dir, "stdout.log");
  const stderrPath = join(dir, "stderr.log");
  const environmentPath = join(dir, "environment.json");

  await writeFile(stdoutPath, "proof ok", "utf8");
  await writeFile(stderrPath, "", "utf8");
  await writeFile(environmentPath, JSON.stringify({ node: "test" }), "utf8");

  const artifacts = await Promise.all(
    [stdoutPath, stderrPath, environmentPath].map(async (path) => ({
      id: `artifact_${path.split("/").pop()?.replace(".", "_")}`,
      label: path.split("/").pop() ?? path,
      path,
      mediaType: path.endsWith(".json") ? "application/json" : "text/plain",
      sha256: sha256(await readFile(path))
    }))
  );

  const packet: EvidencePacket = {
    pfepVersion: proofForgeEvidenceProtocolVersion,
    id: "packet_test",
    createdAt: "2026-05-13T00:00:00.000Z",
    status: "accepted",
    mission: {
      id: "mission_test",
      title: "Verify packet",
      sourceUrl: "https://github.com/example/repo/issues/1",
      objective: "Prove packet verification works.",
      acceptanceOwner: "maintainer"
    },
    source: {
      type: "github_issue",
      url: "https://github.com/example/repo/issues/1"
    },
    objective: "Prove packet verification works.",
    runnerResult: {
      id: "run_test",
      command: "npm test",
      exitCode: 0,
      startedAt: "2026-05-13T00:00:00.000Z",
      completedAt: "2026-05-13T00:00:01.000Z",
      durationMs: 1000,
      stdoutPath,
      stderrPath,
      environmentPath
    },
    verifierResult: {
      id: "verify_test",
      runnerResultId: "run_test",
      status: "passed",
      checkedAt: "2026-05-13T00:00:02.000Z",
      checks: [
        {
          name: "runner output exists",
          passed: true,
          detail: stdoutPath
        }
      ],
      summary: "Packet fixture verified."
    },
    artifacts,
    requirementsSatisfied: [
      {
        label: "Evidence packet",
        status: "satisfied",
        evidence: "Packet fixture includes artifacts."
      }
    ],
    riskFlags: [],
    privacyReview: {
      secretsDetected: 0,
      localPathsMasked: true,
      rawLogsPublic: false,
      notes: ["public-safe test packet"]
    },
    humanApproval: {
      required: true,
      status: "approved",
      approvedBy: "maintainer",
      approvedAt: "2026-05-13T00:00:03.000Z"
    },
    maintainerSummary: "Packet fixture is maintainer ready.",
    protocolRefs: {
      storageUri: "file:///tmp/proofforge-packet.json",
      identityRef: "ens:proofrunner.example.eth",
      messageTraceId: "trace:test"
    }
  };

  return { packet, stdoutPath };
}

function reverseTopLevelKeys(packet: EvidencePacket): EvidencePacket {
  return Object.fromEntries(Object.entries(packet).reverse()) as EvidencePacket;
}

function sha256(body: Buffer): string {
  return createHash("sha256").update(body).digest("hex");
}
