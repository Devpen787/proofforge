import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import {
  createSyncManifest,
  parseSyncNetworkRecordArgs,
  pullSyncRecord
} from "../src/syncNetworkRecord";

async function makeTempDir() {
  const dir = join(
    tmpdir(),
    `proofforge-sync-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
  await mkdir(dir, { recursive: true });
  return dir;
}

describe("syncNetworkRecord", () => {
  it("publishes a 0G sync manifest and pulls a verified local copy", async () => {
    const dir = await makeTempDir();
    const wallet = Wallet.createRandom();
    const message = JSON.stringify({
      domain: "ProofForge",
      action: "accept-proof",
      packet: "packet_docs_install_demo"
    });
    const signature = await wallet.signMessage(message);
    const record = {
      version: "proof-network-record/v1",
      id: "pfn_test_record",
      appState: { selectedOpportunityId: "docs-install" },
      receipts: {
        walletProvider: "browser",
        walletAddress: wallet.address,
        walletMessage: message,
        walletSignature: signature
      }
    };
    const recordPath = join(dir, "record.json");
    const receiptPath = join(dir, "record.0g-receipt.json");
    const manifestPath = join(dir, "record.sync.json");
    const pulledPath = join(dir, "pulled.json");

    await writeFile(recordPath, JSON.stringify(record, null, 2), "utf8");
    await writeFile(
      receiptPath,
      JSON.stringify(
        {
          provider: "0g",
          uri: "0g://root-test",
          rootHash: "root-test",
          txHash: "0xtx"
        },
        null,
        2
      ),
      "utf8"
    );

    await createSyncManifest({
      command: "publish",
      recordPath,
      receiptPath,
      outputPath: manifestPath
    });

    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    expect(manifest).toMatchObject({
      version: "proof-sync-manifest/v1",
      recordId: "pfn_test_record",
      storage: {
        provider: "0g",
        rootHash: "root-test"
      },
      acceptance: {
        status: "verified",
        recoveredAddress: wallet.address
      }
    });

    await pullSyncRecord({
      command: "pull",
      manifestPath,
      recordPath,
      outputPath: pulledPath
    });

    expect(JSON.parse(await readFile(pulledPath, "utf8"))).toMatchObject({
      id: "pfn_test_record"
    });
  });

  it("parses publish and pull commands", () => {
    expect(
      parseSyncNetworkRecordArgs([
        "publish",
        "--record",
        "record.json",
        "--receipt",
        "receipt.json"
      ])
    ).toMatchObject({
      command: "publish"
    });

    expect(
      parseSyncNetworkRecordArgs(["pull", "--manifest", "record.sync.json"])
    ).toMatchObject({
      command: "pull"
    });
  });

  it("rejects unknown commands", () => {
    expect(() => parseSyncNetworkRecordArgs([])).toThrow("sync:publish-record");
  });
});
