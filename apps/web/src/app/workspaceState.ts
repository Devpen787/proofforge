import type { ActiveMission, AppState, ProjectRequest } from "./types";

export type SavedAppState = Omit<AppState, "screen">;

export const persistKey = "proofforge.v1.demo-state";

export const defaultProjectRequest: ProjectRequest = {
  projectName: "Docs Onboarding Sprint",
  projectPurpose: "Turn install friction into accepted proof packets.",
  title: "Quickstart proof request",
  detail: "Run the quickstart in a clean environment and package evidence.",
  reward: "$10",
  acceptanceOwner: "Docs steward",
  inviteEmail: "sam@builder.dev"
};

export const activeMissions: ActiveMission[] = [
  "docs",
  "windows",
  "mac",
  "config",
  "links",
  "checkout",
  "github",
  "request"
];

export const defaultSavedState: SavedAppState = {
  packetReady: false,
  submitted: false,
  accepted: false,
  released: false,
  revisionRequested: false,
  rejected: false,
  importedLead: false,
  projectStarted: false,
  projectInviteSent: false,
  projectAgentAttached: false,
  projectWorkSuggested: false,
  workLeadClarified: false,
  workLeadConverted: false,
  activeMission: "docs",
  agentRegistered: false,
  projectRequest: defaultProjectRequest,
  importedMission: null,
  payoutReceipt: null,
  walletIdentity: null,
  proofEvents: []
};

export function normalizeSavedState(
  parsed: Partial<SavedAppState>
): SavedAppState {
  return {
    ...defaultSavedState,
    ...parsed,
    activeMission: activeMissions.includes(
      parsed.activeMission as ActiveMission
    )
      ? (parsed.activeMission as ActiveMission)
      : defaultSavedState.activeMission,
    projectRequest: {
      ...defaultProjectRequest,
      ...(parsed.projectRequest ?? {})
    },
    importedMission: parsed.importedMission ?? null,
    payoutReceipt: parsed.payoutReceipt ?? null,
    walletIdentity: parsed.walletIdentity ?? null,
    proofEvents: parsed.proofEvents ?? []
  };
}

export function readSavedAppState(): SavedAppState {
  if (typeof window === "undefined") return defaultSavedState;
  try {
    const raw = window.localStorage.getItem(persistKey);
    if (!raw) return defaultSavedState;
    return normalizeSavedState(JSON.parse(raw) as Partial<SavedAppState>);
  } catch {
    return defaultSavedState;
  }
}

export function saveAppState(state: SavedAppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(persistKey, JSON.stringify(state));
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
