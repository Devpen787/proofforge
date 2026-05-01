import { spawn } from "node:child_process";
import { cp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { platform, release } from "node:os";
import { randomUUID } from "node:crypto";
import type { RunnerResult } from "@proofforge/evidence";

const allowedCommands = {
  "npm run proof:check": {
    command: "npm",
    args: ["run", "proof:check"]
  }
} as const;

export interface LocalMissionRunInput {
  fixtureDir: string;
  outputDir: string;
  command: keyof typeof allowedCommands;
  timeoutMs?: number;
  runId?: string;
}

interface CapturedProcess {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export async function runLocalMission(input: LocalMissionRunInput): Promise<RunnerResult> {
  const runId = input.runId ?? `run_${randomUUID()}`;
  const runDir = join(input.outputDir, runId);
  const workspaceDir = join(runDir, "workspace");
  const stdoutPath = join(runDir, "stdout.log");
  const stderrPath = join(runDir, "stderr.log");
  const environmentPath = join(runDir, "environment.json");
  const runnerResultPath = join(runDir, "runner-result.json");

  await mkdir(runDir, { recursive: true });
  await cp(input.fixtureDir, workspaceDir, { recursive: true });

  const startedAt = new Date();
  const captured = await runAllowedCommand(input.command, workspaceDir, input.timeoutMs ?? 10_000);
  const completedAt = new Date();

  const environment = {
    platform: platform(),
    release: release(),
    node: process.version,
    cwd: workspaceDir,
    command: input.command,
    network: "not requested by runner",
    externalActions: "locked"
  };

  await writeFile(stdoutPath, captured.stdout, "utf8");
  await writeFile(stderrPath, captured.stderr, "utf8");
  await writeFile(environmentPath, JSON.stringify(environment, null, 2), "utf8");

  const runnerResult: RunnerResult = {
    id: runId,
    command: input.command,
    exitCode: captured.exitCode,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    durationMs: completedAt.getTime() - startedAt.getTime(),
    stdoutPath,
    stderrPath,
    environmentPath
  };

  await writeFile(runnerResultPath, JSON.stringify(runnerResult, null, 2), "utf8");

  return runnerResult;
}

async function runAllowedCommand(
  commandName: keyof typeof allowedCommands,
  cwd: string,
  timeoutMs: number
): Promise<CapturedProcess> {
  const allowed = allowedCommands[commandName];

  return new Promise((resolve, reject) => {
    const child = spawn(allowed.command, allowed.args, {
      cwd,
      env: {
        PATH: process.env.PATH ?? "",
        NODE_ENV: "test"
      },
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      reject(new Error(`Command timed out after ${timeoutMs}ms.`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    });

    child.on("close", (exitCode) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({
        exitCode: exitCode ?? 1,
        stdout,
        stderr
      });
    });
  });
}
