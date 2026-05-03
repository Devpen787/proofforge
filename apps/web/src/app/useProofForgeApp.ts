import React from "react";
import type { Screen } from "../routes";
import type {
  ActiveMission,
  AppActions,
  AppState,
  ProjectRequest
} from "./types";
import { screenFromHash } from "./helpers";

type SavedAppState = Omit<AppState, "screen">;

const PERSIST_KEY = "proofforge.v1.demo-state";

const defaultProjectRequest: ProjectRequest = {
  projectName: "Docs Onboarding Sprint",
  projectPurpose: "Turn install friction into accepted proof packets.",
  title: "Quickstart proof request",
  detail: "Run the quickstart in a clean environment and package evidence.",
  reward: "$10",
  acceptanceOwner: "Docs steward",
  inviteEmail: "sam@builder.dev"
};

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
  agentRegistered: false,
  projectRequest: defaultProjectRequest
};

const activeMissions: ActiveMission[] = [
  "docs",
  "windows",
  "mac",
  "config",
  "links",
  "checkout",
  "request"
];

function readSavedAppState(): SavedAppState {
  if (typeof window === "undefined") return defaultSavedState;
  try {
    const raw = window.localStorage.getItem(PERSIST_KEY);
    if (!raw) return defaultSavedState;
    const parsed = JSON.parse(raw) as Partial<SavedAppState>;
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
      }
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
  const [projectRequest, setProjectRequest] = React.useState<ProjectRequest>(
    savedState.projectRequest
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
      setScreen(agentRegistered ? "first-run" : "agent-setup");
    },
    openPublicProof: () => setScreen("public-proof"),
    openOpportunities: () => setScreen("work-queue"),
    openCaseFile: () => setScreen("case-file"),
    releasePayout: () => setReleased(true),
    resolveRevision: () => setScreen("case-file"),
    runStarterMission: () => {
      if (!agentRegistered) {
        setScreen("agent-setup");
        return;
      }
      setActiveMission("docs");
      setScreen("mission-detail");
    },
    runMission: (mission) => {
      if (!agentRegistered) {
        setScreen("agent-setup");
        return;
      }
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
    saveProjectProfile: (profile) => {
      setProjectRequest((current) => ({ ...current, ...profile }));
      setProjectStarted(true);
    },
    inviteContributor: (email) => {
      if (email) {
        setProjectRequest((current) => ({
          ...current,
          inviteEmail: email
        }));
      }
      setProjectInviteSent(true);
    },
    attachAgent: () => {
      setProjectAgentAttached(true);
      setAgentRegistered(true);
    },
    suggestWork: (request) => {
      if (request) {
        setProjectRequest((current) => ({ ...current, ...request }));
      }
      setProjectWorkSuggested(true);
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
    agentRegistered,
    projectRequest
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
      agentRegistered,
      projectRequest
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
    agentRegistered,
    projectRequest
  ]);

  return { state, actions };
}
