import { describe, expect, it } from "vitest";
import { isHex } from "viem";
import {
  buildAcceptedProofAnchor,
  encodeAcceptedProofCall,
  encodeProofRegistryDeployData
} from "./onchainProofRegistry";

const reviewer = "0x8BB09dcB204794de58957dC594dE35FEA769D141";

describe("onchain proof registry", () => {
  it("builds a deterministic accepted proof payload", () => {
    const payload = buildAcceptedProofAnchor({
      reviewerAddress: reviewer,
      contributorAddress: reviewer,
      payoutReceiptRef: "https://etherscan.io/tx/0xproof"
    });

    expect(payload.contributor).toBe(reviewer);
    expect(payload.projectId).toBe("docs-onboarding-sprint");
    expect(payload.packetId).toBe("public_packet_docs_install_demo");
    expect(payload.payoutRef).toBe("https://etherscan.io/tx/0xproof");
    expect(isHex(payload.packetHash)).toBe(true);
  });

  it("encodes deploy and accepted proof transaction data", () => {
    const payload = buildAcceptedProofAnchor({
      reviewerAddress: reviewer,
      contributorAddress: reviewer
    });

    expect(encodeProofRegistryDeployData()).toMatch(/^0x[0-9a-f]+$/i);
    expect(encodeAcceptedProofCall(payload)).toMatch(/^0x[0-9a-f]+$/i);
  });
});
