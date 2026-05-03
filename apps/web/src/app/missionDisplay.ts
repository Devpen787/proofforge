import { generatedProofSummary, getDemoMission, getDemoPacket } from "../demo";
import type {
  ActiveMission,
  ImportedMission,
  PayoutReceipt,
  ProjectRequest
} from "./types";

export function formatReward(amount?: number, currency?: string) {
  if (amount === undefined || amount === null) return "Credit";
  if (!currency || currency.toUpperCase() === "USD") return `$${amount}`;
  return `${amount} ${currency}`;
}

export function getMissionDisplay({
  activeMission,
  projectRequest,
  importedMission
}: {
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
}) {
  const mission = getDemoMission(activeMission);
  const packet = getDemoPacket(activeMission);

  if (activeMission === "github" && importedMission) {
    return {
      ...mission,
      ...importedMission,
      owner: importedMission.acceptanceOwner,
      objective: importedMission.objective,
      packetId: "packet_github_issue",
      result: `${importedMission.title} produced a maintainer-ready evidence packet from the imported GitHub issue.`,
      recommendedAction:
        "Review the packet against the source issue and accept it only if the evidence is useful.",
      sourceLabel: "GitHub issue"
    };
  }

  if (activeMission === "request") {
    return {
      ...mission,
      title: projectRequest.title,
      repo: projectRequest.projectName,
      reward: projectRequest.reward,
      sourceUrl: "project://work-request",
      owner: projectRequest.acceptanceOwner,
      objective: projectRequest.detail,
      packetId: "packet_project_request",
      result: `${projectRequest.title} produced a project-ready evidence packet.`,
      recommendedAction:
        "Review the packet against the project request and credit the contributor if accepted.",
      sourceLabel: "Project request"
    };
  }

  return {
    ...mission,
    owner: activeMission === "checkout" ? "External buyer" : "Commons reviewer",
    objective: packet.objective,
    packetId: packet.id,
    result: packet.result,
    recommendedAction: packet.recommendedAction,
    sourceLabel:
      activeMission === "checkout" ? "Marketplace task" : "GitHub issue"
  };
}

export function buildProofPacket(input: {
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  payoutReceipt: PayoutReceipt | null;
}) {
  const mission = getMissionDisplay(input);
  const packet = getDemoPacket(input.activeMission);

  return {
    packetId: mission.packetId,
    status: "maintainer_ready",
    mission: {
      title: mission.title,
      repo: mission.repo,
      sourceUrl: mission.sourceUrl,
      source: mission.sourceLabel,
      acceptanceOwner: mission.owner,
      reward: mission.reward,
      valuePath: mission.valuePath
    },
    proofNode: generatedProofSummary.protocolRefs.identityRef,
    objective: mission.objective,
    result: mission.result,
    recommendedAction: mission.recommendedAction,
    artifacts: packet.artifacts,
    requirementsSatisfied: packet.requirementsSatisfied,
    privacyReview: packet.privacyReview,
    securityReview: packet.securityReview,
    storage: generatedProofSummary.protocolRefs,
    payoutReceipt: input.payoutReceipt,
    createdAt: new Date().toISOString()
  };
}
