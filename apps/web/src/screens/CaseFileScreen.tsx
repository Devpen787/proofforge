import React from "react";
import {
  demoConvertedMission,
  demoConvertedPacket,
  demoPacket,
  demoMission,
  generatedProofSummary
} from "../demo";
import type { ActiveMission } from "../app/types";
import { StatusRow } from "../components/ui";

export function CaseFileScreen({
  submitted,
  revisionRequested,
  rejected,
  activeMission,
  onSubmit
}: {
  submitted: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  activeMission: ActiveMission;
  onSubmit: () => void;
}) {
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
          </section>
        </aside>
      </div>
    </section>
  );
}
