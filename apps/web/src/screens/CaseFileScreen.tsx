import React from "react";
import {
  demoConvertedMission,
  demoConvertedPacket,
  demoPacket,
  demoMission,
  generatedProofSummary
} from "../demo";
import type { ActiveMission } from "../app/types";
import { buildShareUrl, type SharedAppState } from "../app/shareRecords";
import { StatusRow } from "../components/ui";

export function CaseFileScreen({
  submitted,
  revisionRequested,
  rejected,
  activeMission,
  shareState,
  onSubmit
}: {
  submitted: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  activeMission: ActiveMission;
  shareState: SharedAppState;
  onSubmit: () => void;
}) {
  const [copiedReviewLink, setCopiedReviewLink] = React.useState(false);
  const [copiedGitHubComment, setCopiedGitHubComment] = React.useState(false);
  const [copiedGitHubCommand, setCopiedGitHubCommand] = React.useState(false);
  const packet =
    activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const mission =
    activeMission === "checkout" ? demoConvertedMission : demoMission;
  const caseTitle =
    activeMission === "checkout"
      ? "Verified checkout QA with clarified browser targets."
      : "Validated install docs in a clean fixture.";
  const packetStatus = rejected
    ? "Rejected"
    : revisionRequested
      ? "Revision requested"
      : submitted
        ? "Submitted"
        : "Maintainer-ready";
  const copyReviewerLink = async () => {
    setCopiedReviewLink(true);
    const url = buildShareUrl("maintainer", {
      ...shareState,
      submitted: true
    });
    await navigator.clipboard?.writeText(url).catch(() => undefined);
  };
  const copyGitHubComment = async () => {
    setCopiedGitHubComment(true);
    const comment = [
      "ProofForge packet ready for maintainer review.",
      "",
      `- Packet: ${packet.id}`,
      `- Mission: ${mission.title}`,
      `- Result: ${packet.result}`,
      `- Verifier: ${generatedProofSummary.verifierStatus}`,
      `- Storage: ${
        generatedProofSummary.protocolRefs.storageUri ??
        generatedProofSummary.protocolRefs.storageProvider
      }`,
      "",
      "The proof node ran in evidence-only mode. It did not open a PR, post before approval, access secrets, or spend funds."
    ].join("\n");
    await navigator.clipboard?.writeText(comment).catch(() => undefined);
  };
  const copyGitHubCommand = async () => {
    setCopiedGitHubCommand(true);
    const issueUrl = "https://github.com/Devpen787/proofforge/issues/1";
    await navigator.clipboard
      ?.writeText(`gh issue comment ${issueUrl} --body-file proof-comment.md`)
      .catch(() => undefined);
  };

  return (
    <section className="page-grid packet-grid">
      <header className="page-header">
        <span>Case File / {packet.id}</span>
      </header>

      {revisionRequested && (
        <div className="revision-banner wide" role="status">
          <strong>Revision requested</strong>
          <span>
            Maintainer asked for clearer environment notes and the full command
            transcript before acceptance.
          </span>
        </div>
      )}
      {rejected && (
        <div className="rejection-banner wide" role="status">
          <strong>Packet rejected</strong>
          <span>
            The evidence was closed without payout. Start a new mission or
            rebuild the packet with stronger proof.
          </span>
        </div>
      )}

      <div className="packet-workspace wide">
        <article className="packet-document">
          <div className="packet-document-hero">
            <div>
              <p className="small-label">Evidence packet preview</p>
              <h1>{caseTitle}</h1>
              <p>{packet.summary}</p>
            </div>
            <div className="packet-document-status">
              <span
                className={
                  rejected || revisionRequested
                    ? "status-pill warning"
                    : "status-pill safe"
                }
              >
                {packetStatus}
              </span>
              <StatusRow label="Confidence" value="86%" tone="good" />
              <StatusRow
                label="Verifier"
                value={generatedProofSummary.verifierStatus}
                tone="good"
              />
              <StatusRow
                label="Storage"
                value={generatedProofSummary.protocolRefs.storageProvider}
                tone="good"
              />
              <StatusRow
                label="Agent"
                value={
                  generatedProofSummary.protocolRefs.identityRef ??
                  "docs-runner-01"
                }
                tone="good"
              />
            </div>
          </div>

          <div className="packet-summary-panel">
            <div>
              <span>Tested</span>
              <strong>{packet.objective}</strong>
            </div>
            <div>
              <span>Result</span>
              <strong>{packet.result}</strong>
            </div>
            <div>
              <span>Decision recommendation</span>
              <strong>{packet.recommendedAction}</strong>
            </div>
          </div>

          <div className="packet-summary-panel">
            <div>
              <span>Artifacts</span>
              <strong>{packet.artifacts.slice(0, 3).join(", ")}</strong>
            </div>
            <div>
              <span>Privacy</span>
              <strong>{packet.privacyReview.slice(0, 2).join(", ")}</strong>
            </div>
            <div>
              <span>Security</span>
              <strong>{packet.securityReview.slice(0, 2).join(", ")}</strong>
            </div>
          </div>

          <details className="packet-details-drawer">
            <summary>Review checks</summary>
            <div className="packet-checklist-grid">
              {[...packet.requirementsSatisfied, ...packet.privacyReview].map(
                (item) => (
                  <span key={item}>{item}</span>
                )
              )}
            </div>
          </details>
        </article>

        <aside className="packet-side-gate">
          <section className="packet-submit-panel">
            <p className="small-label">Submit decision</p>
            <h2>Send the proof, not agent noise.</h2>
            <p>
              If accepted: {mission.reward} earned, +12 reputation, +2 credits.
            </p>
            <div className="packet-value-box">
              <StatusRow
                label="Source"
                value={packet.valueRefs.bountySource}
                tone="good"
              />
              <StatusRow
                label="Release method"
                value={packet.valueRefs.payoutMethod}
                tone="good"
              />
              <StatusRow
                label="Packet storage"
                value={
                  generatedProofSummary.protocolRefs.storageRootShort ?? "local"
                }
                tone="good"
              />
            </div>
            <button
              className="primary-action full"
              onClick={onSubmit}
              disabled={submitted}
            >
              {submitted ? "Submitted to Maintainer Inbox" : "Submit Packet"}
            </button>
            <button
              className="secondary-action full"
              onClick={copyReviewerLink}
            >
              {copiedReviewLink ? "Reviewer link copied" : "Copy reviewer link"}
            </button>
            <button
              className="secondary-action full"
              onClick={copyGitHubComment}
            >
              {copiedGitHubComment
                ? "GitHub comment copied"
                : "Copy GitHub comment"}
            </button>
            <button
              className="secondary-action full"
              onClick={copyGitHubCommand}
            >
              {copiedGitHubCommand
                ? "GitHub CLI command copied"
                : "Copy GitHub CLI command"}
            </button>
          </section>
        </aside>
      </div>
    </section>
  );
}
