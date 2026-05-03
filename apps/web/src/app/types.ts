import type { Screen } from "../routes";

export type ActiveMission =
  | "docs"
  | "windows"
  | "mac"
  | "config"
  | "links"
  | "checkout"
  | "github"
  | "request";

export interface ImportedMission {
  title: string;
  repo: string;
  reward: string;
  runtime: string;
  risk: string;
  valuePath: string;
  sourceUrl: string;
  acceptanceOwner: string;
  objective: string;
  proofability: string;
  requirements: string[];
  issueNumber?: number;
  importedAt: string;
}

export interface ProjectRequest {
  projectName: string;
  projectPurpose: string;
  title: string;
  detail: string;
  reward: string;
  acceptanceOwner: string;
  inviteEmail: string;
}

export interface PayoutReceipt {
  chain: string;
  token: string;
  amount: string;
  txHash: string;
  recipient: string;
}

export interface WalletIdentity {
  address: string;
  ensName: string;
  connectedAt: string;
}

export type ProofEventType =
  | "workspace_imported"
  | "wallet_connected"
  | "ens_saved"
  | "github_imported"
  | "mission_started"
  | "packet_ready"
  | "packet_submitted"
  | "packet_accepted"
  | "revision_requested"
  | "packet_rejected"
  | "payout_receipt_recorded";

export interface ProofEvent {
  id: string;
  type: ProofEventType;
  createdAt: string;
  actor: string;
  sourceUrl?: string;
  packetId?: string;
  payload: Record<string, unknown>;
  previousHash?: string;
  eventHash: string;
  signature?: string;
}

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
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  payoutReceipt: PayoutReceipt | null;
  walletIdentity: WalletIdentity | null;
  proofEvents: ProofEvent[];
}

export interface AppActions {
  setScreen: (screen: Screen) => void;
  registerAgent: () => void;
  startProofJourney: () => void;
  openPublicProof: () => void;
  openOpportunities: () => void;
  openCaseFile: () => void;
  exportWorkspace: () => void;
  resetWorkspace: () => void;
  releasePayout: () => void;
  resolveRevision: () => void;
  runStarterMission: () => void;
  runMission: (mission: ActiveMission) => void;
  importGitHubMission: (mission: ImportedMission) => void;
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
  saveProjectProfile: (profile: {
    projectName: string;
    projectPurpose: string;
  }) => void;
  inviteContributor: (email?: string) => void;
  attachAgent: () => void;
  suggestWork: (request?: Partial<ProjectRequest>) => void;
  recordPayoutReceipt: (receipt: PayoutReceipt) => void;
  exportPacket: () => void;
  importWorkspace: (state: Partial<Omit<AppState, "screen">>) => void;
  connectWallet: () => Promise<void>;
  saveEnsName: (ensName: string) => void;
  signLatestProofEvent: () => Promise<void>;
  exportProofRecord: () => void;
}

export type Tone = "good" | "bad";
export type StatusTone = "safe" | "warning";
