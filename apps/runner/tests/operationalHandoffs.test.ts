import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { createEasAttestationPayload } from "../src/createEasAttestationPayload";
import { createGitHubHandoff } from "../src/createGitHubHandoff";

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
});
