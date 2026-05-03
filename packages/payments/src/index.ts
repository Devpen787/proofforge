import { z } from "zod";
import type { EvidencePacket } from "@proofforge/evidence";
import type { MissionContract } from "@proofforge/mission";

export const payoutStatuses = [
  "escrowed",
  "earned",
  "released",
  "disputed",
  "cancelled"
] as const;

export const payoutSchema = z.object({
  id: z.string().min(1),
  packetId: z.string().min(1),
  missionId: z.string().min(1),
  projectId: z.string().min(1),
  recipient: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.string().min(1),
  type: z.enum(["cash", "credit", "reputation", "external", "none"]),
  method: z.enum(["manual", "external_platform", "credits", "reputation_only"]),
  status: z.enum(payoutStatuses),
  approvedBy: z.string().min(1),
  createdAt: z.string().datetime(),
  releasedAt: z.string().datetime().optional(),
  notes: z.array(z.string().min(1)).default([])
});

export type Payout = z.infer<typeof payoutSchema>;

export function parsePayout(input: unknown): Payout {
  return payoutSchema.parse(input);
}

export function createEarnedPayout(input: {
  packet: EvidencePacket;
  mission: MissionContract;
  projectId: string;
  recipient: string;
  approvedBy: string;
  now?: Date;
}): Payout {
  if (input.packet.status !== "accepted") {
    throw new Error("Only accepted packets can create earned payouts.");
  }

  const reward = input.mission.reward ?? {
    amount: 0,
    currency: "USD",
    type: "none" as const
  };
  return parsePayout({
    id: `payout_${input.packet.id}`,
    packetId: input.packet.id,
    missionId: input.mission.id,
    projectId: input.projectId,
    recipient: input.recipient,
    amount: reward.amount,
    currency: reward.currency,
    type: reward.type,
    method: methodForReward(reward.type),
    status: "earned",
    approvedBy: input.approvedBy,
    createdAt: (input.now ?? new Date()).toISOString(),
    notes: [
      "Earned means accepted proof created a payout record.",
      "Release is a separate manual accounting step in the MVP."
    ]
  });
}

export function releasePayout(
  payout: Payout,
  input: { now?: Date } = {}
): Payout {
  if (payout.status === "released") {
    throw new Error("Payout is already released.");
  }
  if (payout.status !== "earned") {
    throw new Error("Only earned payouts can be released.");
  }

  return parsePayout({
    ...payout,
    status: "released",
    releasedAt: (input.now ?? new Date()).toISOString()
  });
}

export function disputePayout(payout: Payout): Payout {
  if (payout.status === "released") {
    throw new Error("Released payouts cannot be disputed.");
  }

  return parsePayout({
    ...payout,
    status: "disputed"
  });
}

export function assertNoDuplicatePayout(
  payouts: Payout[],
  packetId: string
): void {
  if (payouts.some((payout) => payout.packetId === packetId)) {
    throw new Error("Packet already has a payout record.");
  }
}

function methodForReward(type: Payout["type"]): Payout["method"] {
  if (type === "external") return "external_platform";
  if (type === "credit") return "credits";
  if (type === "reputation" || type === "none") return "reputation_only";
  return "manual";
}
