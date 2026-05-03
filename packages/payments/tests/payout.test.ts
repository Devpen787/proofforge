import { describe, expect, it } from "vitest";
import type { EvidencePacket } from "@proofforge/evidence";
import type { MissionContract } from "@proofforge/mission";
import {
  assertNoDuplicatePayout,
  createEarnedPayout,
  disputePayout,
  releasePayout
} from "../src/index";

const mission = {
  id: "mission_docs",
  reward: {
    amount: 8,
    currency: "USD",
    type: "cash"
  }
} as MissionContract;

const acceptedPacket = {
  id: "packet_docs",
  status: "accepted"
} as EvidencePacket;

describe("payout lifecycle", () => {
  it("creates an earned payout only after packet acceptance", () => {
    const payout = createEarnedPayout({
      packet: acceptedPacket,
      mission,
      projectId: "project_docs",
      recipient: "alex",
      approvedBy: "maintainer",
      now: new Date("2026-05-01T12:00:00.000Z")
    });

    expect(payout.status).toBe("earned");
    expect(payout.amount).toBe(8);
    expect(payout.method).toBe("manual");
    expect(payout.releasedAt).toBeUndefined();
  });

  it("rejects payout creation for unaccepted packets", () => {
    expect(() =>
      createEarnedPayout({
        packet: { ...acceptedPacket, status: "submitted" } as EvidencePacket,
        mission,
        projectId: "project_docs",
        recipient: "alex",
        approvedBy: "maintainer"
      })
    ).toThrow("Only accepted packets");
  });

  it("releases earned payouts as a separate action", () => {
    const payout = createEarnedPayout({
      packet: acceptedPacket,
      mission,
      projectId: "project_docs",
      recipient: "alex",
      approvedBy: "maintainer",
      now: new Date("2026-05-01T12:00:00.000Z")
    });

    const released = releasePayout(payout, {
      now: new Date("2026-05-01T13:00:00.000Z")
    });
    expect(released.status).toBe("released");
    expect(released.releasedAt).toBe("2026-05-01T13:00:00.000Z");
  });

  it("blocks duplicate payout records for the same packet", () => {
    const payout = createEarnedPayout({
      packet: acceptedPacket,
      mission,
      projectId: "project_docs",
      recipient: "alex",
      approvedBy: "maintainer"
    });

    expect(() => assertNoDuplicatePayout([payout], acceptedPacket.id)).toThrow(
      "already has a payout"
    );
  });

  it("does not allow disputes after release", () => {
    const payout = releasePayout(
      createEarnedPayout({
        packet: acceptedPacket,
        mission,
        projectId: "project_docs",
        recipient: "alex",
        approvedBy: "maintainer"
      })
    );

    expect(() => disputePayout(payout)).toThrow(
      "Released payouts cannot be disputed"
    );
  });
});
