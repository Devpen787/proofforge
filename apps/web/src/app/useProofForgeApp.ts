import React from "react";
import type { Screen } from "../routes";
import type { ActiveMission, AppActions, AppState } from "./types";
import { screenFromHash } from "./helpers";

type SavedAppState = Omit<AppState, "screen">;

const PERSIST_KEY = "proofforge.v1.demo-state";

const defaultSavedState: SavedAppState = {
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
  agentRegistered: false
};

function readSavedAppState(): SavedAppState {
  if (typeof window === "undefined") return defaultSavedState;
  try {
    const raw = window.localStorage.getItem(PERSIST_KEY);
    if (!raw) return defaultSavedState;
    const parsed = JSON.parse(raw) as Partial<SavedAppState>;
    return {
      ...defaultSavedState,
      ...parsed,
      activeMission:
        parsed.activeMission === "checkout" || parsed.activeMission === "docs"
          ? parsed.activeMission
          : defaultSavedState.activeMission
    };
  } catch {
    return defaultSavedState;
  }
}

function saveAppState(state: SavedAppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
}

function useHashScreen() {
  const [screen, setScreenState] = React.useState<Screen>(screenFromHash);

  const setScreen = React.useCallback((nextScreen: Screen) => {
    window.location.hash = nextScreen;
    setScreenState(nextScreen);
  }, []);

  React.useEffect(() => {
    const onHashChange = () => setScreenState(screenFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return { screen, setScreen };
}

export function useProofForgeApp(): { state: AppState; actions: AppActions } {
  const { screen, setScreen } = useHashScreen();
  const savedState = React.useMemo(() => readSavedAppState(), []);
  const [packetReady, setPacketReady] = React.useState(savedState.packetReady);
  const [submitted, setSubmitted] = React.useState(savedState.submitted);
  const [accepted, setAccepted] = React.useState(savedState.accepted);
  const [released, setReleased] = React.useState(savedState.released);
  const [revisionRequested, setRevisionRequested] = React.useState(
    savedState.revisionRequested
  );
  const [rejected, setRejected] = React.useState(savedState.rejected);
  const [importedLead, setImportedLead] = React.useState(
    savedState.importedLead
  );
  const [projectStarted, setProjectStarted] = React.useState(
    savedState.projectStarted
  );
  const [projectInviteSent, setProjectInviteSent] = React.useState(
    savedState.projectInviteSent
  );
  const [projectAgentAttached, setProjectAgentAttached] = React.useState(
    savedState.projectAgentAttached
  );
  const [projectWorkSuggested, setProjectWorkSuggested] = React.useState(
    savedState.projectWorkSuggested
  );
  const [workLeadClarified, setWorkLeadClarified] = React.useState(
    savedState.workLeadClarified
  );
  const [workLeadConverted, setWorkLeadConverted] = React.useState(
    savedState.workLeadConverted
  );
  const [agentRegistered, setAgentRegistered] = React.useState(
    savedState.agentRegistered
  );
  const [activeMission, setActiveMission] = React.useState<ActiveMission>(
    savedState.activeMission
  );

  const resetProof = React.useCallback(() => {
    setPacketReady(false);
    setSubmitted(false);
    setAccepted(false);
    setReleased(false);
    setRevisionRequested(false);
    setRejected(false);
  }, []);

  const actions: AppActions = {
    setScreen,
    registerAgent: () => setAgentRegistered(true),
    startProofJourney: () => {
      resetProof();
      setScreen("first-run");
    },
    openPublicProof: () => setScreen("public-proof"),
    openOpportunities: () => setScreen("work-queue"),
    openCaseFile: () => setScreen("case-file"),
    releasePayout: () => setReleased(true),
    resolveRevision: () => setScreen("case-file"),
    runStarterMission: () => {
      setActiveMission("docs");
      setScreen("mission-detail");
    },
    runMission: (mission) => {
      setActiveMission(mission);
      setScreen("mission-detail");
    },
    cancelRun: () => setScreen("mission-detail"),
    approvePacket: () => {
      setPacketReady(true);
      setScreen("case-file");
    },
    submitPacket: () => {
      setSubmitted(true);
      setRevisionRequested(false);
      setRejected(false);
      setScreen("maintainer");
    },
    acceptPacket: () => {
      setSubmitted(true);
      setRevisionRequested(false);
      setRejected(false);
      setAccepted(true);
      setReleased(false);
      setScreen("opportunity");
    },
    requestRevision: () => {
      setSubmitted(false);
      setRevisionRequested(true);
      setRejected(false);
      setScreen("case-file");
    },
    rejectPacket: () => {
      setSubmitted(false);
      setAccepted(false);
      setReleased(false);
      setRevisionRequested(false);
      setRejected(true);
      setScreen("opportunity");
    },
    importExternalTask: () => setImportedLead(true),
    viewOpportunityInventory: () => {
      setImportedLead(false);
      setWorkLeadClarified(false);
      setWorkLeadConverted(false);
    },
    clarifyLead: () => setWorkLeadClarified(true),
    convertLead: () => setWorkLeadConverted(true),
    rejectLead: () => {
      setImportedLead(false);
      setWorkLeadClarified(false);
      setWorkLeadConverted(false);
    },
    startProject: () => setProjectStarted(true),
    inviteContributor: () => setProjectInviteSent(true),
    attachAgent: () => setProjectAgentAttached(true),
    suggestWork: () => {
      setProjectWorkSuggested(true);
      setScreen("work-queue");
    }
  };

  const state: AppState = {
    screen,
    packetReady,
    submitted,
    accepted,
    released,
    revisionRequested,
    rejected,
    importedLead,
    projectStarted,
    projectInviteSent,
    projectAgentAttached,
    projectWorkSuggested,
    workLeadClarified,
    workLeadConverted,
    activeMission,
    agentRegistered
  };

  React.useEffect(() => {
    saveAppState({
      packetReady,
      submitted,
      accepted,
      released,
      revisionRequested,
      rejected,
      importedLead,
      projectStarted,
      projectInviteSent,
      projectAgentAttached,
      projectWorkSuggested,
      workLeadClarified,
      workLeadConverted,
      activeMission,
      agentRegistered
    });
  }, [
    packetReady,
    submitted,
    accepted,
    released,
    revisionRequested,
    rejected,
    importedLead,
    projectStarted,
    projectInviteSent,
    projectAgentAttached,
    projectWorkSuggested,
    workLeadClarified,
    workLeadConverted,
    activeMission,
    agentRegistered
  ]);

  return { state, actions };
}
