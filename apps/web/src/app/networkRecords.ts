import { generatedProofSummary } from "../demo";
import type { AppState } from "./types";

export type NetworkRecordKind =
  | "workspace_snapshot"
  | "review_request"
  | "public_proof";

export interface ProofForgeNetworkRecord {
  version: "proof-network-record/v1";
  kind: NetworkRecordKind;
  id: string;
  createdAt: string;
  appState: Omit<AppState, "screen">;
  packet: {
    id: string;
    mission: string;
    project: string;
    storage: string;
    verifier: string;
    acceptedBy: string;
  };
  authority: {
    github: "handoff";
    wallet: "local-signature";
    payout: "external-receipt";
    storage: "0g-ready";
  };
  receipts: {
    walletSignature?: string;
    payoutReceipt?: string;
    zeroGReceipt?: string;
  };
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

export async function createNetworkRecord(
  kind: NetworkRecordKind,
  state: AppState
): Promise<ProofForgeNetworkRecord> {
  const createdAt = new Date().toISOString();
  const appState = savedStateFromApp(state);
  const seed = JSON.stringify({ kind, createdAt, appState });

  return {
    version: "proof-network-record/v1",
    kind,
    id: `pfn_${await sha256Short(seed)}`,
    createdAt,
    appState,
    packet: {
      id: generatedProofSummary.publicPacketId,
      mission: generatedProofSummary.mission,
      project: generatedProofSummary.project,
      storage:
        generatedProofSummary.protocolRefs.storageUri ??
        generatedProofSummary.protocolRefs.storageProvider,
      verifier: generatedProofSummary.verifierStatus,
      acceptedBy: generatedProofSummary.acceptedBy
    },
    authority: {
      github: "handoff",
      wallet: "local-signature",
      payout: "external-receipt",
      storage: "0g-ready"
    },
    receipts: {
      walletSignature: state.acceptanceSignature || undefined,
      payoutReceipt: state.payoutReceiptRef || undefined,
      zeroGReceipt: state.zeroGReceiptUri || undefined
    },
    boundaries: [
      "ProofForge does not hold GitHub credentials by default.",
      "Reviewer links carry state without a server session.",
      "Payouts are recorded after external wallet/platform settlement.",
      "0G storage is export-ready unless an upload adapter is configured."
    ]
  };
}

export function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
