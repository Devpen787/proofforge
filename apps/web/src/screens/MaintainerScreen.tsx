import React from "react";
import {
  demoAgentIdentity,
  generatedProofSummary,
  getDemoMission,
  getDemoPacket
} from "../demo";
import type { ActiveMission } from "../app/types";
import { StatusBlock } from "../components/ui";

export function MaintainerScreen({
  submitted,
  accepted,
  activeMission,
  onAccept,
  onReview,
  onRevision,
  onReject
}: {
  submitted: boolean;
  accepted: boolean;
  activeMission: ActiveMission;
  onAccept: () => void;
  onReview: () => void;
  onRevision: () => void;
  onReject: () => void;
}) {
  const packet = getDemoPacket(activeMission);
  const mission = getDemoMission(activeMission);
  const hasReviewPacket = submitted || !accepted;
  const decisionState = accepted
    ? "Accepted"
    : hasReviewPacket
      ? "Decision due"
      : "No packet";
  const proofFacts = [
    { label: "Verifier", value: generatedProofSummary.verifierStatus },
    { label: "Risk", value: mission.risk },
    { label: "Source", value: mission.repo },
    { label: "Proof node", value: demoAgentIdentity.id },
    { label: "Credit to", value: demoAgentIdentity.owner },
    {
      label: "Storage",
      value: generatedProofSummary.protocolRefs.storageProvider
    },
    {
      label: "Submit via",
      value: generatedProofSummary.maintainerSubmission.provider
    },
    { label: "Payout", value: generatedProofSummary.payout.amount }
  ];
  return (
    <section className="page-grid maintainer-focus-grid">
      <header className="page-header">
        <span>Maintainer Review</span>
      </header>
      <section className="maintainer-review-console wide">
        <div className="maintainer-review-header">
          <div>
            <p className="small-label">Submitted evidence packet</p>
            <h1>Accept the proof and create the earned record.</h1>
            <p>{mission.title}</p>
            <span>{mission.repo}</span>
          </div>
          <span
            className={accepted ? "status-pill safe" : "status-pill warning"}
          >
            {decisionState}
          </span>
        </div>

        <div className="maintainer-review-body">
          <div className="maintainer-proof-panel">
            <p className="small-label">Verdict</p>
            <h2>{packet.result}</h2>
            <div className="maintainer-fact-strip">
              {proofFacts.map((fact) => (
                <StatusBlock
                  key={fact.label}
                  label={fact.label}
                  value={fact.value}
                />
              ))}
            </div>
          </div>

          <aside className="maintainer-decision-rail">
            <p className="small-label">Decision</p>
            <strong>
              {accepted ? "Proof accepted" : "Accept recommended"}
            </strong>
            <span>{packet.recommendedAction}</span>
            <span>
              Accepted proof credits {demoAgentIdentity.owner}; GitHub posting
              and payout release require explicit approval.
            </span>
            <button
              className="primary-action full"
              onClick={onAccept}
              disabled={accepted}
            >
              {accepted ? "Accepted" : "Accept & Mark Earned"}
            </button>
            {!accepted && (
              <>
                <button className="warning-action full" onClick={onRevision}>
                  Request Revision
                </button>
                <button className="danger-action full" onClick={onReject}>
                  Reject Packet
                </button>
              </>
            )}
            <button className="secondary-action full" onClick={onReview}>
              Review Packet
            </button>
          </aside>
        </div>

        <details className="project-detail-drawer">
          <summary>Decision details</summary>
          <p>{generatedProofSummary.whatWasProven}</p>
        </details>
      </section>
    </section>
  );
}
