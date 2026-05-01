import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { describe, expect, it } from "vitest";
import { createLocalStorageAdapter } from "../src/index";

describe("createLocalStorageAdapter", () => {
  it("stores a file locally and returns a stable local receipt", async () => {
    const sourceDir = await mkdtemp(join(tmpdir(), "proofforge-storage-source-"));
    const destDir = await mkdtemp(join(tmpdir(), "proofforge-storage-dest-"));
    const source = join(sourceDir, "evidence-packet.json");

    await writeFile(source, JSON.stringify({ id: "packet_001" }), "utf8");

    const adapter = createLocalStorageAdapter(destDir);
    const receipt = await adapter.putFile({
      path: source,
      contentType: "application/json"
    });

    expect(receipt.provider).toBe("local");
    expect(receipt.uri).toContain("file://");
    await expect(stat(join(destDir, basename(source)))).resolves.toBeTruthy();
    await expect(readFile(join(destDir, basename(source)), "utf8")).resolves.toContain("packet_001");
  });
});
