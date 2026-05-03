import { describe, expect, it } from "vitest";
import type { MissionContract } from "@proofforge/mission";
import { defaultTrustPolicy, evaluateMissionPolicy } from "../src/index";

const mission = {
  id: "mission_docs",
  riskLevel: "low",
  humanApprovalRequired: true,
  allowedActions: [
    "copy fixture into temporary workspace",
    "run allowlisted command",
    "capture logs"
  ],
  blockedActions: ["open pull request", "post public comment"]
} as MissionContract;

describe("evaluateMissionPolicy", () => {
  it("keeps low-risk missions evidence-only when human approval is required", () => {
    const decision = evaluateMissionPolicy(mission);

    expect(decision.status).toBe("evidence_only");
    expect(decision.blockedActions).toContain("open pull requests");
    expect(decision.blockedActions).toContain("post public comments");
  });

  it("requires approval when a mission asks for public side effects", () => {
    const decision = evaluateMissionPolicy({
      ...mission,
      allowedActions: [...mission.allowedActions, "open pull requests"]
    } as MissionContract);

    expect(decision.status).toBe("approval_required");
    expect(decision.reasons).toContain(
      "Mission allowed actions include external side effects."
    );
  });

  it("blocks missions if secrets are mounted", () => {
    const decision = evaluateMissionPolicy(mission, {
      ...defaultTrustPolicy,
      secretsMounted: true
    });

    expect(decision.status).toBe("blocked");
    expect(decision.reasons).toContain(
      "Secrets must not be mounted into runner missions."
    );
  });

  it("blocks missions if network is open by default", () => {
    const decision = evaluateMissionPolicy(mission, {
      ...defaultTrustPolicy,
      networkMode: "open"
    });

    expect(decision.status).toBe("blocked");
  });
});
