import type { ActiveMission } from "./types";

export interface AcceptanceTypedDataInput {
  chainId: number;
  activeMission: ActiveMission;
  accepted: boolean;
  submitted: boolean;
  packetId: string;
  project: string;
  mission: string;
  storageRoot: string;
  payout: string;
  timestamp: string;
}

export function createAcceptanceTypedData(input: AcceptanceTypedDataInput) {
  return {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" }
      ],
      ProofAcceptance: [
        { name: "packetId", type: "string" },
        { name: "project", type: "string" },
        { name: "mission", type: "string" },
        { name: "activeMission", type: "string" },
        { name: "accepted", type: "bool" },
        { name: "submitted", type: "bool" },
        { name: "storageRoot", type: "string" },
        { name: "payout", type: "string" },
        { name: "timestamp", type: "string" }
      ]
    },
    primaryType: "ProofAcceptance",
    domain: {
      name: "ProofForge",
      version: "1",
      chainId: input.chainId
    },
    message: {
      packetId: input.packetId,
      project: input.project,
      mission: input.mission,
      activeMission: input.activeMission,
      accepted: input.accepted,
      submitted: input.submitted,
      storageRoot: input.storageRoot,
      payout: input.payout,
      timestamp: input.timestamp
    }
  } as const;
}

export function createAcceptanceFallbackMessage(
  input: AcceptanceTypedDataInput
) {
  return JSON.stringify({
    domain: "ProofForge",
    version: "1",
    action: "accept-proof",
    ...input
  });
}
