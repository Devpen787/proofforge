import React from "react";
import type { Screen } from "../routes";
import type {
  ActiveMission,
  AppActions,
  AppState,
  WalletProviderMode
} from "./types";
import { screenFromHash } from "./helpers";
import {
  createAcceptanceFallbackMessage,
  createAcceptanceTypedData
} from "./acceptanceTypedData";
import { createNetworkRecord, downloadJson } from "./networkRecords";
import { createProjectRecord } from "./projectRecords";
import {
  normalizeProjectSyncKey,
  publishProjectRecordToGun,
  pullProjectRecordFromGun
} from "./gunProjectSync";
import {
  anchorAcceptedProof,
  deployProofRegistry,
  getConfiguredProofRegistryAddress
} from "./onchainProofRegistry";
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
  acceptanceMessage: "",
  payoutReceiptRef: "",
  zeroGReceiptUri: "",
  proofRegistryAddress: getConfiguredProofRegistryAddress(),
  proofRegistryDeployTxHash: "",
  proofRegistryTxHash: "",
  proofRegistryPacketHash: "",
  proofRegistryStatus: "",
  githubAcceptanceUrl: ""
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

async function getBrowserChainId() {
  const ethereum = getEthereumProvider();
  if (!ethereum) return 1;
  try {
    const chainId = await ethereum.request({ method: "eth_chainId" });
    return typeof chainId === "string" ? Number.parseInt(chainId, 16) : 1;
  } catch {
    return 1;
  }
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
  const [acceptanceMessage, setAcceptanceMessage] = React.useState(
    savedState.acceptanceMessage
  );
  const [payoutReceiptRef, setPayoutReceiptRef] = React.useState(
    savedState.payoutReceiptRef
  );
  const [zeroGReceiptUri, setZeroGReceiptUri] = React.useState(
    savedState.zeroGReceiptUri
  );
  const [proofRegistryAddress, setProofRegistryAddress] = React.useState(
    savedState.proofRegistryAddress
  );
  const [proofRegistryDeployTxHash, setProofRegistryDeployTxHash] =
    React.useState(savedState.proofRegistryDeployTxHash);
  const [proofRegistryTxHash, setProofRegistryTxHash] = React.useState(
    savedState.proofRegistryTxHash
  );
  const [proofRegistryPacketHash, setProofRegistryPacketHash] = React.useState(
    savedState.proofRegistryPacketHash
  );
  const [proofRegistryStatus, setProofRegistryStatus] = React.useState(
    savedState.proofRegistryStatus
  );
  const [githubAcceptanceUrl, setGithubAcceptanceUrl] = React.useState(
    savedState.githubAcceptanceUrl
  );

  const resetProof = React.useCallback(() => {
    setPacketReady(false);
    setSubmitted(false);
    setAccepted(false);
    setReleased(false);
    setRevisionRequested(false);
    setRejected(false);
    setAcceptanceSignature("");
    setAcceptanceMessage("");
    setPayoutReceiptRef("");
    setProofRegistryTxHash("");
    setProofRegistryPacketHash("");
    setProofRegistryStatus("");
    setGithubAcceptanceUrl("");
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
      setAcceptanceMessage(normalized.acceptanceMessage);
      setPayoutReceiptRef(normalized.payoutReceiptRef);
      setZeroGReceiptUri(normalized.zeroGReceiptUri);
      setProofRegistryAddress(
        normalized.proofRegistryAddress || getConfiguredProofRegistryAddress()
      );
      setProofRegistryDeployTxHash(normalized.proofRegistryDeployTxHash);
      setProofRegistryTxHash(normalized.proofRegistryTxHash);
      setProofRegistryPacketHash(normalized.proofRegistryPacketHash);
      setProofRegistryStatus(normalized.proofRegistryStatus);
      setGithubAcceptanceUrl(normalized.githubAcceptanceUrl);
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
            state?: Partial<SavedAppState>;
            receipts?: { zeroGReceipt?: string };
          };
      const nextState: Partial<SavedAppState> =
        "appState" in parsed && parsed.appState
          ? {
              ...parsed.appState,
              zeroGReceiptUri:
                parsed.receipts?.zeroGReceipt ?? parsed.appState.zeroGReceiptUri
            }
          : "state" in parsed && parsed.state
            ? parsed.state
            : (parsed as Partial<SavedAppState>);
      applySavedState(nextState);
    },
    exportNetworkRecord: async () => {
      const record = await createNetworkRecord("workspace_snapshot", state);
      downloadJson(`${record.id}.proof-network-record.json`, record);
    },
    exportProjectRecord: async () => {
      const record = await createProjectRecord(state);
      downloadJson(`${record.id}.proof-project-record.json`, record);
    },
    publishProjectSync: async (input) => {
      const record = await createProjectRecord(state);
      return publishProjectRecordToGun(record, {
        key: normalizeProjectSyncKey(input.key),
        peerUrl: input.peerUrl
      });
    },
    pullProjectSync: async (input) => {
      const record = await pullProjectRecordFromGun({
        key: normalizeProjectSyncKey(input.key),
        peerUrl: input.peerUrl
      });
      applySavedState(record.state);
      return record.project.name;
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
      const timestamp = new Date().toISOString();
      const chainId = await getBrowserChainId();
      const acceptanceInput = {
        chainId,
        accepted,
        activeMission,
        submitted,
        packetId: "packet_docs_install_demo",
        project: "Docs Onboarding Sprint",
        mission:
          activeMission === "checkout"
            ? "Checkout QA verification"
            : "Validate installation docs",
        storageRoot: "0x4ce83089482f",
        payout: "$8 external/manual",
        timestamp
      };
      const typedData = createAcceptanceTypedData(acceptanceInput);
      const fallbackMessage = createAcceptanceFallbackMessage(acceptanceInput);
      const ethereum = getEthereumProvider();
      if (ethereum && walletAddress && walletProvider === "browser") {
        const typedMessage = JSON.stringify(typedData);
        try {
          const signature = await ethereum.request({
            method: "eth_signTypedData_v4",
            params: [walletAddress, typedMessage]
          });
          setAcceptanceMessage(typedMessage);
          setAcceptanceSignature(String(signature));
          return;
        } catch {
          const signature = await ethereum.request({
            method: "personal_sign",
            params: [fallbackMessage, walletAddress]
          });
          setAcceptanceMessage(fallbackMessage);
          setAcceptanceSignature(String(signature));
          return;
        }
      }

      if (!walletConnected) {
        setWalletConnected(true);
        setWalletAddress("local-demo-reviewer");
        setWalletProvider("local-demo");
      }
      setAcceptanceMessage(fallbackMessage);
      setAcceptanceSignature(
        `local-demo-sig:${(await sha256Hex(fallbackMessage)).slice(0, 32)}`
      );
    },
    deployProofRegistry: async () => {
      const ethereum = getEthereumProvider();
      if (!ethereum) {
        throw new Error("Connect MetaMask to deploy the proof registry.");
      }
      if (!walletAddress || walletProvider !== "browser") {
        throw new Error("Connect a browser wallet before deploying.");
      }
      setProofRegistryStatus("Deploying registry...");
      const deployment = await deployProofRegistry({
        ethereum,
        from: walletAddress
      });
      setProofRegistryDeployTxHash(deployment.transactionHash);
      if (deployment.registryAddress) {
        setProofRegistryAddress(deployment.registryAddress);
        setProofRegistryStatus("Registry deployed");
      } else {
        setProofRegistryStatus("Registry deployment submitted");
      }
    },
    anchorAcceptedProof: async () => {
      const ethereum = getEthereumProvider();
      if (!ethereum) {
        throw new Error("Connect MetaMask to anchor accepted proof.");
      }
      if (!walletAddress || walletProvider !== "browser") {
        throw new Error("Connect a browser wallet before anchoring proof.");
      }
      const registryAddress =
        proofRegistryAddress || getConfiguredProofRegistryAddress();
      if (!registryAddress) {
        throw new Error(
          "Deploy a registry or set VITE_PROOF_REGISTRY_ADDRESS."
        );
      }
      setProofRegistryStatus("Anchoring accepted proof...");
      const result = await anchorAcceptedProof({
        ethereum,
        from: walletAddress,
        registryAddress,
        payoutReceiptRef
      });
      setProofRegistryAddress(result.registryAddress);
      setProofRegistryTxHash(result.transactionHash);
      setProofRegistryPacketHash(result.packetHash);
      setProofRegistryStatus("Accepted proof anchored");
    },
    recordGitHubAcceptanceUrl: (url) => {
      setGithubAcceptanceUrl(url.trim());
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
    acceptanceMessage,
    payoutReceiptRef,
    zeroGReceiptUri,
    proofRegistryAddress,
    proofRegistryDeployTxHash,
    proofRegistryTxHash,
    proofRegistryPacketHash,
    proofRegistryStatus,
    githubAcceptanceUrl
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
      acceptanceMessage,
      payoutReceiptRef,
      zeroGReceiptUri,
      proofRegistryAddress,
      proofRegistryDeployTxHash,
      proofRegistryTxHash,
      proofRegistryPacketHash,
      proofRegistryStatus,
      githubAcceptanceUrl
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
    acceptanceMessage,
    payoutReceiptRef,
    zeroGReceiptUri,
    proofRegistryAddress,
    proofRegistryDeployTxHash,
    proofRegistryTxHash,
    proofRegistryPacketHash,
    proofRegistryStatus,
    githubAcceptanceUrl
  ]);

  return { state, actions };
}
