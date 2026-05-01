import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createEarnedPayout } from "../../../packages/payments/src/index";
import type { EvidencePacket } from "../../../packages/evidence/src/index";
import type { MissionContract } from "../../../packages/mission/src/index";
import { releasePayoutFile } from "../src/releasePayout";

describe("releasePayoutFile", () => {
  it("marks an earned payout as released without moving money automatically", async () => {
    const tempDir = await mkdtemp(resolve(tmpdir(), "proofforge-payout-"));
    const inputPath = resolve(tempDir, "payout.json");
    const outputPath = resolve(tempDir, "released-payout.json");
    const payout = createEarnedPayout({
      packet: { id: "packet_docs", status: "accepted" } as EvidencePacket,
      mission: {
        id: "mission_docs",
        reward: { amount: 8, currency: "USD", type: "cash" }
      } as MissionContract,
      projectId: "project_docs",
      recipient: "alex",
      approvedBy: "maintainer",
      now: new Date("2026-05-01T12:00:00.000Z")
    });

    await writeFile(inputPath, JSON.stringify(payout, null, 2), "utf8");
    const writtenPath = await releasePayoutFile(inputPath, outputPath, new Date("2026-05-01T13:00:00.000Z"));
    const released = JSON.parse(await readFile(writtenPath, "utf8"));

    expect(writtenPath).toBe(outputPath);
    expect(released.status).toBe("released");
    expect(released.releasedAt).toBe("2026-05-01T13:00:00.000Z");
    expect(released.notes).toContain("Release is a separate manual accounting step in the MVP.");
  });
});
