import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { runLocalMission } from "../../../apps/runner/src/index";
import { verifyRunnerArtifacts } from "../src/index";

describe("verifyRunnerArtifacts", () => {
  it("creates an independent passed verifier result for a complete runner result", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "proofforge-verify-"));
    const runnerResult = await runLocalMission({
      fixtureDir: resolve("apps/runner/fixtures/docs-install"),
      outputDir,
      command: "npm run proof:check",
      runId: "run_verified_fixture"
    });

    const verifierResult = await verifyRunnerArtifacts({
      runnerResult,
      expectedCommand: "npm run proof:check"
    });

    expect(verifierResult.id).not.toBe(runnerResult.id);
    expect(verifierResult.runnerResultId).toBe(runnerResult.id);
    expect(verifierResult.status).toBe("passed");
    expect(verifierResult.checks.every((check) => check.passed)).toBe(true);
  });

  it("fails when the mission command does not match the runner result", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "proofforge-verify-"));
    const runnerResult = await runLocalMission({
      fixtureDir: resolve("apps/runner/fixtures/docs-install"),
      outputDir,
      command: "npm run proof:check",
      runId: "run_wrong_command_fixture"
    });

    const verifierResult = await verifyRunnerArtifacts({
      runnerResult,
      expectedCommand: "npm test"
    });

    expect(verifierResult.status).toBe("failed");
    expect(
      verifierResult.checks.find(
        (check) => check.name === "command matches mission"
      )?.passed
    ).toBe(false);
  });
});
