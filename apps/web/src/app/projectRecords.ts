import {
  demoAgentIdentity,
  demoConvertedMission,
  demoMission,
  generatedProofSummary
} from "../demo";
import type { AppState } from "./types";

export interface ProofForgeProjectRecord {
  version: "proof-project-record/v1";
  id: string;
  createdAt: string;
  project: {
    id: string;
    name: string;
    source: string;
    steward: string;
  };
  state: Omit<AppState, "screen">;
  sources: Array<{
    type: "github_issue" | "marketplace_task" | "project_backlog";
    title: string;
    url: string;
    acceptanceOwner: string;
    status: "open" | "active" | "accepted" | "needs_triage";
  }>;
  missions: Array<{
    id: string;
    title: string;
    proofRequirement: string;
    valuePath: string;
    agent: string;
    status: "ready" | "running" | "submitted" | "accepted" | "released";
  }>;
  ledger: Array<{
    type:
      | "accepted_proof"
      | "payout_receipt"
      | "network_record"
      | "onchain_anchor"
      | "github_acceptance";
    label: string;
    ref: string;
  }>;
  boundaries: string[];
}

function savedStateFromApp(state: AppState): Omit<AppState, "screen"> {
  const { screen: _screen, ...savedState } = state;
  void _screen;
  return savedState;
}

async function sha256Short(value: string) {
  if (!globalThis.crypto?.subtle) {
    return `local-${value.length.toString(16)}`;
  }
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 24);
}

export async function createProjectRecord(
  state: AppState
): Promise<ProofForgeProjectRecord> {
  const createdAt = new Date().toISOString();
  const savedState = savedStateFromApp(state);
  const seed = JSON.stringify({ createdAt, savedState });
  const accepted = state.accepted || state.released;

  return {
    version: "proof-project-record/v1",
    id: `pfp_${await sha256Short(seed)}`,
    createdAt,
    project: {
      id: "docs-onboarding-sprint",
      name: generatedProofSummary.project,
      source: "https://github.com/Devpen787/proofforge/issues/1",
      steward: generatedProofSummary.acceptedBy
    },
    state: savedState,
    sources: [
      {
        type: "github_issue",
        title: demoMission.title,
        url: "https://github.com/Devpen787/proofforge/issues/1",
        acceptanceOwner: generatedProofSummary.acceptedBy,
        status: accepted ? "accepted" : state.submitted ? "active" : "open"
      },
      {
        type: "marketplace_task",
        title: demoConvertedMission.title,
        url: "https://market.example/tasks/checkout-qa",
        acceptanceOwner: "Marketplace buyer",
        status: state.workLeadConverted ? "active" : "needs_triage"
      }
    ],
    missions: [
      {
        id: "mission_docs_install",
        title: demoMission.title,
        proofRequirement: generatedProofSummary.whatWasProven,
        valuePath: generatedProofSummary.payout.amount,
        agent: demoAgentIdentity.id,
        status: state.released
          ? "released"
          : accepted
            ? "accepted"
            : state.submitted
              ? "submitted"
              : state.packetReady
                ? "running"
                : "ready"
      }
    ],
    ledger: [
      ...(accepted
        ? [
            {
              type: "accepted_proof" as const,
              label: generatedProofSummary.publicPacketId,
              ref:
                generatedProofSummary.protocolRefs.storageUri ??
                generatedProofSummary.publicPacketId
            }
          ]
        : []),
      ...(state.payoutReceiptRef
        ? [
            {
              type: "payout_receipt" as const,
              label: "Released payout receipt",
              ref: state.payoutReceiptRef
            }
          ]
        : []),
      ...(state.zeroGReceiptUri
        ? [
            {
              type: "network_record" as const,
              label: "0G network record",
              ref: state.zeroGReceiptUri
            }
          ]
        : []),
      ...(state.proofRegistryTxHash
        ? [
            {
              type: "onchain_anchor" as const,
              label: "Proof registry transaction",
              ref: state.proofRegistryTxHash
            }
          ]
        : []),
      ...(state.githubAcceptanceUrl
        ? [
            {
              type: "github_acceptance" as const,
              label: "Maintainer GitHub acceptance",
              ref: state.githubAcceptanceUrl
            }
          ]
        : [])
    ],
    boundaries: [
      "GitHub remains the repo permission system.",
      "ProofForge project sync stores metadata and proof references, not repo write authority.",
      "Accepted proof creates credit; payout release remains external unless a receipt is attached.",
      "0G stores immutable proof records; mutable collaboration can move to Ceramic, GUN, or OrbitDB.",
      "Onchain registry entries anchor accepted proof hashes without replacing human maintainer review."
    ]
  };
}
