import { z } from "zod";
import type { EvidencePacket } from "@proofforge/evidence";
import type { MissionContract, WorkLead } from "@proofforge/mission";
import type { Payout } from "@proofforge/payments";

export const projectRoles = [
  "founder_steward",
  "contributor",
  "reviewer",
  "maintainer",
  "sponsor",
  "node_operator"
] as const;
export const projectPermissions = [
  "run_missions",
  "review_packets",
  "suggest_work",
  "attach_agents",
  "fund_missions",
  "release_payouts"
] as const;

export const projectMemberSchema = z.object({
  id: z.string().min(1),
  handle: z.string().min(1),
  role: z.enum(projectRoles),
  status: z.enum(["active", "pending", "removed"]),
  permissions: z.array(z.enum(projectPermissions)),
  joinedAt: z.string().datetime()
});

export const agentDelegationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum([
    "runner",
    "verifier",
    "skeptic",
    "packager",
    "docs_agent",
    "browser_qa"
  ]),
  status: z.enum(["active", "paused", "removed"]),
  allowedActions: z.array(z.string().min(1)).min(1),
  blockedActions: z.array(z.string().min(1)).min(1),
  attachedAt: z.string().datetime()
});

export const projectCreditEntrySchema = z.object({
  id: z.string().min(1),
  contributor: z.string().min(1),
  packetId: z.string().min(1),
  payoutId: z.string().min(1).optional(),
  points: z.number().int().positive(),
  reason: z.string().min(1),
  createdAt: z.string().datetime()
});

export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  handle: z.string().min(1),
  status: z.enum(["recruiting", "active", "paused", "archived"]),
  visibility: z.enum(["public", "community", "private"]),
  purpose: z.string().min(1),
  founder: z.string().min(1),
  rewardPool: z.number().nonnegative(),
  lanes: z.array(z.string().min(1)).min(1),
  members: z.array(projectMemberSchema),
  agents: z.array(agentDelegationSchema),
  workLeadIds: z.array(z.string().min(1)),
  missionIds: z.array(z.string().min(1)),
  acceptedPacketIds: z.array(z.string().min(1)),
  creditLedger: z.array(projectCreditEntrySchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectMember = z.infer<typeof projectMemberSchema>;
export type AgentDelegation = z.infer<typeof agentDelegationSchema>;
export type ProjectCreditEntry = z.infer<typeof projectCreditEntrySchema>;
export type ProjectPermission = (typeof projectPermissions)[number];

export function parseProject(input: unknown): Project {
  return projectSchema.parse(input);
}

export function createProject(input: {
  id: string;
  name: string;
  handle: string;
  purpose: string;
  founder: string;
  lanes: string[];
  rewardPool?: number;
  visibility?: Project["visibility"];
  now?: Date;
}): Project {
  const now = toIso(input.now);
  return parseProject({
    id: input.id,
    name: input.name,
    handle: input.handle,
    status: "recruiting",
    visibility: input.visibility ?? "community",
    purpose: input.purpose,
    founder: input.founder,
    rewardPool: input.rewardPool ?? 0,
    lanes: input.lanes,
    members: [
      {
        id: `member_${input.founder}`,
        handle: input.founder,
        role: "founder_steward",
        status: "active",
        permissions: [...projectPermissions],
        joinedAt: now
      }
    ],
    agents: [],
    workLeadIds: [],
    missionIds: [],
    acceptedPacketIds: [],
    creditLedger: [],
    createdAt: now,
    updatedAt: now
  });
}

export function inviteProjectMember(
  project: Project,
  input: {
    handle: string;
    role: ProjectMember["role"];
    permissions: ProjectMember["permissions"];
    now?: Date;
  }
): Project {
  if (
    project.members.some(
      (member) => member.handle === input.handle && member.status !== "removed"
    )
  ) {
    throw new Error("Project member already exists.");
  }

  return touch(project, input.now, {
    members: [
      ...project.members,
      {
        id: `member_${input.handle}`,
        handle: input.handle,
        role: input.role,
        status: "pending",
        permissions: input.permissions,
        joinedAt: toIso(input.now)
      }
    ]
  });
}

export function attachAgentDelegation(
  project: Project,
  input: {
    id: string;
    name: string;
    type: AgentDelegation["type"];
    allowedActions: string[];
    blockedActions: string[];
    now?: Date;
  }
): Project {
  if (
    input.allowedActions.some((action) => input.blockedActions.includes(action))
  ) {
    throw new Error("Agent action cannot be both allowed and blocked.");
  }

  return touch(project, input.now, {
    agents: [
      ...project.agents,
      {
        id: input.id,
        name: input.name,
        type: input.type,
        status: "active",
        allowedActions: input.allowedActions,
        blockedActions: input.blockedActions,
        attachedAt: toIso(input.now)
      }
    ]
  });
}

export function addWorkLeadToProject(
  project: Project,
  lead: WorkLead,
  input: { now?: Date } = {}
): Project {
  if (project.workLeadIds.includes(lead.id)) {
    throw new Error("Work Lead is already attached to project.");
  }

  return touch(project, input.now, {
    workLeadIds: [...project.workLeadIds, lead.id]
  });
}

export function addMissionToProject(
  project: Project,
  mission: MissionContract,
  input: { now?: Date } = {}
): Project {
  if (project.missionIds.includes(mission.id)) {
    throw new Error("Mission is already attached to project.");
  }

  return touch(project, input.now, {
    status: project.status === "recruiting" ? "active" : project.status,
    missionIds: [...project.missionIds, mission.id]
  });
}

export function recordAcceptedProof(
  project: Project,
  input: {
    packet: EvidencePacket;
    payout?: Payout;
    contributor: string;
    points?: number;
    now?: Date;
  }
): Project {
  if (input.packet.status !== "accepted") {
    throw new Error("Only accepted packets can be recorded as project credit.");
  }
  if (project.acceptedPacketIds.includes(input.packet.id)) {
    throw new Error("Accepted packet is already recorded.");
  }

  return touch(project, input.now, {
    acceptedPacketIds: [...project.acceptedPacketIds, input.packet.id],
    creditLedger: [
      ...project.creditLedger,
      {
        id: `credit_${input.packet.id}`,
        contributor: input.contributor,
        packetId: input.packet.id,
        payoutId: input.payout?.id,
        points: input.points ?? 12,
        reason: "Accepted proof packet",
        createdAt: toIso(input.now)
      }
    ]
  });
}

export function canUseProjectOutput(project: Project, handle: string): boolean {
  const member = project.members.find(
    (item) => item.handle === handle && item.status === "active"
  );
  const credited = project.creditLedger.some(
    (entry) => entry.contributor === handle
  );
  return Boolean(member || credited);
}

function touch(
  project: Project,
  now: Date | undefined,
  patch: Partial<Project>
): Project {
  return parseProject({
    ...project,
    ...patch,
    updatedAt: toIso(now)
  });
}

function toIso(date: Date | undefined): string {
  return (date ?? new Date()).toISOString();
}
