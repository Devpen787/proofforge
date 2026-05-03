import { generatedProofSummary } from "../demo";

export const proofSourceIssueUrl =
  "https://github.com/Devpen787/proofforge/issues/1";

export function buildMaintainerGitHubComment(input: {
  packetId: string;
  mission: string;
  result: string;
}) {
  return [
    "ProofForge packet ready for maintainer review.",
    "",
    `- Packet: ${input.packetId}`,
    `- Mission: ${input.mission}`,
    `- Result: ${input.result}`,
    `- Verifier: ${generatedProofSummary.verifierStatus}`,
    `- Storage: ${
      generatedProofSummary.protocolRefs.storageUri ??
      generatedProofSummary.protocolRefs.storageProvider
    }`,
    "",
    "The proof node ran in evidence-only mode. It did not open a PR, post before approval, access secrets, or spend funds."
  ].join("\n");
}
