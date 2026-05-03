import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { createLocalJsonStore } from "../src/index";

describe("local JSON store", () => {
  it("persists and reads structured V2 graph snapshots", async () => {
    const dir = await mkdtemp(join(tmpdir(), "proofforge-graph-store-"));
    const path = join(dir, "graph.json");
    const store = createLocalJsonStore<{ id: string; version: string }>(path);

    expect(await store.read()).toBeUndefined();

    const receipt = await store.write({ id: "graph_alex", version: "v2" });
    expect(receipt.provider).toBe("local");
    expect(receipt.uri).toContain("graph.json");
    expect(await store.read()).toEqual({ id: "graph_alex", version: "v2" });

    await rm(dir, { recursive: true, force: true });
  });
});
