import React from "react";
import type { Screen } from "../routes";
import type {
  ActiveMission,
  AppActions,
  AppState,
  WalletProviderMode
} from "./types";
import { screenFromHash } from "./helpers";
import { createNetworkRecord, downloadJson } from "./networkRecords";
import { readSharedStateFromHash } from "./shareRecords";

type SavedAppState = Omit<AppState, "screen">;
type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

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
  agentRegistered: false,
  walletConnected: false,
  walletAddress: "",
  walletProvider: "none",
  acceptanceSignature: "",
  payoutReceiptRef: "",
  zeroGReceiptUri: ""
};

function normalizeSavedState(input: Partial<SavedAppState>): SavedAppState {
  return {
    ...defaultSavedState,
    ...input,
    activeMission:
      input.activeMission === "checkout" || input.activeMission === "docs"
        ? input.activeMission
        : defaultSavedState.activeMission
  };
}

function readSavedAppState(): SavedAppState {
  if (typeof window === "undefined") return defaultSavedState;
  try {
    const raw = window.localStorage.getItem(PERSIST_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<SavedAppState>) : {};
    const shared = readSharedStateFromHash() ?? {};
    return normalizeSavedState({ ...parsed, ...shared });
  } catch {
    return defaultSavedState;
  }
}

function saveAppState(state: SavedAppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
}

function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as Window & { ethereum?: EthereumProvider })
    .ethereum;
  return candidate?.request ? candidate : null;
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
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
  const [walletConnected, setWalletConnected] = React.useState(
    savedState.walletConnected
  );
  const [walletAddress, setWalletAddress] = React.useState(
    savedState.walletAddress
  );
  const [walletProvider, setWalletProvider] =
    React.useState<WalletProviderMode>(savedState.walletProvider);
  const [acceptanceSignature, setAcceptanceSignature] = React.useState(
    savedState.acceptanceSignature
  );
  const [payoutReceiptRef, setPayoutReceiptRef] = React.useState(
    savedState.payoutReceiptRef
  );
  const [zeroGReceiptUri, setZeroGReceiptUri] = React.useState(
    savedState.zeroGReceiptUri
  );

  const resetProof = React.useCallback(() => {
    setPacketReady(false);
    setSubmitted(false);
    setAccepted(false);
    setReleased(false);
    setRevisionRequested(false);
    setRejected(false);
    setAcceptanceSignature("");
    setPayoutReceiptRef("");
  }, []);

  const applySavedState = React.useCallback(
    (nextState: Partial<SavedAppState>) => {
      const normalized = normalizeSavedState(nextState);
      setPacketReady(normalized.packetReady);
      setSubmitted(normalized.submitted);
      setAccepted(normalized.accepted);
      setReleased(normalized.released);
      setRevisionRequested(normalized.revisionRequested);
      setRejected(normalized.rejected);
      setImportedLead(normalized.importedLead);
      setProjectStarted(normalized.projectStarted);
      setProjectInviteSent(normalized.projectInviteSent);
      setProjectAgentAttached(normalized.projectAgentAttached);
      setProjectWorkSuggested(normalized.projectWorkSuggested);
      setWorkLeadClarified(normalized.workLeadClarified);
      setWorkLeadConverted(normalized.workLeadConverted);
      setActiveMission(normalized.activeMission);
      setAgentRegistered(normalized.agentRegistered);
      setWalletConnected(normalized.walletConnected);
      setWalletAddress(normalized.walletAddress);
      setWalletProvider(normalized.walletProvider);
      setAcceptanceSignature(normalized.acceptanceSignature);
      setPayoutReceiptRef(normalized.payoutReceiptRef);
      setZeroGReceiptUri(normalized.zeroGReceiptUri);
      saveAppState(normalized);
    },
    []
  );

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
    },
    exportWorkspace: () => {
      downloadJson("proofforge-workspace.json", readSavedAppState());
    },
    importWorkspaceFile: async (file) => {
      const parsed = JSON.parse(await file.text()) as
        | Partial<SavedAppState>
        | {
            appState?: Partial<SavedAppState>;
            receipts?: { zeroGReceipt?: string };
          };
      const nextState: Partial<SavedAppState> =
        "appState" in parsed && parsed.appState
          ? {
              ...parsed.appState,
              zeroGReceiptUri:
                parsed.receipts?.zeroGReceipt ?? parsed.appState.zeroGReceiptUri
            }
          : (parsed as Partial<SavedAppState>);
      applySavedState(nextState);
    },
    exportNetworkRecord: async () => {
      const record = await createNetworkRecord("workspace_snapshot", state);
      downloadJson(`${record.id}.proof-network-record.json`, record);
    },
    connectWallet: async () => {
      const ethereum = getEthereumProvider();
      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts"
        });
        const address = Array.isArray(accounts)
          ? String(accounts[0] ?? "")
          : "";
        if (!address) throw new Error("Wallet did not return an address.");
        setWalletConnected(true);
        setWalletAddress(address);
        setWalletProvider("browser");
        return;
      }

      setWalletConnected(true);
      setWalletAddress("local-demo-reviewer");
      setWalletProvider("local-demo");
    },
    signAcceptance: async () => {
      const message = JSON.stringify({
        domain: "ProofForge",
        action: "accept-proof",
        accepted,
        activeMission,
        submitted,
        packet: "packet_docs_install_demo",
        at: new Date().toISOString()
      });
      const ethereum = getEthereumProvider();
      if (ethereum && walletAddress && walletProvider === "browser") {
        const signature = await ethereum.request({
          method: "personal_sign",
          params: [message, walletAddress]
        });
        setAcceptanceSignature(String(signature));
        return;
      }

      if (!walletConnected) {
        setWalletConnected(true);
        setWalletAddress("local-demo-reviewer");
        setWalletProvider("local-demo");
      }
      setAcceptanceSignature(
        `local-demo-sig:${(await sha256Hex(message)).slice(0, 32)}`
      );
    },
    recordPayoutReceipt: (receipt) => {
      setPayoutReceiptRef(receipt.trim());
      if (receipt.trim()) setReleased(true);
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
    walletConnected,
    walletAddress,
    walletProvider,
    acceptanceSignature,
    payoutReceiptRef,
    zeroGReceiptUri
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
      walletConnected,
      walletAddress,
      walletProvider,
      acceptanceSignature,
      payoutReceiptRef,
      zeroGReceiptUri
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
    walletConnected,
    walletAddress,
    walletProvider,
    acceptanceSignature,
    payoutReceiptRef,
    zeroGReceiptUri
  ]);

  return { state, actions };
}
