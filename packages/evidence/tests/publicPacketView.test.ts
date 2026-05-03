import { describe, expect, it } from "vitest";
import type { EvidencePacket } from "../src/index";
import { createPublicPacketView } from "../src/index";

const acceptedPacket = {
  id: "packet_docs",
  status: "accepted",
  objective: "Validate docs installation on Ubuntu.",
  mission: {
    title: "Validate installation docs"
  },
  maintainerSummary:
    "Docs install failed at the documented command. Verifier checks passed.",
  artifacts: [
    {
      label: "runner.log",
      path: "/private/tmp/proofforge/run/runner.log",
      mediaType: "text/plain",
      sha256: "a".repeat(64)
    }
  ],
  protocolRefs: {
    storageUri: "0g://root/hash",
    identityRef: "runner-01.proofforge.eth"
  }
} as EvidencePacket;

describe("createPublicPacketView", () => {
  it("removes local artifact paths from the public share view", () => {
    const view = createPublicPacketView({
      packet: acceptedPacket,
      project: "Polkadot SDK Onboarding Sprint",
      acceptedBy: "alice",
      acceptedAt: "2026-05-01T12:00:00.000Z"
    });

    expect(view.status).toBe("accepted");
    expect(view.publicArtifacts[0]).toEqual({
      label: "runner.log",
      mediaType: "text/plain",
      sha256: "a".repeat(64)
    });
    expect(JSON.stringify(view)).not.toContain("/private/tmp");
    expect(view.proofRefs.storageUri).toBe("0g://root/hash");
  });

  it("does not publish draft packets", () => {
    expect(() =>
      createPublicPacketView({
        packet: { ...acceptedPacket, status: "draft" } as EvidencePacket,
        project: "Docs Sprint"
      })
    ).toThrow("Only submitted or reviewed packets");
  });

  it("does not expose local file storage references publicly", () => {
    const view = createPublicPacketView({
      packet: {
        ...acceptedPacket,
        protocolRefs: {
          storageUri: "file:///Users/alex/demo-output/evidence-packet.json"
        }
      } as EvidencePacket,
      project: "Docs Sprint"
    });

    expect(view.proofRefs.storageUri).toBeUndefined();
    expect(JSON.stringify(view)).not.toContain("file://");
  });
});
