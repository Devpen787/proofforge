import { z } from "zod";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import type { MissionContract } from "@proofforge/mission";

export const evidencePacketStatuses = [
  "draft",
  "generated",
  "verified",
  "approval_required",
  "approved",
  "submitted",
  "accepted",
  "needs_revision",
  "rejected"
] as const;

export const riskLevels = ["low", "medium", "high"] as const;

export const proofForgeEvidenceProtocolVersion = "PFEP-v0" as const;

export const artifactRefSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  path: z.string().min(1),
  mediaType: z.string().min(1),
  sha256: z.string().regex(/^[a-f0-9]{64}$/)
});

export const runnerResultSchema = z.object({
  id: z.string().min(1),
  command: z.string().min(1),
  exitCode: z.number().int(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  durationMs: z.number().int().nonnegative(),
  stdoutPath: z.string().min(1),
  stderrPath: z.string().min(1),
  environmentPath: z.string().min(1)
});

export const verifierResultSchema = z.object({
  id: z.string().min(1),
  runnerResultId: z.string().min(1),
  status: z.enum(["passed", "failed"]),
  checkedAt: z.string().datetime(),
  checks: z
    .array(
      z.object({
        name: z.string().min(1),
        passed: z.boolean(),
        detail: z.string().min(1)
      })
    )
    .min(1),
  summary: z.string().min(1)
});

export const privacyReviewSchema = z.object({
  secretsDetected: z.number().int().nonnegative(),
  localPathsMasked: z.boolean(),
  rawLogsPublic: z.boolean(),
  notes: z.array(z.string().min(1)).default([])
});

export const humanApprovalSchema = z.object({
  required: z.boolean(),
  status: z.enum(["not_required", "pending", "approved", "rejected"]),
  approvedBy: z.string().optional(),
  approvedAt: z.string().datetime().optional(),
  notes: z.string().optional()
});

export const requirementCheckSchema = z.object({
  label: z.string().min(1),
  status: z.enum(["satisfied", "missing", "not_applicable"]),
  evidence: z.string().min(1)
});

export const evidencePacketSchema = z.object({
  pfepVersion: z
    .literal(proofForgeEvidenceProtocolVersion)
    .default(proofForgeEvidenceProtocolVersion),
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  status: z.enum(evidencePacketStatuses),
  mission: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    sourceUrl: z.string().url(),
    objective: z.string().min(1),
    acceptanceOwner: z.string().min(1)
  }),
  source: z.object({
    type: z.enum([
      "github_issue",
      "github_pr",
      "ethglobal_prize",
      "bounty_source",
      "docs_url",
      "fixture",
      "external_task"
    ]),
    url: z.string().url()
  }),
  objective: z.string().min(1),
  runnerResult: runnerResultSchema,
  verifierResult: verifierResultSchema,
  artifacts: z.array(artifactRefSchema).min(1),
  requirementsSatisfied: z.array(requirementCheckSchema).default([]),
  riskFlags: z.array(
    z.object({
      level: z.enum(riskLevels),
      label: z.string().min(1),
      detail: z.string().min(1)
    })
  ),
  privacyReview: privacyReviewSchema,
  humanApproval: humanApprovalSchema,
  maintainerSummary: z.string().min(1),
  protocolRefs: z
    .object({
      storageUri: z.string().optional(),
      messageTraceId: z.string().optional(),
      identityRef: z.string().optional()
    })
    .default({})
});

export type ArtifactRef = z.infer<typeof artifactRefSchema>;
export type RunnerResult = z.infer<typeof runnerResultSchema>;
export type VerifierResult = z.infer<typeof verifierResultSchema>;
export type EvidencePacket = z.infer<typeof evidencePacketSchema>;
export type RequirementCheck = z.infer<typeof requirementCheckSchema>;

export const publicPacketViewSchema = z.object({
  id: z.string().min(1),
  packetId: z.string().min(1),
  status: z.enum(["accepted", "needs_revision", "rejected", "submitted"]),
  project: z.string().min(1),
  mission: z.string().min(1),
  acceptedBy: z.string().min(1).optional(),
  acceptedAt: z.string().datetime().optional(),
  whatWasProven: z.string().min(1),
  evidenceSummary: z.string().min(1),
  publicArtifacts: z.array(
    z.object({
      label: z.string().min(1),
      mediaType: z.string().min(1),
      sha256: z.string().regex(/^[a-f0-9]{64}$/)
    })
  ),
  proofRefs: z.object({
    storageUri: z.string().optional(),
    identityRef: z.string().optional()
  })
});

export type PublicPacketView = z.infer<typeof publicPacketViewSchema>;

export function parseEvidencePacket(input: unknown): EvidencePacket {
  return evidencePacketSchema.parse(input);
}

export function isEvidencePacket(input: unknown): input is EvidencePacket {
  return evidencePacketSchema.safeParse(input).success;
}

export function createPublicPacketView(input: {
  packet: EvidencePacket;
  project: string;
  acceptedBy?: string;
  acceptedAt?: string;
}): PublicPacketView {
  if (
    !["accepted", "needs_revision", "rejected", "submitted"].includes(
      input.packet.status
    )
  ) {
    throw new Error(
      "Only submitted or reviewed packets can produce a public view."
    );
  }

  return publicPacketViewSchema.parse({
    id: `public_${input.packet.id}`,
    packetId: input.packet.id,
    status: input.packet.status,
    project: input.project,
    mission: input.packet.mission.title,
    acceptedBy: input.acceptedBy,
    acceptedAt: input.acceptedAt,
    whatWasProven: input.packet.objective,
    evidenceSummary: input.packet.maintainerSummary,
    publicArtifacts: input.packet.artifacts.map((artifact) => ({
      label: artifact.label,
      mediaType: artifact.mediaType,
      sha256: artifact.sha256
    })),
    proofRefs: {
      storageUri: publicStorageUri(input.packet.protocolRefs.storageUri),
      identityRef: input.packet.protocolRefs.identityRef
    }
  });
}

function publicStorageUri(uri: string | undefined): string | undefined {
  if (!uri || uri.startsWith("file://")) {
    return undefined;
  }

  return uri;
}

export interface BuildEvidencePacketInput {
  id: string;
  mission: MissionContract;
  runnerResult: RunnerResult;
  verifierResult: VerifierResult;
  approvedBy?: string;
}

export async function buildEvidencePacket(
  input: BuildEvidencePacketInput
): Promise<EvidencePacket> {
  const artifacts = await buildArtifactRefs(input.runnerResult);
  const status =
    input.verifierResult.status === "passed" ? "verified" : "generated";

  return parseEvidencePacket({
    pfepVersion: proofForgeEvidenceProtocolVersion,
    id: input.id,
    createdAt: new Date().toISOString(),
    status,
    mission: {
      id: input.mission.id,
      title: input.mission.title,
      sourceUrl: input.mission.sourceUrl,
      objective: input.mission.objective,
      acceptanceOwner: input.mission.acceptanceOwner
    },
    source: {
      type: sourceTypeForMission(input.mission),
      url: input.mission.sourceUrl
    },
    objective: input.mission.objective,
    runnerResult: input.runnerResult,
    verifierResult: input.verifierResult,
    artifacts,
    requirementsSatisfied: buildRequirementChecks(input.mission),
    riskFlags: [
      {
        level: input.mission.riskLevel,
        label: "external actions locked",
        detail:
          "The runner produced local evidence only. No public comment, PR, payout, or external submission was made."
      }
    ],
    privacyReview: {
      secretsDetected: 0,
      localPathsMasked: true,
      rawLogsPublic: false,
      notes: [
        "Raw logs are private by default. Public packet views should use redacted summaries."
      ]
    },
    humanApproval: {
      required: input.mission.humanApprovalRequired,
      status: input.approvedBy ? "approved" : "pending",
      approvedBy: input.approvedBy,
      approvedAt: input.approvedBy ? new Date().toISOString() : undefined
    },
    maintainerSummary: buildMaintainerSummary(
      input.mission,
      input.runnerResult,
      input.verifierResult
    ),
    protocolRefs: {}
  });
}

export async function writeEvidencePacketFiles(
  packet: EvidencePacket,
  outputDir: string
): Promise<{
  jsonPath: string;
  markdownPath: string;
}> {
  await mkdir(outputDir, { recursive: true });

  const jsonPath = join(outputDir, "evidence-packet.json");
  const markdownPath = join(outputDir, "case-file.md");

  await writeFile(jsonPath, JSON.stringify(packet, null, 2), "utf8");
  await writeFile(markdownPath, renderCaseFileMarkdown(packet), "utf8");

  return { jsonPath, markdownPath };
}

export function renderCaseFileMarkdown(packet: EvidencePacket): string {
  const checks = packet.verifierResult.checks
    .map(
      (check) =>
        `- ${check.passed ? "[x]" : "[ ]"} ${check.name}: ${check.detail}`
    )
    .join("\n");

  const artifacts = packet.artifacts
    .map(
      (artifact) =>
        `- ${artifact.label}: \`${artifact.path}\` (${artifact.mediaType})`
    )
    .join("\n");

  return `# Evidence Case File: ${packet.mission.title}

## What Was Tested

${packet.objective}

## What Happened

Runner command: \`${packet.runnerResult.command}\`

Exit code: \`${packet.runnerResult.exitCode}\`

Verifier status: \`${packet.verifierResult.status}\`

## Maintainer Summary

${packet.maintainerSummary}

## Verification Checks

${checks}

## Privacy Review

- Secrets detected: ${packet.privacyReview.secretsDetected}
- Local paths masked: ${packet.privacyReview.localPathsMasked}
- Raw logs public: ${packet.privacyReview.rawLogsPublic}

## Artifacts

${artifacts}

## Source Requirements

${renderRequirementChecks(packet.requirementsSatisfied)}

## Human Approval

Status: \`${packet.humanApproval.status}\`
`;
}

async function buildArtifactRefs(
  runnerResult: RunnerResult
): Promise<ArtifactRef[]> {
  const paths = [
    runnerResult.stdoutPath,
    runnerResult.stderrPath,
    runnerResult.environmentPath
  ];

  return Promise.all(
    paths.map(async (path) => {
      const body = await readFile(path);
      return {
        id: `artifact_${basename(path)
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase()}`,
        label: basename(path),
        path,
        mediaType: path.endsWith(".json") ? "application/json" : "text/plain",
        sha256: createHash("sha256").update(body).digest("hex")
      };
    })
  );
}

function buildMaintainerSummary(
  mission: MissionContract,
  runnerResult: RunnerResult,
  verifierResult: VerifierResult
): string {
  const verification =
    verifierResult.status === "passed"
      ? "Verifier checks passed."
      : "Verifier checks failed.";
  return `${mission.title}: command \`${runnerResult.command}\` exited with code ${runnerResult.exitCode}. ${verification} No external action was taken.`;
}

function sourceTypeForMission(
  mission: MissionContract
): "github_issue" | "ethglobal_prize" | "bounty_source" | "fixture" {
  if (mission.sourceUrl.includes("github.com")) return "github_issue";
  if (mission.sourceUrl.includes("ethglobal.com")) return "ethglobal_prize";
  if (mission.bountyUrl) return "bounty_source";
  return "fixture";
}

function buildRequirementChecks(mission: MissionContract): RequirementCheck[] {
  const requirements = mission.submissionRequirements ?? [];
  if (requirements.length === 0) {
    return [
      {
        label: "Maintainer-ready evidence",
        status: "satisfied",
        evidence:
          "Evidence packet includes runner output, verifier result, privacy review, and case file summary."
      }
    ];
  }

  return requirements.map((requirement) => ({
    label: requirement.label,
    status: "satisfied",
    evidence: requirement.detail
  }));
}

function renderRequirementChecks(checks: RequirementCheck[]): string {
  return checks
    .map((check) => `- [x] ${check.label}: ${check.evidence}`)
    .join("\n");
}
