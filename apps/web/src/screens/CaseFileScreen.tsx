import React from "react";
import { generatedProofSummary, getDemoPacket } from "../demo";
import { getMissionDisplay } from "../app/missionDisplay";
import { buildShareUrl, type ShareState } from "../app/shareRecords";
import type {
  ActiveMission,
  ImportedMission,
  PayoutReceipt,
  ProjectRequest
} from "../app/types";
import { PageHeader, PageSurface, StatusRow } from "../components/ui";

export function CaseFileScreen({
  submitted,
  revisionRequested,
  rejected,
  activeMission,
  projectRequest,
  importedMission,
  payoutReceipt,
  shareState,
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
  shareState: ShareState;
  onSubmit: () => void;
  onExportPacket: () => void;
}) {
  const [copiedReviewLink, setCopiedReviewLink] = React.useState(false);
  const [copiedGitHubComment, setCopiedGitHubComment] = React.useState(false);
  const packet = getDemoPacket(activeMission);
  const mission = getMissionDisplay({
    activeMission,
    projectRequest,
    importedMission
  });
  const packetStatus = rejected
    ? "Rejected"
    : revisionRequested
      ? "Revision requested"
      : submitted
        ? "Submitted"
        : "Maintainer-ready";

  const copyReviewerLink = async () => {
    const url = buildShareUrl("maintainer", { ...shareState, submitted: true });
    await navigator.clipboard?.writeText(url.toString()).catch(() => undefined);
    setCopiedReviewLink(true);
  };

  const copyGitHubComment = async () => {
    const comment = [
      "ProofForge packet ready for maintainer review.",
      `Packet: ${mission.packetId}`,
      `Mission: ${mission.title}`,
      `Source: ${mission.sourceUrl}`,
      `Result: ${mission.result}`,
      "Evidence-only run. No PR, public comment, secrets, or funds."
    ].join("\n");
    await navigator.clipboard?.writeText(comment).catch(() => undefined);
    setCopiedGitHubComment(true);
  };

  const openSource = () => {
    if (mission.sourceUrl.startsWith("http")) {
      window.open(mission.sourceUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="page-grid packet-grid">
      <PageSurface className="wide pf-case-surface">
        <PageHeader
          eyebrow="Case file"
          title={mission.packetId}
          subtitle={mission.title}
          actions={
            <button className="secondary-action" onClick={onExportPacket}>
              Export packet
            </button>
          }
        />

        {revisionRequested ? (
          <div className="revision-banner" role="status">
            <strong>Revision requested</strong>
            <span>Maintainer needs clearer environment notes.</span>
          </div>
        ) : null}
        {rejected ? (
          <div className="rejection-banner" role="status">
            <strong>Packet rejected</strong>
            <span>Closed without earned payout.</span>
          </div>
        ) : null}

        <div className="pf-case-layout">
          <article className="pf-case-document">
            <div className="pf-case-document-head">
              <div>
                <span
                  className={
                    rejected || revisionRequested
                      ? "status-pill warning"
                      : "status-pill safe"
                  }
                >
                  {packetStatus}
                </span>
                <h2>Maintainer summary</h2>
              </div>
              <StatusRow label="Confidence" value="86%" tone="good" />
            </div>

            <div className="pf-case-summary">
              <div>
                <span>What was tested</span>
                <strong>{mission.objective}</strong>
              </div>
              <div>
                <span>What happened</span>
                <strong>{mission.result}</strong>
              </div>
              <div>
                <span>Recommended decision</span>
                <strong>{mission.recommendedAction}</strong>
              </div>
            </div>

            <div className="pf-case-check-grid">
              <section>
                <p className="small-label">Privacy</p>
                {packet.privacyReview.slice(0, 3).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </section>
              <section>
                <p className="small-label">Security</p>
                {packet.securityReview.slice(0, 3).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </section>
              <section>
                <p className="small-label">Verifier</p>
                <span>{generatedProofSummary.verifierStatus}</span>
                <span>{generatedProofSummary.policyStatus}</span>
                <span>No external action</span>
              </section>
            </div>

            <div className="pf-artifact-table">
              <p className="small-label">Artifacts</p>
              {packet.artifacts.map((artifact) => (
                <div key={artifact}>
                  <strong>{artifact}</strong>
                  <span>
                    {artifact.includes("log")
                      ? "Private by default"
                      : "Maintainer"}
                  </span>
                </div>
              ))}
            </div>

            <details className="pf-compact-details">
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

          <aside className="pf-case-submit">
            <p className="small-label">Submit decision</p>
            <h2>Evidence first. Code later.</h2>
            <StatusRow
              label="If accepted"
              value={`${mission.reward} earned`}
              tone="good"
            />
            <StatusRow label="Reputation" value="+12" tone="good" />
            <StatusRow label="Credits" value="+2" tone="good" />
            <StatusRow label="Release" value="Manual/external" tone="good" />
            <StatusRow
              label="Wallet receipt"
              value={payoutReceipt ? payoutReceipt.txHash : "After acceptance"}
              tone={payoutReceipt ? "good" : "bad"}
            />

            <div className="pf-share-split">
              <div>
                <strong>Shared</strong>
                <span>{packet.sharedWithMaintainer.join(", ")}</span>
              </div>
              <div>
                <strong>Private</strong>
                <span>{packet.keptPrivate.join(", ")}</span>
              </div>
            </div>

            <button
              className="primary-action full"
              onClick={onSubmit}
              disabled={submitted}
            >
              {submitted ? "Submitted" : "Submit to maintainer"}
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
            {mission.sourceUrl.startsWith("http") ? (
              <button className="secondary-action full" onClick={openSource}>
                Open source issue
              </button>
            ) : null}
          </aside>
        </div>
      </PageSurface>
    </section>
  );
}
