import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { verifyAcceptanceSignatureRecord } from "../src/verifyAcceptanceSignature";

describe("verifyAcceptanceSignatureRecord", () => {
  it("recovers and verifies a browser wallet signature", async () => {
    const wallet = Wallet.createRandom();
    const message = JSON.stringify({
      domain: "ProofForge",
      action: "accept-proof",
      packet: "packet_docs_install_demo"
    });
    const signature = await wallet.signMessage(message);

    expect(
      verifyAcceptanceSignatureRecord({
        receipts: {
          walletProvider: "browser",
          walletAddress: wallet.address,
          walletMessage: message,
          walletSignature: signature
        }
      })
    ).toMatchObject({
      status: "verified",
      recoveredAddress: wallet.address
    });
  });

  it("does not treat local demo signatures as wallet-verified", () => {
    expect(
      verifyAcceptanceSignatureRecord({
        receipts: {
          walletProvider: "local-demo",
          walletAddress: "local-demo-reviewer",
          walletMessage: "{}",
          walletSignature: "local-demo-sig:abc"
        }
      })
    ).toMatchObject({
      status: "demo_only"
    });
  });

  it("flags mismatched browser signatures", async () => {
    const signer = Wallet.createRandom();
    const other = Wallet.createRandom();
    const message = "ProofForge acceptance";
    const signature = await signer.signMessage(message);

    expect(
      verifyAcceptanceSignatureRecord({
        receipts: {
          walletProvider: "browser",
          walletAddress: other.address,
          walletMessage: message,
          walletSignature: signature
        }
      })
    ).toMatchObject({
      status: "mismatch",
      recoveredAddress: signer.address
    });
  });
});
