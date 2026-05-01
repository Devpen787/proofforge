import { describe, expect, it } from "vitest";
import {
  canConvertWorkLead,
  convertWorkLeadToMission,
  missionContractSchema,
  workLeadSchema
} from "../src/index";

const workLead = {
  id: "lead_docs_install_001",
  sourceType: "fixture",
  sourceUrl: "https://github.com/proofforge/fixture/issues/1",
  title: "Validate installation docs",
  rawRequest: "Run the documented install check and prove whether it works in a clean environment.",
  repo: "proofforge/fixture",
  acceptanceOwner: "fixture-maintainer",
  desiredEvidence: ["runner-result.json", "stdout.log", "stderr.log", "environment.json"],
  riskLevel: "low",
  proofability: 92,
  status: "mission_ready",
  reward: {
    amount: 8,
    currency: "USD",
    type: "external"
  },
  missing: [],
  blockedActions: ["open pull request", "post public comment", "access private repositories"]
};

describe("workLeadSchema", () => {
  it("accepts a proofable work lead", () => {
    expect(workLeadSchema.safeParse(workLead).success).toBe(true);
  });

  it("rejects work leads without an acceptance owner", () => {
    expect(workLeadSchema.safeParse({ ...workLead, acceptanceOwner: "" }).success).toBe(false);
  });
});

describe("convertWorkLeadToMission", () => {
  it("converts mission-ready work into a mission contract", () => {
    const parsedLead = workLeadSchema.parse(workLead);
    const mission = convertWorkLeadToMission(parsedLead);

    expect(missionContractSchema.safeParse(mission).success).toBe(true);
    expect(mission.status).toBe("ready");
    expect(mission.humanApprovalRequired).toBe(true);
    expect(mission.blockedActions).toContain("post public comment");
  });

  it("does not convert work that is missing clarification", () => {
    const parsedLead = workLeadSchema.parse({
      ...workLead,
      proofability: 72,
      status: "needs_triage",
      missing: ["exact command"]
    });

    expect(canConvertWorkLead(parsedLead)).toBe(false);
    expect(() => convertWorkLeadToMission(parsedLead)).toThrow("not mission-ready");
  });
});
