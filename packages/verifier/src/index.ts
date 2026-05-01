import { stat } from "node:fs/promises";
import type { RunnerResult, VerifierResult } from "@proofforge/evidence";
import { verifierResultSchema } from "@proofforge/evidence";

export interface VerifyRunnerArtifactsInput {
  runnerResult: RunnerResult;
  expectedCommand: string;
}

export async function verifyRunnerArtifacts(input: VerifyRunnerArtifactsInput): Promise<VerifierResult> {
  const checks = [
    {
      name: "command matches mission",
      passed: input.runnerResult.command === input.expectedCommand,
      detail: `expected ${input.expectedCommand}, got ${input.runnerResult.command}`
    },
    {
      name: "stdout log exists",
      passed: await exists(input.runnerResult.stdoutPath),
      detail: input.runnerResult.stdoutPath
    },
    {
      name: "stderr log exists",
      passed: await exists(input.runnerResult.stderrPath),
      detail: input.runnerResult.stderrPath
    },
    {
      name: "environment manifest exists",
      passed: await exists(input.runnerResult.environmentPath),
      detail: input.runnerResult.environmentPath
    },
    {
      name: "exit code captured",
      passed: Number.isInteger(input.runnerResult.exitCode),
      detail: `exitCode=${input.runnerResult.exitCode}`
    }
  ];

  const passed = checks.every((check) => check.passed);

  return verifierResultSchema.parse({
    id: `verify_${input.runnerResult.id}`,
    runnerResultId: input.runnerResult.id,
    status: passed ? "passed" : "failed",
    checkedAt: new Date().toISOString(),
    checks,
    summary: passed
      ? "Runner artifacts are present and consistent with the mission command."
      : "Runner artifacts failed one or more verification checks."
  });
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}
