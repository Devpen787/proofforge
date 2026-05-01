import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { runDemoPacket } from "../src/demoPacket";

describe("runDemoPacket", () => {
  it("creates proof, public packet, payout, and project credit artifacts", async () => {
    const result = await runDemoPacket(resolve("demo-output/test-docs-install"));

    expect(result.verifierStatus).toBe("passed");
    expect(result.policyStatus).toBe("evidence_only");
    expect(result.humanApprovalStatus).toBe("approved");
    expect(result.payoutStatus).toBe("earned");
    expect(result.projectAcceptedPackets).toBe(1);

    const publicPacket = await readJson(result.publicPacketPath);
    const policy = await readJson(result.policyPath);
    const payout = await readJson(result.payoutPath);
    const project = await readJson(result.projectPath);

    expect(publicPacket.status).toBe("accepted");
    expect(policy.status).toBe("evidence_only");
    expect(policy.blockedActions).toContain("open pull requests");
    expect(JSON.stringify(publicPacket)).not.toContain("file://");
    expect(payout.status).toBe("earned");
    expect(project.creditLedger[0].packetId).toBe("packet_docs_install_demo");
  });
});

async function readJson(path: string) {
  return JSON.parse(await readFile(path, "utf8"));
}
