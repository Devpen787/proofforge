import React from "react";
import { generatedProofSummary, getDemoPacket } from "../demo";
import { getMissionDisplay } from "../app/missionDisplay";
import type {
  ActiveMission,
  ImportedMission,
  PayoutReceipt,
  ProjectRequest
} from "../app/types";
import { StatusRow } from "../components/ui";

export function CaseFileScreen({
  submitted,
  revisionRequested,
  rejected,
  activeMission,
  projectRequest,
  importedMission,
  payoutReceipt,
  onSubmit,
  onExportPacket
}: {
  submitted: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  payoutReceipt: PayoutReceipt | null;
  onSubmit: () => void;
  onExportPacket: () => void;
}) {
  const [copiedReviewLink, setCopiedReviewLink] = React.useState(false);
  const packet = getDemoPacket(activeMission);
  const mission = getMissionDisplay({
    activeMission,
    projectRequest,
    importedMission
  });
  const caseTitle =
    activeMission === "github" && importedMission
      ? `${importedMission.title} evidence is ready.`
      : mission.result;
  const packetStatus = rejected
    ? "Rejected"
    : revisionRequested
      ? "Revision requested"
      : submitted
        ? "Submitted"
        : "Maintainer-ready";
  const copyReviewerLink = async () => {
    const url = new URL(window.location.href);
    url.hash = `maintainer?packet=${encodeURIComponent(mission.packetId)}`;
    await navigator.clipboard?.writeText(url.toString()).catch(() => undefined);
    setCopiedReviewLink(true);
  };

  return (
    <section className="page-grid packet-grid">
      <header className="page-header">
        <span>Case File / {mission.packetId}</span>
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
                value={generatedProofSummary.protocolRefs.identityLabel}
                tone="good"
              />
            </div>
          </div>

          <div className="packet-summary-panel">
            <div>
              <span>Tested</span>
              <strong>{mission.objective}</strong>
            </div>
            <div>
              <span>Result</span>
              <strong>{mission.result}</strong>
            </div>
            <div>
              <span>Decision recommendation</span>
              <strong>{mission.recommendedAction}</strong>
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
            <h2>Submit the proof packet.</h2>
            <p>
              If accepted: {mission.reward} earned, +12 reputation, +2 credits.
            </p>
            <div className="packet-value-box">
              <StatusRow
                label="Source"
                value={mission.sourceLabel}
                tone="good"
              />
              <StatusRow
                label="Release method"
                value={packet.valueRefs.payoutMethod}
                tone="good"
              />
              <StatusRow
                label="Maintainer"
                value={generatedProofSummary.maintainerSubmission.provider}
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
              {submitted ? "Submitted to maintainer" : "Submit to maintainer"}
            </button>
            <button
              className="secondary-action full"
              onClick={copyReviewerLink}
            >
              {copiedReviewLink ? "Reviewer link copied" : "Copy reviewer link"}
            </button>
            <button className="secondary-action full" onClick={onExportPacket}>
              Export proof packet
            </button>
            <StatusRow
              label="Wallet receipt"
              value={payoutReceipt ? payoutReceipt.txHash : "After acceptance"}
              tone={payoutReceipt ? "good" : "bad"}
            />
            <details className="packet-details-drawer">
              <summary>GitHub submission</summary>
              <p>
                {generatedProofSummary.maintainerSubmission.status} ·{" "}
                {generatedProofSummary.maintainerSubmission.issueUrl}
              </p>
            </details>
          </section>
        </aside>
      </div>
    </section>
  );
}
