import { describe, expect, it } from "vitest";
import { generatedProofSummary } from "../src/demo";

describe("generated proof summary", () => {
  it("exposes the generated packet outcome to the web demo", () => {
    expect(generatedProofSummary.packetId).toBe("packet_docs_install_demo");
    expect(generatedProofSummary.status).toBe("accepted");
    expect(generatedProofSummary.verifierStatus).toBe("passed");
    expect(generatedProofSummary.policyStatus).toBe("evidence_only");
    expect(generatedProofSummary.acceptedDate).toBeTruthy();
    expect(["earned", "released"]).toContain(
      generatedProofSummary.payout.status
    );
    if (generatedProofSummary.payout.settlement.txHash) {
      expect(generatedProofSummary.payout.settlement.txHash).toMatch(/^0x/);
    }
    expect(["packet-ready", "posted"]).toContain(
      generatedProofSummary.maintainerSubmission.status
    );
    expect(generatedProofSummary.projectCredit.acceptedPackets).toBe(1);
  });

  it("keeps local filesystem paths out of browser proof data", () => {
    const serialized = JSON.stringify(generatedProofSummary);

    expect(serialized).not.toContain("/Users/");
    expect(serialized).not.toContain("demo-output/docs-install/run_");
    expect(serialized).not.toContain("file://");
  });
});
