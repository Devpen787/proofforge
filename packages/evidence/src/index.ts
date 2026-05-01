import { z } from "zod";

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

export const evidencePacketSchema = z.object({
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
    type: z.enum(["github_issue", "github_pr", "docs_url", "fixture", "external_task"]),
    url: z.string().url()
  }),
  objective: z.string().min(1),
  runnerResult: runnerResultSchema,
  verifierResult: verifierResultSchema,
  artifacts: z.array(artifactRefSchema).min(1),
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

export function parseEvidencePacket(input: unknown): EvidencePacket {
  return evidencePacketSchema.parse(input);
}

export function isEvidencePacket(input: unknown): input is EvidencePacket {
  return evidencePacketSchema.safeParse(input).success;
}
