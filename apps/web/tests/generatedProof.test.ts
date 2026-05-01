import { describe, expect, it } from "vitest";
import { generatedProofSummary } from "../src/generatedProof";

describe("generated proof summary", () => {
  it("exposes the generated packet outcome to the web demo", () => {
    expect(generatedProofSummary.packetId).toBe("packet_docs_install_demo");
    expect(generatedProofSummary.status).toBe("accepted");
    expect(generatedProofSummary.verifierStatus).toBe("passed");
    expect(generatedProofSummary.policyStatus).toBe("evidence_only");
    expect(generatedProofSummary.payout.status).toBe("earned");
    expect(generatedProofSummary.projectCredit.acceptedPackets).toBe(1);
  });

  it("keeps local filesystem paths out of browser proof data", () => {
    const serialized = JSON.stringify(generatedProofSummary);

    expect(serialized).not.toContain("/Users/");
    expect(serialized).not.toContain("demo-output/docs-install/run_");
    expect(serialized).not.toContain("file://");
  });
});
