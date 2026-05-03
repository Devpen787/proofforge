import type {
  ActiveMission,
  ImportedMission,
  ProofEvent,
  ProofEventType,
  ProjectRequest,
  WalletIdentity
} from "./types";
import { getMissionDisplay } from "./missionDisplay";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
    .join(",")}}`;
}

function hashText(text: string): string {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createProofEvent(input: {
  type: ProofEventType;
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  walletIdentity: WalletIdentity | null;
  payload?: Record<string, unknown>;
  previous?: ProofEvent;
}): ProofEvent {
  const mission = getMissionDisplay(input);
  const createdAt = new Date().toISOString();
  const actor =
    input.walletIdentity?.address ||
    input.walletIdentity?.ensName ||
    "local-proof-node";
  const unsigned = {
    type: input.type,
    createdAt,
    actor,
    sourceUrl: mission.sourceUrl,
    packetId: mission.packetId,
    previousHash: input.previous?.eventHash,
    payload: {
      mission: mission.title,
      repo: mission.repo,
      acceptanceAuthority: mission.owner,
      value: mission.reward,
      ...input.payload
    }
  };
  const eventHash = hashText(stableStringify(unsigned));

  return {
    id: `${input.type}_${createdAt}`,
    ...unsigned,
    eventHash
  };
}

export function buildProofRecord(input: {
  events: ProofEvent[];
  packet: unknown;
  walletIdentity: WalletIdentity | null;
}) {
  return {
    recordType: "proofforge.v1.proof-record",
    exportedAt: new Date().toISOString(),
    walletIdentity: input.walletIdentity,
    eventCount: input.events.length,
    latestEventHash: input.events.at(-1)?.eventHash ?? null,
    events: input.events,
    packet: input.packet,
    storage: {
      provider: "0G Storage",
      status: "upload-ready from browser export"
    }
  };
}

export function signableEventMessage(event: ProofEvent) {
  return [
    "ProofForge V1 Event",
    `Type: ${event.type}`,
    `Event: ${event.eventHash}`,
    `Packet: ${event.packetId ?? "none"}`,
    `Source: ${event.sourceUrl ?? "none"}`,
    `Created: ${event.createdAt}`
  ].join("\n");
}
