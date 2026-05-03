import { describe, expect, it } from "vitest";
import { createProofEvent, buildProofRecord } from "../src/app/proofEvents";
import { defaultProjectRequest } from "../src/app/workspaceState";

describe("ProofForge proof events", () => {
  it("hash-links source import, submission, and acceptance events", () => {
    const walletIdentity = {
      address: "0x1234567890000000000000000000000000000000",
      ensName: "proofrunner.example.eth",
      connectedAt: "2026-05-03T00:00:00.000Z"
    };
    const importedMission = {
      title: "Fix flaky installer",
      repo: "example/repo",
      issueNumber: 7,
      sourceUrl: "https://github.com/example/repo/issues/7",
      reward: "Credit",
      runtime: "local",
      risk: "safe",
      valuePath: "credit",
      acceptanceOwner: "repo maintainer",
      objective: "Reproduce and package the issue.",
      proofability: "88%",
      requirements: ["clean run"],
      importedAt: "2026-05-03T00:00:00.000Z"
    };

    const imported = createProofEvent({
      type: "github_imported",
      activeMission: "github",
      projectRequest: defaultProjectRequest,
      importedMission,
      walletIdentity
    });
    const submitted = createProofEvent({
      type: "packet_submitted",
      activeMission: "github",
      projectRequest: defaultProjectRequest,
      importedMission,
      walletIdentity,
      previous: imported
    });
    const accepted = createProofEvent({
      type: "packet_accepted",
      activeMission: "github",
      projectRequest: defaultProjectRequest,
      importedMission,
      walletIdentity,
      previous: submitted
    });

    expect(submitted.previousHash).toBe(imported.eventHash);
    expect(accepted.previousHash).toBe(submitted.eventHash);
    expect(accepted.sourceUrl).toBe(importedMission.sourceUrl);
    expect(accepted.payload.acceptanceAuthority).toBe("repo maintainer");
  });

  it("exports an upload-ready proof record", () => {
    const event = createProofEvent({
      type: "packet_ready",
      activeMission: "docs",
      projectRequest: defaultProjectRequest,
      importedMission: null,
      walletIdentity: null
    });
    const record = buildProofRecord({
      events: [event],
      packet: { packetId: "packet_docs_install_demo" },
      walletIdentity: null
    });

    expect(record.recordType).toBe("proofforge.v1.proof-record");
    expect(record.eventCount).toBe(1);
    expect(record.latestEventHash).toBe(event.eventHash);
    expect(record.storage.status).toBe("upload-ready from browser export");
  });
});
