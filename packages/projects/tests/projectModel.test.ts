import { describe, expect, it } from "vitest";
import type { EvidencePacket } from "@proofforge/evidence";
import type { MissionContract, WorkLead } from "@proofforge/mission";
import type { Payout } from "@proofforge/payments";
import {
  addMissionToProject,
  addWorkLeadToProject,
  attachAgentDelegation,
  canUseProjectOutput,
  createProject,
  inviteProjectMember,
  recordAcceptedProof
} from "../src/index";

const now = new Date("2026-05-01T12:00:00.000Z");

describe("project model", () => {
  it("creates a project with the founder as steward", () => {
    const project = createProject({
      id: "project_docs",
      name: "Docs Onboarding Sprint",
      handle: "docs-onboarding",
      purpose: "Turn install friction into accepted proof packets.",
      founder: "alex",
      lanes: ["Docs validation", "Bug reproduction"],
      rewardPool: 240,
      now
    });

    expect(project.members[0].role).toBe("founder_steward");
    expect(project.members[0].permissions).toContain("attach_agents");
    expect(project.rewardPool).toBe(240);
  });

  it("invites contributors without granting active status immediately", () => {
    const project = inviteProjectMember(baseProject(), {
      handle: "sam",
      role: "contributor",
      permissions: ["run_missions", "suggest_work"],
      now
    });

    expect(
      project.members.find((member) => member.handle === "sam")?.status
    ).toBe("pending");
  });

  it("attaches constrained agent delegations", () => {
    const project = attachAgentDelegation(baseProject(), {
      id: "agent_docs_runner",
      name: "docs-runner-01",
      type: "runner",
      allowedActions: [
        "clone public repositories",
        "run tests",
        "capture logs"
      ],
      blockedActions: [
        "open pull requests",
        "post public comments",
        "spend funds"
      ],
      now
    });

    expect(project.agents[0].allowedActions).toContain("capture logs");
    expect(project.agents[0].blockedActions).toContain("open pull requests");
  });

  it("keeps raw work leads separate from missions", () => {
    const lead = { id: "lead_1" } as WorkLead;
    const project = addWorkLeadToProject(baseProject(), lead, { now });

    expect(project.workLeadIds).toEqual(["lead_1"]);
    expect(project.missionIds).toEqual([]);
  });

  it("turns accepted proof into project credit and usage rights", () => {
    const projectWithMission = addMissionToProject(
      baseProject(),
      { id: "mission_1" } as MissionContract,
      { now }
    );
    const credited = recordAcceptedProof(projectWithMission, {
      packet: { id: "packet_1", status: "accepted" } as EvidencePacket,
      payout: { id: "payout_1" } as Payout,
      contributor: "sam",
      now
    });

    expect(credited.status).toBe("active");
    expect(credited.acceptedPacketIds).toEqual(["packet_1"]);
    expect(credited.creditLedger[0]).toMatchObject({
      contributor: "sam",
      payoutId: "payout_1",
      points: 12
    });
    expect(canUseProjectOutput(credited, "sam")).toBe(true);
  });

  it("rejects duplicate accepted packet credit", () => {
    const credited = recordAcceptedProof(baseProject(), {
      packet: { id: "packet_1", status: "accepted" } as EvidencePacket,
      contributor: "sam",
      now
    });

    expect(() =>
      recordAcceptedProof(credited, {
        packet: { id: "packet_1", status: "accepted" } as EvidencePacket,
        contributor: "sam",
        now
      })
    ).toThrow("already recorded");
  });
});

function baseProject() {
  return createProject({
    id: "project_docs",
    name: "Docs Onboarding Sprint",
    handle: "docs-onboarding",
    purpose: "Turn install friction into accepted proof packets.",
    founder: "alex",
    lanes: ["Docs validation"],
    now
  });
}
