import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type {
  EvidencePacket,
  RunnerResult,
  VerifierResult
} from "@proofforge/evidence";
import {
  evidencePacketSchema,
  parseEvidencePacket,
  proofForgeEvidenceProtocolVersion,
  verifierResultSchema
} from "@proofforge/evidence";

export { proofForgeEvidenceProtocolVersion } from "@proofforge/evidence";

export interface VerifyRunnerArtifactsInput {
  runnerResult: RunnerResult;
  expectedCommand: string;
}

export async function verifyRunnerArtifacts(
  input: VerifyRunnerArtifactsInput
): Promise<VerifierResult> {
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

export type PacketVerificationSeverity = "error" | "warning";

export interface PacketVerificationFinding {
  severity: PacketVerificationSeverity;
  code: string;
  message: string;
  path?: string;
}

export interface VerifyEvidencePacketInput {
  packet: unknown;
  artifactBaseDir?: string;
}

export interface EvidencePacketVerificationReport {
  ok: boolean;
  protocolVersion: typeof proofForgeEvidenceProtocolVersion;
  digest: string | null;
  findings: PacketVerificationFinding[];
  packet?: EvidencePacket;
}

export async function verifyEvidencePacket(
  input: VerifyEvidencePacketInput
): Promise<EvidencePacketVerificationReport> {
  const schemaResult = evidencePacketSchema.safeParse(input.packet);
  if (!schemaResult.success) {
    return {
      ok: false,
      protocolVersion: proofForgeEvidenceProtocolVersion,
      digest: null,
      findings: schemaResult.error.issues.map((issue) => ({
        severity: "error",
        code: "packet.schema_invalid",
        message: issue.message,
        path: issue.path.join(".")
      }))
    };
  }

  const packet = parseEvidencePacket(schemaResult.data);
  const findings: PacketVerificationFinding[] = [];

  verifyProtocolCompatibility(input.packet, findings);
  verifyRunnerVerifierConsistency(packet, findings);
  verifyPrivacyReview(packet, findings);
  verifyProtocolRefs(packet, findings);
  await verifyArtifacts(packet, findings, input.artifactBaseDir);

  const digest = digestEvidencePacket(packet);
  const ok = findings.every((finding) => finding.severity !== "error");

  return {
    ok,
    protocolVersion: proofForgeEvidenceProtocolVersion,
    digest,
    findings,
    packet
  };
}

export function digestEvidencePacket(packet: EvidencePacket): string {
  return sha256(stableStringify(canonicalizeEvidencePacket(packet)));
}

function verifyProtocolCompatibility(
  rawPacket: unknown,
  findings: PacketVerificationFinding[]
): void {
  if (!isRecord(rawPacket) || !("pfepVersion" in rawPacket)) {
    findings.push({
      severity: "warning",
      code: "packet.version_derived",
      message:
        "Packet has no explicit pfepVersion field; verified as PFEP-v0-compatible from the current schema."
    });
    return;
  }

  if (rawPacket.pfepVersion !== proofForgeEvidenceProtocolVersion) {
    findings.push({
      severity: "error",
      code: "packet.version_unsupported",
      message: `Unsupported pfepVersion ${String(rawPacket.pfepVersion)}. Expected ${proofForgeEvidenceProtocolVersion}.`
    });
  }
}

function verifyRunnerVerifierConsistency(
  packet: EvidencePacket,
  findings: PacketVerificationFinding[]
): void {
  if (packet.verifierResult.runnerResultId !== packet.runnerResult.id) {
    findings.push({
      severity: "error",
      code: "verifier.runner_mismatch",
      message: `Verifier references runner ${packet.verifierResult.runnerResultId}, but packet runner is ${packet.runnerResult.id}.`,
      path: "verifierResult.runnerResultId"
    });
  }

  const checksPassed = packet.verifierResult.checks.every(
    (check) => check.passed
  );
  if (packet.verifierResult.status === "passed" && !checksPassed) {
    findings.push({
      severity: "error",
      code: "verifier.status_incoherent",
      message:
        "Verifier status is passed, but one or more verifier checks failed.",
      path: "verifierResult"
    });
  }

  if (packet.verifierResult.status === "failed" && checksPassed) {
    findings.push({
      severity: "warning",
      code: "verifier.failed_with_all_checks_passed",
      message:
        "Verifier status is failed even though all individual checks passed.",
      path: "verifierResult"
    });
  }

  const verifiedLikeStatuses = new Set([
    "verified",
    "approval_required",
    "approved",
    "submitted",
    "accepted"
  ]);
  if (
    verifiedLikeStatuses.has(packet.status) &&
    packet.verifierResult.status !== "passed"
  ) {
    findings.push({
      severity: "error",
      code: "packet.status_requires_passed_verifier",
      message: `Packet status ${packet.status} requires a passed verifier result.`,
      path: "status"
    });
  }

  if (packet.mission.sourceUrl !== packet.source.url) {
    findings.push({
      severity: "error",
      code: "source.url_mismatch",
      message: "Mission sourceUrl and packet source.url must match.",
      path: "source.url"
    });
  }

  if (packet.mission.objective !== packet.objective) {
    findings.push({
      severity: "warning",
      code: "mission.objective_mismatch",
      message: "Mission objective and packet objective differ.",
      path: "objective"
    });
  }

  if (
    packet.humanApproval.status === "approved" &&
    (!packet.humanApproval.approvedBy || !packet.humanApproval.approvedAt)
  ) {
    findings.push({
      severity: "error",
      code: "approval.approved_missing_fields",
      message:
        "Approved packets must include humanApproval.approvedBy and humanApproval.approvedAt.",
      path: "humanApproval"
    });
  }
}

function verifyPrivacyReview(
  packet: EvidencePacket,
  findings: PacketVerificationFinding[]
): void {
  if (packet.privacyReview.secretsDetected > 0) {
    findings.push({
      severity: "error",
      code: "privacy.secrets_detected",
      message: `Privacy review detected ${packet.privacyReview.secretsDetected} secret(s).`,
      path: "privacyReview.secretsDetected"
    });
  }

  if (!packet.privacyReview.localPathsMasked) {
    findings.push({
      severity: "error",
      code: "privacy.local_paths_not_masked",
      message: "Local paths must be masked before a packet is public-safe.",
      path: "privacyReview.localPathsMasked"
    });
  }

  if (packet.privacyReview.rawLogsPublic) {
    findings.push({
      severity: "error",
      code: "privacy.raw_logs_public",
      message: "Raw logs are marked public; publish only redacted summaries.",
      path: "privacyReview.rawLogsPublic"
    });
  }
}

function verifyProtocolRefs(
  packet: EvidencePacket,
  findings: PacketVerificationFinding[]
): void {
  const { identityRef, messageTraceId, storageUri } = packet.protocolRefs;

  if (storageUri && !isSupportedStorageUri(storageUri)) {
    findings.push({
      severity: "error",
      code: "protocol.storage_uri_unsupported",
      message:
        "storageUri must use a supported proof storage scheme: 0g://, ipfs://, ar://, file://, or https://.",
      path: "protocolRefs.storageUri"
    });
  }

  if (identityRef !== undefined && identityRef.trim().length === 0) {
    findings.push({
      severity: "error",
      code: "protocol.identity_ref_empty",
      message: "identityRef cannot be empty when present.",
      path: "protocolRefs.identityRef"
    });
  }

  if (messageTraceId !== undefined && messageTraceId.trim().length === 0) {
    findings.push({
      severity: "error",
      code: "protocol.message_trace_empty",
      message: "messageTraceId cannot be empty when present.",
      path: "protocolRefs.messageTraceId"
    });
  }
}

async function verifyArtifacts(
  packet: EvidencePacket,
  findings: PacketVerificationFinding[],
  artifactBaseDir?: string
): Promise<void> {
  const artifactPaths = new Set<string>();

  for (const artifact of packet.artifacts) {
    if (artifactPaths.has(artifact.path)) {
      findings.push({
        severity: "error",
        code: "artifact.duplicate_path",
        message: `Duplicate artifact path ${artifact.path}.`,
        path: `artifacts.${artifact.id}.path`
      });
    }
    artifactPaths.add(artifact.path);

    const artifactPath = resolveArtifactPath(artifact.path, artifactBaseDir);
    if (!artifactPath) {
      findings.push({
        severity: "warning",
        code: "artifact.remote_not_checked",
        message: `Artifact ${artifact.id} uses a remote or unsupported path and was not hash-checked.`,
        path: `artifacts.${artifact.id}.path`
      });
      continue;
    }

    let body: Buffer;
    try {
      body = await readFile(artifactPath);
    } catch {
      findings.push({
        severity: "error",
        code: "artifact.missing",
        message: `Artifact ${artifact.id} does not exist at ${artifact.path}.`,
        path: `artifacts.${artifact.id}.path`
      });
      continue;
    }

    const actual = sha256(body);
    if (actual !== artifact.sha256) {
      findings.push({
        severity: "error",
        code: "artifact.hash_mismatch",
        message: `Artifact ${artifact.id} hash mismatch. Expected ${artifact.sha256}, got ${actual}.`,
        path: `artifacts.${artifact.id}.sha256`
      });
    }
  }

  verifyRunnerPathIsArtifact(
    "runner.stdout",
    packet.runnerResult.stdoutPath,
    artifactPaths,
    findings
  );
  verifyRunnerPathIsArtifact(
    "runner.stderr",
    packet.runnerResult.stderrPath,
    artifactPaths,
    findings
  );
  verifyRunnerPathIsArtifact(
    "runner.environment",
    packet.runnerResult.environmentPath,
    artifactPaths,
    findings
  );
}

function verifyRunnerPathIsArtifact(
  label: string,
  path: string,
  artifactPaths: Set<string>,
  findings: PacketVerificationFinding[]
): void {
  if (!artifactPaths.has(path)) {
    findings.push({
      severity: "error",
      code: "runner.artifact_missing_ref",
      message: `${label} path ${path} is not present in packet artifacts.`,
      path: "artifacts"
    });
  }
}

function resolveArtifactPath(
  artifactPath: string,
  artifactBaseDir?: string
): string | URL | null {
  if (artifactPath.startsWith("file://")) {
    return new URL(artifactPath);
  }
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(artifactPath)) {
    return null;
  }
  if (artifactPath.startsWith("/")) {
    return artifactPath;
  }
  if (artifactBaseDir) {
    return join(artifactBaseDir, artifactPath);
  }
  return artifactPath;
}

function isSupportedStorageUri(uri: string): boolean {
  return /^(0g|ipfs|ar|file):\/\//.test(uri) || uri.startsWith("https://");
}

function canonicalizeEvidencePacket(packet: EvidencePacket): EvidencePacket {
  return packet;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortJson(value));
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, sortJson(entryValue)])
    );
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sha256(body: Buffer | string): string {
  return createHash("sha256").update(body).digest("hex");
}
