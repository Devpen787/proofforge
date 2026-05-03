import type { Screen } from "../routes";

export type ActiveMission =
  | "docs"
  | "windows"
  | "mac"
  | "config"
  | "links"
  | "checkout"
  | "request";

export interface ProjectRequest {
  projectName: string;
  projectPurpose: string;
  title: string;
  detail: string;
  reward: string;
  acceptanceOwner: string;
  inviteEmail: string;
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
}

export type Tone = "good" | "bad";
export type StatusTone = "safe" | "warning";
