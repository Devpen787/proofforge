import { z } from "zod";

export const workLeadStatuses = [
  "imported",
  "needs_triage",
  "proofable",
  "mission_ready",
  "converted",
  "rejected"
] as const;

export const missionStatuses = [
  "ready",
  "running",
  "approval_required",
  "packet_ready",
  "submitted",
  "accepted",
  "revision_requested",
  "rejected"
] as const;

export const sourceTypes = [
  "github_issue",
  "github_pr",
  "docs_url",
  "fixture",
  "marketplace_task",
  "foundation_backlog",
  "private_request"
] as const;

export const missionTypes = [
  "bug_reproduction",
  "pr_verification",
  "docs_validation",
  "regression_test",
  "release_check",
  "compatibility_check",
  "security_reproduction",
  "milestone_proof"
] as const;

export const workLeadSchema = z.object({
  id: z.string().min(1),
  sourceType: z.enum(sourceTypes),
  sourceUrl: z.string().url(),
  title: z.string().min(1),
  rawRequest: z.string().min(1),
  repo: z.string().min(1),
  acceptanceOwner: z.string().min(1),
  desiredEvidence: z.array(z.string().min(1)).min(1),
  riskLevel: z.enum(["low", "medium", "high"]),
  proofability: z.number().min(0).max(100),
  status: z.enum(workLeadStatuses),
  reward: z
    .object({
      amount: z.number().nonnegative(),
      currency: z.string().min(1),
      type: z.enum(["cash", "credit", "reputation", "external", "none"])
    })
    .optional(),
  missing: z.array(z.string().min(1)).default([]),
  blockedActions: z.array(z.string().min(1)).default([])
});

export const missionContractSchema = z.object({
  id: z.string().min(1),
  sourceLeadId: z.string().min(1),
  status: z.enum(missionStatuses),
  type: z.enum(missionTypes),
  title: z.string().min(1),
  repo: z.string().min(1),
  sourceUrl: z.string().url(),
  objective: z.string().min(1),
  acceptanceOwner: z.string().min(1),
  expectedOutcome: z.enum(["success", "failure", "evidence_only"]),
  allowedActions: z.array(z.string().min(1)).min(1),
  blockedActions: z.array(z.string().min(1)),
  requiredEvidence: z.array(z.string().min(1)).min(1),
  riskLevel: z.enum(["low", "medium", "high"]),
  humanApprovalRequired: z.boolean(),
  reward: z
    .object({
      amount: z.number().nonnegative(),
      currency: z.string().min(1),
      type: z.enum(["cash", "credit", "reputation", "external", "none"])
    })
    .optional()
});

export type WorkLead = z.infer<typeof workLeadSchema>;
export type MissionContract = z.infer<typeof missionContractSchema>;

export function parseWorkLead(input: unknown): WorkLead {
  return workLeadSchema.parse(input);
}

export function parseMissionContract(input: unknown): MissionContract {
  return missionContractSchema.parse(input);
}

export function canConvertWorkLead(lead: WorkLead): boolean {
  return lead.proofability >= 80 && lead.missing.length === 0 && lead.status !== "rejected";
}

export function convertWorkLeadToMission(lead: WorkLead): MissionContract {
  if (!canConvertWorkLead(lead)) {
    throw new Error("Work lead is not mission-ready.");
  }

  return missionContractSchema.parse({
    id: `mission_${lead.id}`,
    sourceLeadId: lead.id,
    status: "ready",
    type: lead.sourceType === "docs_url" || lead.title.toLowerCase().includes("docs")
      ? "docs_validation"
      : "bug_reproduction",
    title: lead.title,
    repo: lead.repo,
    sourceUrl: lead.sourceUrl,
    objective: lead.rawRequest,
    acceptanceOwner: lead.acceptanceOwner,
    expectedOutcome: "evidence_only",
    allowedActions: [
      "copy fixture into temporary workspace",
      "run allowlisted command",
      "capture logs",
      "capture environment",
      "generate evidence packet"
    ],
    blockedActions: lead.blockedActions,
    requiredEvidence: lead.desiredEvidence,
    riskLevel: lead.riskLevel,
    humanApprovalRequired: true,
    reward: lead.reward
  });
}
