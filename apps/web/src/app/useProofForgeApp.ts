import React from "react";
import type { Screen } from "../routes";
import type {
  ActiveMission,
  AppActions,
  AppState,
  ImportedMission,
  PayoutReceipt,
  ProjectRequest,
  WalletIdentity
} from "./types";
import { screenFromHash } from "./helpers";
import { buildProofPacket } from "./missionDisplay";
import {
  activeMissions,
  defaultProjectRequest,
  downloadJson,
  persistKey,
  readSavedAppState,
  saveAppState,
  type SavedAppState
} from "./workspaceState";

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
  const [importedMission, setImportedMission] =
    React.useState<ImportedMission | null>(savedState.importedMission);
  const [payoutReceipt, setPayoutReceipt] =
    React.useState<PayoutReceipt | null>(savedState.payoutReceipt);
  const [walletIdentity, setWalletIdentity] =
    React.useState<WalletIdentity | null>(savedState.walletIdentity);

  const resetProof = React.useCallback(() => {
    setPacketReady(false);
    setSubmitted(false);
    setAccepted(false);
    setReleased(false);
    setRevisionRequested(false);
    setRejected(false);
  }, []);

  const applyImportedState = React.useCallback(
    (nextState: Partial<SavedAppState>) => {
      setPacketReady(Boolean(nextState.packetReady));
      setSubmitted(Boolean(nextState.submitted));
      setAccepted(Boolean(nextState.accepted));
      setReleased(Boolean(nextState.released));
      setRevisionRequested(Boolean(nextState.revisionRequested));
      setRejected(Boolean(nextState.rejected));
      setImportedLead(Boolean(nextState.importedLead));
      setProjectStarted(Boolean(nextState.projectStarted));
      setProjectInviteSent(Boolean(nextState.projectInviteSent));
      setProjectAgentAttached(Boolean(nextState.projectAgentAttached));
      setProjectWorkSuggested(Boolean(nextState.projectWorkSuggested));
      setWorkLeadClarified(Boolean(nextState.workLeadClarified));
      setWorkLeadConverted(Boolean(nextState.workLeadConverted));
      setAgentRegistered(Boolean(nextState.agentRegistered));
      if (activeMissions.includes(nextState.activeMission as ActiveMission)) {
        setActiveMission(nextState.activeMission as ActiveMission);
      }
      setProjectRequest({
        ...defaultProjectRequest,
        ...(nextState.projectRequest ?? {})
      });
      setImportedMission(nextState.importedMission ?? null);
      setPayoutReceipt(nextState.payoutReceipt ?? null);
      setWalletIdentity(nextState.walletIdentity ?? null);
    },
    []
  );

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
    exportWorkspace: () => {
      downloadJson("proofforge-workspace.json", readSavedAppState());
    },
    resetWorkspace: () => {
      window.localStorage.removeItem(persistKey);
      window.location.hash = "opportunity";
      window.location.reload();
    },
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
      resetProof();
      setActiveMission(mission);
      setScreen("mission-detail");
    },
    importGitHubMission: (mission) => {
      resetProof();
      setImportedMission(mission);
      setImportedLead(false);
      setWorkLeadClarified(false);
      setWorkLeadConverted(false);
      setActiveMission("github");
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
    },
    recordPayoutReceipt: (receipt) => {
      setPayoutReceipt(receipt);
      setReleased(true);
    },
    exportPacket: () => {
      downloadJson(
        "proofforge-proof-packet.json",
        buildProofPacket({
          activeMission,
          projectRequest,
          importedMission,
          payoutReceipt
        })
      );
    },
    importWorkspace: (nextState) => {
      applyImportedState(nextState);
      setScreen("opportunity");
    },
    connectWallet: async () => {
      const provider = window.ethereum;
      if (!provider) return;
      const accounts = (await provider.request({
        method: "eth_requestAccounts"
      })) as string[];
      const address = accounts[0];
      if (!address) return;
      setWalletIdentity((current) => ({
        address,
        ensName: current?.ensName ?? "proofrunner.proofforge.eth",
        connectedAt: new Date().toISOString()
      }));
    },
    saveEnsName: (ensName) => {
      setWalletIdentity((current) => ({
        address: current?.address ?? "Wallet not connected",
        ensName,
        connectedAt: current?.connectedAt ?? new Date().toISOString()
      }));
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
    projectRequest,
    importedMission,
    payoutReceipt,
    walletIdentity
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
      projectRequest,
      importedMission,
      payoutReceipt,
      walletIdentity
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
    projectRequest,
    importedMission,
    payoutReceipt,
    walletIdentity
  ]);

  return { state, actions };
}
