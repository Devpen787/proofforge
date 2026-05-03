import React from "react";
import type {
  ActiveMission,
  AppActions,
  AppState,
  ImportedMission,
  PayoutReceipt,
  ProofEvent,
  ProjectRequest,
  WalletIdentity
} from "./types";
import { buildProofPacket } from "./missionDisplay";
import {
  buildProofRecord,
  createProofEvent,
  signableEventMessage
} from "./proofEvents";
import {
  activeMissions,
  defaultProjectRequest,
  downloadJson,
  persistKey,
  readSavedAppState,
  saveAppState,
  type SavedAppState
} from "./workspaceState";
import { useHashScreen } from "./useHashScreen";
import { readSharedStateFromHash } from "./shareRecords";

export function useProofForgeApp(): { state: AppState; actions: AppActions } {
  const { screen, setScreen } = useHashScreen();
  const savedState = React.useMemo(
    () => ({
      ...readSavedAppState(),
      ...(readSharedStateFromHash() ?? {})
    }),
    []
  );
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
  const [proofEvents, setProofEvents] = React.useState<ProofEvent[]>(
    savedState.proofEvents
  );

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
      setProofEvents(nextState.proofEvents ?? []);
    },
    []
  );

  const proofPacket = React.useCallback(
    () =>
      buildProofPacket({
        activeMission,
        projectRequest,
        importedMission,
        payoutReceipt
      }),
    [activeMission, importedMission, payoutReceipt, projectRequest]
  );

  const appendEvent = React.useCallback(
    (
      type: ProofEvent["type"],
      payload?: Record<string, unknown>,
      overrides?: {
        mission?: ActiveMission;
        imported?: ImportedMission | null;
        wallet?: WalletIdentity | null;
      }
    ) => {
      setProofEvents((current) => [
        ...current,
        createProofEvent({
          type,
          activeMission: overrides?.mission ?? activeMission,
          projectRequest,
          importedMission: overrides?.imported ?? importedMission,
          walletIdentity: overrides?.wallet ?? walletIdentity,
          payload,
          previous: current.at(-1)
        })
      ]);
    },
    [activeMission, importedMission, projectRequest, walletIdentity]
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
      appendEvent(
        "github_imported",
        { repo: mission.repo, issueNumber: mission.issueNumber },
        { mission: "github", imported: mission }
      );
    },
    cancelRun: () => setScreen("mission-detail"),
    approvePacket: () => {
      setPacketReady(true);
      appendEvent("packet_ready");
      setScreen("case-file");
    },
    submitPacket: () => {
      setSubmitted(true);
      setRevisionRequested(false);
      setRejected(false);
      appendEvent("packet_submitted");
      setScreen("maintainer");
    },
    acceptPacket: () => {
      setSubmitted(true);
      setRevisionRequested(false);
      setRejected(false);
      setAccepted(true);
      setReleased(false);
      appendEvent("packet_accepted");
      setScreen("opportunity");
    },
    requestRevision: () => {
      setSubmitted(false);
      setRevisionRequested(true);
      setRejected(false);
      appendEvent("revision_requested");
      setScreen("case-file");
    },
    rejectPacket: () => {
      setSubmitted(false);
      setAccepted(false);
      setReleased(false);
      setRevisionRequested(false);
      setRejected(true);
      appendEvent("packet_rejected");
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
      appendEvent("payout_receipt_recorded", {
        amount: receipt.amount,
        txHash: receipt.txHash,
        chain: receipt.chain
      });
    },
    exportPacket: () => {
      downloadJson("proofforge-proof-packet.json", proofPacket());
    },
    importWorkspace: (nextState) => {
      applyImportedState(nextState);
      appendEvent("workspace_imported", { source: "workspace JSON" });
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
      const nextWallet = {
        address,
        ensName: walletIdentity?.ensName ?? "proofrunner.proofforge.eth",
        connectedAt: new Date().toISOString()
      };
      setWalletIdentity(nextWallet);
      appendEvent("wallet_connected", { address }, { wallet: nextWallet });
    },
    saveEnsName: (ensName) => {
      const nextWallet = {
        address: walletIdentity?.address ?? "Wallet not connected",
        ensName,
        connectedAt: walletIdentity?.connectedAt ?? new Date().toISOString()
      };
      setWalletIdentity(nextWallet);
      appendEvent("ens_saved", { ensName }, { wallet: nextWallet });
    },
    signLatestProofEvent: async () => {
      const provider = window.ethereum;
      const event = proofEvents.at(-1);
      if (!provider || !event || !walletIdentity?.address) return;
      const signature = (await provider.request({
        method: "personal_sign",
        params: [signableEventMessage(event), walletIdentity.address]
      })) as string;
      setProofEvents((current) =>
        current.map((item, index) =>
          index === current.length - 1 ? { ...item, signature } : item
        )
      );
    },
    exportProofRecord: () => {
      downloadJson(
        "proofforge-proof-record.json",
        buildProofRecord({
          events: proofEvents,
          packet: proofPacket(),
          walletIdentity
        })
      );
    }
  };

  // Persisting local V1 state is intentionally render-driven; localStorage writes
  // do not update React state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    walletIdentity,
    proofEvents
  };

  React.useEffect(() => {
    const { screen: _screen, ...saved } = state;
    void _screen;
    saveAppState(saved);
  }, [state]);

  return { state, actions };
}
