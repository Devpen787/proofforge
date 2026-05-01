import { z } from "zod";
import type { MissionContract } from "@proofforge/mission";

export const trustPolicySchema = z.object({
  sandboxRequired: z.boolean(),
  writeAccessBlocked: z.boolean(),
  secretsMounted: z.boolean(),
  networkMode: z.enum(["restricted", "open"]),
  publicCommentsRequireApproval: z.boolean(),
  pullRequestsRequireApproval: z.boolean(),
  paidToolsRequireApproval: z.boolean(),
  maxRuntimeMinutes: z.number().int().positive()
});

export const defaultTrustPolicy = trustPolicySchema.parse({
  sandboxRequired: true,
  writeAccessBlocked: true,
  secretsMounted: false,
  networkMode: "restricted",
  publicCommentsRequireApproval: true,
  pullRequestsRequireApproval: true,
  paidToolsRequireApproval: true,
  maxRuntimeMinutes: 60
});

export const policyDecisionSchema = z.object({
  status: z.enum(["safe_to_run", "evidence_only", "approval_required", "blocked"]),
  humanApprovalRequired: z.boolean(),
  reasons: z.array(z.string().min(1)),
  blockedActions: z.array(z.string().min(1)),
  allowedActions: z.array(z.string().min(1)),
  policy: trustPolicySchema
});

export type TrustPolicy = z.infer<typeof trustPolicySchema>;
export type PolicyDecision = z.infer<typeof policyDecisionSchema>;

export function evaluateMissionPolicy(
  mission: MissionContract,
  policy: TrustPolicy = defaultTrustPolicy
): PolicyDecision {
  const reasons: string[] = [];
  const blockedActions = new Set(mission.blockedActions);
  const allowedActions = new Set(mission.allowedActions);

  if (!policy.sandboxRequired) {
    reasons.push("Sandbox policy is disabled.");
  }
  if (!policy.writeAccessBlocked) {
    reasons.push("Host write access is not blocked.");
  }
  if (policy.secretsMounted) {
    reasons.push("Secrets must not be mounted into runner missions.");
  }
  if (policy.networkMode !== "restricted") {
    reasons.push("Network must be restricted for MVP proof runs.");
  }

  requireApprovalForAction(policy.publicCommentsRequireApproval, blockedActions, "post public comments");
  requireApprovalForAction(policy.pullRequestsRequireApproval, blockedActions, "open pull requests");
  requireApprovalForAction(policy.paidToolsRequireApproval, blockedActions, "spend funds");

  const asksForPublicAction = [...allowedActions].some((action) =>
    ["post public comments", "open pull requests", "spend funds"].includes(action)
  );
  if (asksForPublicAction) {
    reasons.push("Mission allowed actions include external side effects.");
  }

  if (mission.riskLevel === "high") {
    reasons.push("High-risk missions require manual review before any runner action.");
  }

  const status = decideStatus({
    structuralPolicySafe: reasons.length === 0 || reasons.every((reason) => reason.includes("require manual review")),
    asksForPublicAction,
    riskLevel: mission.riskLevel,
    humanApprovalRequired: mission.humanApprovalRequired,
    policy
  });

  return policyDecisionSchema.parse({
    status,
    humanApprovalRequired: mission.humanApprovalRequired || status !== "safe_to_run",
    reasons: reasons.length > 0 ? reasons : ["Mission can run locally in evidence-only mode."],
    blockedActions: [...blockedActions],
    allowedActions: [...allowedActions],
    policy
  });
}

function requireApprovalForAction(requireApproval: boolean, blockedActions: Set<string>, action: string): void {
  if (requireApproval) {
    blockedActions.add(action);
  }
}

function decideStatus(input: {
  structuralPolicySafe: boolean;
  asksForPublicAction: boolean;
  riskLevel: MissionContract["riskLevel"];
  humanApprovalRequired: boolean;
  policy: TrustPolicy;
}): PolicyDecision["status"] {
  if (
    !input.policy.sandboxRequired ||
    !input.policy.writeAccessBlocked ||
    input.policy.secretsMounted ||
    input.policy.networkMode !== "restricted"
  ) {
    return "blocked";
  }
  if (input.riskLevel === "high" || input.asksForPublicAction) {
    return "approval_required";
  }
  if (input.humanApprovalRequired) {
    return "evidence_only";
  }

  return input.structuralPolicySafe ? "safe_to_run" : "blocked";
}
