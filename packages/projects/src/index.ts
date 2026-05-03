import { z } from "zod";
import type { EvidencePacket } from "@proofforge/evidence";
import type { MissionContract, WorkLead } from "@proofforge/mission";
import type { Payout } from "@proofforge/payments";
import type {
  GitHubContributionHistoryImport,
  GitHubObservedContribution
} from "@proofforge/sources";

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

export const contributionSources = [
  "github",
  "wallet",
  "proof_pack",
  "project_backlog",
  "marketplace",
  "manual"
] as const;

export const observedContributionKinds = [
  "issue",
  "pull_request",
  "commit",
  "review",
  "proof_pack",
  "agent_run",
  "external_task"
] as const;

export const observedContributionStatuses = [
  "observed",
  "needs_proof",
  "linked_to_proof",
  "accepted",
  "rejected"
] as const;

export const valueSignalTypes = [
  "wallet_identity",
  "onchain_receipt",
  "external_payout",
  "grant_reference",
  "bounty_reference",
  "credential_reference"
] as const;

export const valueSignalStatuses = [
  "observed_reference",
  "linked_to_accepted_proof",
  "verified_reference"
] as const;

export const connectedAccountProviders = [
  "github",
  "wallet",
  "marketplace"
] as const;

export const connectedAccountStatuses = [
  "local_reference",
  "oauth_configured",
  "webhook_configured",
  "verified_reference"
] as const;

export const marketplaceSyncStatuses = [
  "manual_snapshot",
  "adapter_ready",
  "sync_blocked"
] as const;

export const credentialStatuses = [
  "draft",
  "issuable_after_acceptance",
  "issued_reference"
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

export const contributorIdentitySchema = z.object({
  id: z.string().min(1),
  handle: z.string().min(1),
  displayName: z.string().min(1),
  githubLogin: z.string().min(1).optional(),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  agentIds: z.array(z.string().min(1)).default([]),
  createdAt: z.string().datetime()
});

export const observedContributionSchema = z.object({
  id: z.string().min(1),
  contributorId: z.string().min(1),
  projectId: z.string().min(1),
  source: z.enum(contributionSources),
  kind: z.enum(observedContributionKinds),
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  repo: z.string().min(1).optional(),
  status: z.enum(observedContributionStatuses),
  observedAt: z.string().datetime(),
  acceptedPacketId: z.string().min(1).optional(),
  notes: z.array(z.string().min(1)).default([])
});

export const acceptedProofRecordSchema = z.object({
  packetId: z.string().min(1),
  projectId: z.string().min(1),
  contributorId: z.string().min(1),
  missionId: z.string().min(1),
  acceptedBy: z.string().min(1),
  acceptedAt: z.string().datetime(),
  payoutId: z.string().min(1).optional(),
  publicProofId: z.string().min(1).optional(),
  points: z.number().int().nonnegative()
});

export const valueSignalSchema = z.object({
  id: z.string().min(1),
  contributorId: z.string().min(1),
  projectId: z.string().min(1).optional(),
  type: z.enum(valueSignalTypes),
  status: z.enum(valueSignalStatuses),
  sourceUrl: z.string().url().optional(),
  chainId: z.number().int().positive().optional(),
  txHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/)
    .optional(),
  amount: z.number().nonnegative().optional(),
  currency: z.string().min(1).optional(),
  linkedPacketId: z.string().min(1).optional(),
  observedAt: z.string().datetime()
});

export const agentRunRecordSchema = z.object({
  id: z.string().min(1),
  agentId: z.string().min(1),
  ownerId: z.string().min(1),
  projectId: z.string().min(1),
  missionId: z.string().min(1),
  packetId: z.string().min(1).optional(),
  status: z.enum(["ran", "verified", "accepted", "revision", "rejected"]),
  specialty: z.string().min(1),
  completedAt: z.string().datetime()
});

export const connectedAccountSchema = z.object({
  id: z.string().min(1),
  contributorId: z.string().min(1),
  provider: z.enum(connectedAccountProviders),
  status: z.enum(connectedAccountStatuses),
  handle: z.string().min(1).optional(),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  sourceUrl: z.string().url().optional(),
  webhookUrl: z.string().url().optional(),
  connectedAt: z.string().datetime(),
  notes: z.array(z.string().min(1)).default([])
});

export const marketplaceSyncRecordSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  source: z.enum(["ethglobal", "github", "dework", "onlydust", "manual"]),
  status: z.enum(marketplaceSyncStatuses),
  sourceUrl: z.string().url(),
  importedLeadIds: z.array(z.string().min(1)).default([]),
  blockedClaims: z.array(z.string().min(1)).default([]),
  syncedAt: z.string().datetime()
});

export const proofCredentialReferenceSchema = z.object({
  id: z.string().min(1),
  contributorId: z.string().min(1),
  projectId: z.string().min(1),
  packetId: z.string().min(1),
  type: z.enum(["builder_passport_badge", "proof_pack_credential"]),
  status: z.enum(credentialStatuses),
  issuer: z.string().min(1),
  credentialUrl: z.string().url().optional(),
  issuedAt: z.string().datetime()
});

export const contributionGraphSchema = z.object({
  id: z.string().min(1),
  identities: z.array(contributorIdentitySchema),
  projects: z.array(z.lazy(() => projectSchema)),
  observedContributions: z.array(observedContributionSchema),
  acceptedProofs: z.array(acceptedProofRecordSchema),
  valueSignals: z.array(valueSignalSchema),
  agentRuns: z.array(agentRunRecordSchema),
  connectedAccounts: z.array(connectedAccountSchema).default([]),
  marketplaceSyncs: z.array(marketplaceSyncRecordSchema).default([]),
  credentialReferences: z.array(proofCredentialReferenceSchema).default([]),
  updatedAt: z.string().datetime()
});

export const builderPassportSchema = z.object({
  contributorId: z.string().min(1),
  handle: z.string().min(1),
  displayName: z.string().min(1),
  observedCount: z.number().int().nonnegative(),
  acceptedProofCount: z.number().int().nonnegative(),
  linkedValueSignalCount: z.number().int().nonnegative(),
  agentRunCount: z.number().int().nonnegative(),
  projectIds: z.array(z.string().min(1)),
  specialties: z.array(z.string().min(1)),
  proofPoints: z.number().int().nonnegative()
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
export type ContributorIdentity = z.infer<typeof contributorIdentitySchema>;
export type ObservedContribution = z.infer<typeof observedContributionSchema>;
export type AcceptedProofRecord = z.infer<typeof acceptedProofRecordSchema>;
export type ValueSignal = z.infer<typeof valueSignalSchema>;
export type AgentRunRecord = z.infer<typeof agentRunRecordSchema>;
export type ConnectedAccount = z.infer<typeof connectedAccountSchema>;
export type MarketplaceSyncRecord = z.infer<typeof marketplaceSyncRecordSchema>;
export type ProofCredentialReference = z.infer<
  typeof proofCredentialReferenceSchema
>;
export type ContributionGraph = z.infer<typeof contributionGraphSchema>;
export type BuilderPassport = z.infer<typeof builderPassportSchema>;

export function parseProject(input: unknown): Project {
  return projectSchema.parse(input);
}

export function parseContributionGraph(input: unknown): ContributionGraph {
  return contributionGraphSchema.parse(input);
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

export function createContributionGraph(input: {
  id: string;
  identities?: ContributorIdentity[];
  projects?: Project[];
  now?: Date;
}): ContributionGraph {
  return parseContributionGraph({
    id: input.id,
    identities: input.identities ?? [],
    projects: input.projects ?? [],
    observedContributions: [],
    acceptedProofs: [],
    valueSignals: [],
    agentRuns: [],
    connectedAccounts: [],
    marketplaceSyncs: [],
    credentialReferences: [],
    updatedAt: toIso(input.now)
  });
}

export function addContributorIdentity(
  graph: ContributionGraph,
  identity: ContributorIdentity
): ContributionGraph {
  if (graph.identities.some((item) => item.id === identity.id)) {
    throw new Error("Contributor identity already exists.");
  }

  return touchGraph(graph, {
    identities: [...graph.identities, identity]
  });
}

export function addObservedContribution(
  graph: ContributionGraph,
  contribution: ObservedContribution
): ContributionGraph {
  assertKnownContributor(graph, contribution.contributorId);
  assertKnownProject(graph, contribution.projectId);
  if (graph.observedContributions.some((item) => item.id === contribution.id)) {
    throw new Error("Observed contribution already exists.");
  }

  return touchGraph(graph, {
    observedContributions: [...graph.observedContributions, contribution]
  });
}

export function recordAcceptedProofInGraph(
  graph: ContributionGraph,
  proof: AcceptedProofRecord
): ContributionGraph {
  assertKnownContributor(graph, proof.contributorId);
  assertKnownProject(graph, proof.projectId);
  if (graph.acceptedProofs.some((item) => item.packetId === proof.packetId)) {
    throw new Error("Accepted proof is already recorded in graph.");
  }

  return touchGraph(graph, {
    acceptedProofs: [...graph.acceptedProofs, proof],
    observedContributions: graph.observedContributions.map((item) =>
      item.acceptedPacketId === proof.packetId
        ? { ...item, status: "accepted" }
        : item
    )
  });
}

export function linkObservedContributionToProof(
  graph: ContributionGraph,
  input: {
    contributionId: string;
    packetId: string;
  }
): ContributionGraph {
  const contribution = graph.observedContributions.find(
    (item) => item.id === input.contributionId
  );
  if (!contribution) throw new Error("Observed contribution not found.");

  return touchGraph(graph, {
    observedContributions: graph.observedContributions.map((item) =>
      item.id === input.contributionId
        ? {
            ...item,
            status: "linked_to_proof",
            acceptedPacketId: input.packetId
          }
        : item
    )
  });
}

export function addValueSignal(
  graph: ContributionGraph,
  signal: ValueSignal
): ContributionGraph {
  assertKnownContributor(graph, signal.contributorId);
  if (signal.projectId) assertKnownProject(graph, signal.projectId);
  if (signal.linkedPacketId) {
    const acceptedProof = graph.acceptedProofs.find(
      (proof) => proof.packetId === signal.linkedPacketId
    );
    if (!acceptedProof) {
      throw new Error("Value signal can only link to accepted proof.");
    }
  }

  return touchGraph(graph, {
    valueSignals: [...graph.valueSignals, signal]
  });
}

export function addAgentRunRecord(
  graph: ContributionGraph,
  run: AgentRunRecord
): ContributionGraph {
  assertKnownContributor(graph, run.ownerId);
  assertKnownProject(graph, run.projectId);

  return touchGraph(graph, {
    agentRuns: [...graph.agentRuns, run]
  });
}

export function connectAccountReference(
  graph: ContributionGraph,
  account: ConnectedAccount
): ContributionGraph {
  assertKnownContributor(graph, account.contributorId);
  if (
    graph.connectedAccounts.some(
      (item) => item.id === account.id || sameConnectedAccount(item, account)
    )
  ) {
    throw new Error("Connected account reference already exists.");
  }

  return touchGraph(graph, {
    connectedAccounts: [...graph.connectedAccounts, account]
  });
}

export function importOnchainReceiptReference(
  graph: ContributionGraph,
  input: {
    id: string;
    contributorId: string;
    projectId: string;
    chainId: number;
    txHash: string;
    amount?: number;
    currency?: string;
    linkedPacketId?: string;
    sourceUrl?: string;
    now?: Date;
  }
): ContributionGraph {
  return addValueSignal(
    graph,
    valueSignalSchema.parse({
      id: input.id,
      contributorId: input.contributorId,
      projectId: input.projectId,
      type: "onchain_receipt",
      status: input.linkedPacketId
        ? "linked_to_accepted_proof"
        : "observed_reference",
      sourceUrl: input.sourceUrl,
      chainId: input.chainId,
      txHash: input.txHash,
      amount: input.amount,
      currency: input.currency,
      linkedPacketId: input.linkedPacketId,
      observedAt: toIso(input.now)
    })
  );
}

export function addMarketplaceSyncRecord(
  graph: ContributionGraph,
  record: MarketplaceSyncRecord
): ContributionGraph {
  assertKnownProject(graph, record.projectId);
  if (graph.marketplaceSyncs.some((item) => item.id === record.id)) {
    throw new Error("Marketplace sync record already exists.");
  }

  return touchGraph(graph, {
    marketplaceSyncs: [...graph.marketplaceSyncs, record]
  });
}

export function issueProofCredentialReference(
  graph: ContributionGraph,
  credential: ProofCredentialReference
): ContributionGraph {
  assertKnownContributor(graph, credential.contributorId);
  assertKnownProject(graph, credential.projectId);
  const acceptedProof = graph.acceptedProofs.find(
    (proof) =>
      proof.packetId === credential.packetId &&
      proof.contributorId === credential.contributorId &&
      proof.projectId === credential.projectId
  );
  if (!acceptedProof) {
    throw new Error("Credential references require accepted proof.");
  }
  if (
    graph.credentialReferences.some((item) => item.id === credential.id) ||
    graph.credentialReferences.some(
      (item) =>
        item.packetId === credential.packetId && item.type === credential.type
    )
  ) {
    throw new Error("Credential reference already exists.");
  }

  return touchGraph(graph, {
    credentialReferences: [...graph.credentialReferences, credential],
    valueSignals: [
      ...graph.valueSignals,
      valueSignalSchema.parse({
        id: `value_${credential.id}`,
        contributorId: credential.contributorId,
        projectId: credential.projectId,
        type: "credential_reference",
        status:
          credential.status === "issued_reference"
            ? "linked_to_accepted_proof"
            : "observed_reference",
        sourceUrl: credential.credentialUrl,
        linkedPacketId: credential.packetId,
        observedAt: credential.issuedAt
      })
    ]
  });
}

export function addGitHubHistoryToContributionGraph(
  graph: ContributionGraph,
  input: {
    contributorId: string;
    history: GitHubContributionHistoryImport;
    projectByRepo: Record<string, string>;
  }
): ContributionGraph {
  assertKnownContributor(graph, input.contributorId);

  let nextGraph = graph;
  for (const item of input.history.observed) {
    const projectId = input.projectByRepo[item.repo];
    if (!projectId) continue;
    assertKnownProject(graph, projectId);
    if (
      nextGraph.observedContributions.some(
        (contribution) => contribution.sourceUrl === item.sourceUrl
      )
    ) {
      continue;
    }

    nextGraph = addObservedContribution(
      nextGraph,
      githubObservedContributionToGraphRecord(item, {
        contributorId: input.contributorId,
        projectId
      })
    );
  }

  return nextGraph;
}

export function buildBuilderPassport(
  graph: ContributionGraph,
  contributorId: string
): BuilderPassport {
  const identity = graph.identities.find((item) => item.id === contributorId);
  if (!identity) throw new Error("Contributor identity not found.");

  const observed = graph.observedContributions.filter(
    (item) => item.contributorId === contributorId
  );
  const accepted = graph.acceptedProofs.filter(
    (item) => item.contributorId === contributorId
  );
  const linkedValueSignals = graph.valueSignals.filter(
    (item) =>
      item.contributorId === contributorId &&
      item.status !== "observed_reference"
  );
  const agentRuns = graph.agentRuns.filter(
    (item) => item.ownerId === contributorId
  );
  const projectIds = unique([
    ...observed.map((item) => item.projectId),
    ...accepted.map((item) => item.projectId),
    ...agentRuns.map((item) => item.projectId)
  ]);
  const specialties = unique(agentRuns.map((item) => item.specialty));

  return builderPassportSchema.parse({
    contributorId,
    handle: identity.handle,
    displayName: identity.displayName,
    observedCount: observed.length,
    acceptedProofCount: accepted.length,
    linkedValueSignalCount: linkedValueSignals.length,
    agentRunCount: agentRuns.length,
    projectIds,
    specialties,
    proofPoints: accepted.reduce((sum, proof) => sum + proof.points, 0)
  });
}

export function recommendContributionProjectIds(
  graph: ContributionGraph,
  contributorId: string
): string[] {
  const passport = buildBuilderPassport(graph, contributorId);
  const acceptedProjectIds = new Set(
    graph.acceptedProofs
      .filter((proof) => proof.contributorId === contributorId)
      .map((proof) => proof.projectId)
  );
  const observedNeedsProof = graph.observedContributions
    .filter(
      (item) =>
        item.contributorId === contributorId &&
        ["observed", "needs_proof", "linked_to_proof"].includes(item.status)
    )
    .map((item) => item.projectId);

  return unique([
    ...observedNeedsProof,
    ...passport.projectIds.filter(
      (projectId) => !acceptedProjectIds.has(projectId)
    ),
    ...passport.projectIds
  ]);
}

function githubObservedContributionToGraphRecord(
  contribution: GitHubObservedContribution,
  input: {
    contributorId: string;
    projectId: string;
  }
): ObservedContribution {
  return observedContributionSchema.parse({
    id: contribution.id,
    contributorId: input.contributorId,
    projectId: input.projectId,
    source: "github",
    kind:
      contribution.kind === "pull_request" ? "pull_request" : contribution.kind,
    title: contribution.title,
    sourceUrl: contribution.sourceUrl,
    repo: contribution.repo,
    status:
      contribution.acceptanceSignal === "open" ? "needs_proof" : "observed",
    observedAt: contribution.authoredAt,
    notes: [
      ...contribution.notes,
      `GitHub signal: ${contribution.acceptanceSignal}.`
    ]
  });
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

function touchGraph(
  graph: ContributionGraph,
  patch: Partial<ContributionGraph>
): ContributionGraph {
  return parseContributionGraph({
    ...graph,
    ...patch,
    updatedAt: new Date().toISOString()
  });
}

function assertKnownContributor(
  graph: ContributionGraph,
  contributorId: string
): void {
  if (!graph.identities.some((identity) => identity.id === contributorId)) {
    throw new Error("Unknown contributor identity.");
  }
}

function assertKnownProject(graph: ContributionGraph, projectId: string): void {
  if (!graph.projects.some((project) => project.id === projectId)) {
    throw new Error("Unknown project.");
  }
}

function sameConnectedAccount(
  left: ConnectedAccount,
  right: ConnectedAccount
): boolean {
  if (left.contributorId !== right.contributorId) return false;
  if (left.provider !== right.provider) return false;
  if (left.handle && right.handle && left.handle === right.handle) return true;
  if (
    left.walletAddress &&
    right.walletAddress &&
    left.walletAddress.toLowerCase() === right.walletAddress.toLowerCase()
  ) {
    return true;
  }
  return false;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
