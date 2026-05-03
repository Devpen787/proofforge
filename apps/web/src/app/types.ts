import type { Screen } from "../routes";

export type ActiveMission = "docs" | "checkout";
export type WalletProviderMode = "none" | "browser" | "local-demo";

export interface AppState {
  screen: Screen;
  packetReady: boolean;
  submitted: boolean;
  accepted: boolean;
  released: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  importedLead: boolean;
  projectStarted: boolean;
  projectInviteSent: boolean;
  projectAgentAttached: boolean;
  projectWorkSuggested: boolean;
  workLeadClarified: boolean;
  workLeadConverted: boolean;
  activeMission: ActiveMission;
  agentRegistered: boolean;
  walletConnected: boolean;
  walletAddress: string;
  walletProvider: WalletProviderMode;
  acceptanceSignature: string;
  acceptanceMessage: string;
  payoutReceiptRef: string;
  zeroGReceiptUri: string;
  proofRegistryAddress: string;
  proofRegistryDeployTxHash: string;
  proofRegistryTxHash: string;
  proofRegistryPacketHash: string;
  proofRegistryStatus: string;
}

export interface AppActions {
  setScreen: (screen: Screen) => void;
  registerAgent: () => void;
  startProofJourney: () => void;
  openPublicProof: () => void;
  openOpportunities: () => void;
  openCaseFile: () => void;
  releasePayout: () => void;
  resolveRevision: () => void;
  runStarterMission: () => void;
  runMission: (mission: ActiveMission) => void;
  cancelRun: () => void;
  approvePacket: () => void;
  submitPacket: () => void;
  acceptPacket: () => void;
  requestRevision: () => void;
  rejectPacket: () => void;
  importExternalTask: () => void;
  viewOpportunityInventory: () => void;
  clarifyLead: () => void;
  convertLead: () => void;
  rejectLead: () => void;
  startProject: () => void;
  inviteContributor: () => void;
  attachAgent: () => void;
  suggestWork: () => void;
  exportWorkspace: () => void;
  importWorkspaceFile: (file: File) => Promise<void>;
  exportNetworkRecord: () => Promise<void>;
  exportProjectRecord: () => Promise<void>;
  publishProjectSync: (input: {
    peerUrl?: string;
    key: string;
  }) => Promise<string>;
  pullProjectSync: (input: {
    peerUrl?: string;
    key: string;
  }) => Promise<string>;
  connectWallet: () => Promise<void>;
  signAcceptance: () => Promise<void>;
  deployProofRegistry: () => Promise<void>;
  anchorAcceptedProof: () => Promise<void>;
  recordPayoutReceipt: (receipt: string) => void;
}

export type Tone = "good" | "bad";
export type StatusTone = "safe" | "warning";
