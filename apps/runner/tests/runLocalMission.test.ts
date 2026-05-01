import { mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { runnerResultSchema } from "@proofforge/evidence";
import { runLocalMission } from "../src/index";

describe("runLocalMission", () => {
  it("runs an allowlisted fixture command and writes evidence artifacts", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "proofforge-run-"));
    const fixtureDir = resolve("apps/runner/fixtures/docs-install");

    const result = await runLocalMission({
      fixtureDir,
      outputDir,
      command: "npm run proof:check",
      runId: "run_fixture_docs"
    });

    expect(runnerResultSchema.safeParse(result).success).toBe(true);
    expect(result.exitCode).toBe(1);

    await expect(stat(join(outputDir, "run_fixture_docs", "runner-result.json"))).resolves.toBeTruthy();
    await expect(stat(result.stdoutPath)).resolves.toBeTruthy();
    await expect(stat(result.stderrPath)).resolves.toBeTruthy();
    await expect(stat(result.environmentPath)).resolves.toBeTruthy();

    await expect(readFile(result.stdoutPath, "utf8")).resolves.toContain("Checking documented install flow");
    await expect(readFile(result.stderrPath, "utf8")).resolves.toContain("Missing docs-ready.flag");
    await expect(readFile(result.environmentPath, "utf8")).resolves.toContain("externalActions");
  });
});
