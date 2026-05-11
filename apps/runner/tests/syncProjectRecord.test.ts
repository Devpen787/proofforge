import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import {
  createProjectSyncManifest,
  parseSyncProjectRecordArgs,
  pullProjectSyncRecord
} from "../src/syncProjectRecord";

async function makeTempDir() {
  const dir = join(
    tmpdir(),
    `proofforge-project-sync-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
  await mkdir(dir, { recursive: true });
  return dir;
}

describe("syncProjectRecord", () => {
  it("publishes and pulls a verified project record", async () => {
    const dir = await makeTempDir();
    const recordPath = join(dir, "project.json");
    const receiptPath = join(dir, "project.0g-receipt.json");
    const manifestPath = join(dir, "project.project-sync.json");
    const pulledPath = join(dir, "pulled-project.json");

    await writeFile(
      recordPath,
      JSON.stringify(
        {
          version: "proof-project-record/v1",
          id: "pfp_test",
          project: {
            id: "docs-onboarding-sprint",
            name: "Docs Onboarding Sprint",
            source: "https://github.com/Devpen787/proofforge/issues/1"
          },
          state: { accepted: true },
          sources: [],
          missions: [],
          ledger: []
        },
        null,
        2
      ),
      "utf8"
    );
    await writeFile(
      receiptPath,
      JSON.stringify(
        {
          provider: "0g",
          uri: "0g://project-root",
          rootHash: "project-root",
          txHash: "0xproject"
        },
        null,
        2
      ),
      "utf8"
    );

    await createProjectSyncManifest({
      command: "publish",
      recordPath,
      receiptPath,
      outputPath: manifestPath
    });

    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    expect(manifest).toMatchObject({
      version: "proof-project-sync-manifest/v1",
      recordId: "pfp_test",
      project: {
        name: "Docs Onboarding Sprint"
      },
      storage: {
        rootHash: "project-root"
      }
    });

    await pullProjectSyncRecord({
      command: "pull",
      manifestPath,
      recordPath,
      outputPath: pulledPath
    });

    expect(JSON.parse(await readFile(pulledPath, "utf8"))).toMatchObject({
      id: "pfp_test"
    });
  });

  it("parses publish and pull commands", () => {
    expect(
      parseSyncProjectRecordArgs([
        "publish",
        "--record",
        "project.json",
        "--receipt",
        "receipt.json"
      ])
    ).toMatchObject({ command: "publish" });

    expect(
      parseSyncProjectRecordArgs(["pull", "--manifest", "project-sync.json"])
    ).toMatchObject({ command: "pull" });
  });
});
