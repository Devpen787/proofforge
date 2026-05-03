import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { createEasAttestationPayload } from "../src/createEasAttestationPayload";
import { createGitHubHandoff } from "../src/createGitHubHandoff";
import { createPayoutHandoff } from "../src/createPayoutHandoff";

async function makeRecord() {
  const dir = join(
    tmpdir(),
    `proofforge-handoff-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
  await mkdir(dir, { recursive: true });
  const wallet = Wallet.createRandom();
  const message = "ProofForge acceptance";
  const signature = await wallet.signMessage(message);
  const recordPath = join(dir, "record.json");
  await writeFile(
    recordPath,
    JSON.stringify(
      {
        version: "proof-network-record/v1",
        id: "pfn_handoff_test",
        packet: {
          id: "packet_docs_install_demo",
          project: "Docs Onboarding Sprint",
          mission: "Validate installation docs",
          storage: "0g://root",
          verifier: "passed"
        },
        receipts: {
          walletProvider: "browser",
          walletAddress: wallet.address,
          walletMessage: message,
          walletSignature: signature,
          zeroGReceipt: "0g://root"
        }
      },
      null,
      2
    ),
    "utf8"
  );

  return { dir, recordPath };
}

describe("operational handoffs", () => {
  it("creates a GitHub CLI handoff without GitHub credentials", async () => {
    const { dir, recordPath } = await makeRecord();
    const manifestPath = await createGitHubHandoff({
      recordPath,
      issueUrl: "https://github.com/Devpen787/proofforge/issues/1",
      outputDir: join(dir, "github")
    });

    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    expect(manifest).toMatchObject({
      version: "proof-github-handoff/v1",
      command:
        "gh issue comment https://github.com/Devpen787/proofforge/issues/1 --body-file proof-comment.md"
    });

    const comment = await readFile(manifest.files.comment, "utf8");
    expect(comment).toContain("ProofForge proof packet ready");
    expect(comment).toContain("Acceptance signature: verified");
  });

  it("creates an EAS accepted-proof attestation payload", async () => {
    const { dir, recordPath } = await makeRecord();
    const outputPath = await createEasAttestationPayload({
      recordPath,
      outputPath: join(dir, "eas.json")
    });

    const payload = JSON.parse(await readFile(outputPath, "utf8"));
    expect(payload).toMatchObject({
      version: "proof-eas-attestation-payload/v1",
      data: {
        recordId: "pfn_handoff_test",
        packetId: "packet_docs_install_demo",
        storageUri: "0g://root"
      },
      acceptance: {
        status: "verified"
      }
    });
  });

  it("creates Safe, Splits, and Drips payout rail handoffs", async () => {
    const { dir, recordPath } = await makeRecord();
    const payoutPath = join(dir, "payout.json");
    await writeFile(
      payoutPath,
      JSON.stringify(
        {
          id: "payout_packet_docs_install_demo",
          packetId: "packet_docs_install_demo",
          missionId: "mission_docs_install",
          projectId: "docs-onboarding-sprint",
          recipient: "alex",
          amount: 8,
          currency: "USD",
          type: "cash",
          method: "manual",
          status: "earned",
          approvedBy: "fixture-maintainer",
          createdAt: "2026-05-03T12:00:00.000Z",
          notes: ["Earned means accepted proof created a payout record."]
        },
        null,
        2
      ),
      "utf8"
    );

    const manifestPath = await createPayoutHandoff({
      payoutPath,
      recordPath,
      recipientAddress: "0x8BB09dcB204794de58957dC594dE35FEA769D141",
      safeAddress: "0x0000000000000000000000000000000000000001",
      outputDir: join(dir, "payout-handoff")
    });

    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    expect(manifest).toMatchObject({
      version: "proof-payout-handoff/v1",
      proof: {
        packetId: "packet_docs_install_demo"
      }
    });

    const safeTx = JSON.parse(await readFile(manifest.rails.safe, "utf8"));
    const splits = JSON.parse(await readFile(manifest.rails.splits, "utf8"));
    const drips = JSON.parse(await readFile(manifest.rails.drips, "utf8"));

    expect(safeTx).toMatchObject({
      version: "proof-safe-transaction/v1",
      to: "0x8BB09dcB204794de58957dC594dE35FEA769D141"
    });
    expect(splits.distribution[0]).toMatchObject({
      recipient: "0x8BB09dcB204794de58957dC594dE35FEA769D141",
      percentAllocation: 100
    });
    expect(drips).toMatchObject({
      version: "proof-drips-reference/v1",
      receiver: "0x8BB09dcB204794de58957dC594dE35FEA769D141"
    });
  });
});
