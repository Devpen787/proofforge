import React from "react";
import { demoMyWork, generatedProofSummary } from "../demo";

export function MyWorkScreen({
  agentRegistered,
  submitted,
  accepted,
  released,
  revisionRequested,
  rejected,
  onMission,
  onClarify,
  onCaseFile,
  onAgentSetup,
  onRelease,
  onPublicProof
}: {
  agentRegistered: boolean;
  submitted: boolean;
  accepted: boolean;
  released: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  onMission: () => void;
  onClarify: () => void;
  onCaseFile: () => void;
  onAgentSetup: () => void;
  onRelease: () => void;
  onPublicProof: () => void;
}) {
  const nextAction = !agentRegistered
    ? {
        label: "Set up proof node",
        title: "Register the agent that rolls work back to you.",
        detail:
          "Your local proof node runs, verifies, and packages evidence. Accepted packets credit you.",
        action: onAgentSetup
      }
    : revisionRequested
      ? {
          label: "Open case file",
          title: "A maintainer needs a cleaner packet.",
          detail:
            "Add the requested transcript and resubmit from the case file.",
          action: onCaseFile
        }
      : accepted && !released
        ? {
            label: "Release payout",
            title: "The payout is earned. Collection is next.",
            detail:
              "Maintainer acceptance created credit and an earned payout. Release is a separate manual step in V1.",
            action: onRelease
          }
        : accepted && released
          ? {
              label: "View public proof",
              title: "Your accepted proof is now portable.",
              detail:
                "Share the public-safe packet and start the next sourced mission.",
              action: onPublicProof
            }
          : submitted
            ? {
                label: "Review packet",
                title: "The packet is waiting on maintainer decision.",
                detail:
                  "No payout or public proof exists until the reviewer accepts it.",
                action: onCaseFile
              }
            : {
                label: "Run docs validation",
                title: "One safe mission is ready.",
                detail:
                  "Run a local evidence-only proof against sourced docs work.",
                action: onMission
              };

  const workRows = [
    {
      ...demoMyWork[0],
      source: "GitHub issue",
      status: accepted ? "Accepted" : submitted ? "In review" : "Ready",
      action: accepted ? "View proof" : submitted ? "Open packet" : "Run",
      onClick: accepted ? onPublicProof : submitted ? onCaseFile : onMission
    },
    {
      ...demoMyWork[1],
      source: "Marketplace",
      status: "Needs detail",
      action: "Clarify",
      onClick: onClarify
    },
    {
      ...demoMyWork[2],
      source: "Case file",
      status: revisionRequested
        ? "Revision"
        : rejected
          ? "Rejected"
          : accepted
            ? "Accepted"
            : "Draft",
      action: accepted ? "Public proof" : "Open",
      onClick: accepted ? onPublicProof : onCaseFile
    }
  ];

  return (
    <section className="page-grid my-work-grid">
      <div className="my-work-hero wide">
        <div className="my-work-hero-copy">
          <p className="small-label">My Work</p>
          <h1>Work, proof, credit.</h1>
          <p>{nextAction.title}</p>
          <button className="primary-action" onClick={nextAction.action}>
            {nextAction.label}
          </button>
        </div>
      </div>

      {(accepted || released) && (
        <section className="my-work-ledger wide">
          <p className="small-label">Accepted</p>
          <div className="my-work-ledger-table">
            <span>
              <small>Proof</small>
              <strong>Docs install proof</strong>
            </span>
            <span>
              <small>Accepted by</small>
              <strong>{generatedProofSummary.acceptedBy}</strong>
            </span>
            <span>
              <small>Credit</small>
              <strong>+{generatedProofSummary.projectCredit.points}</strong>
            </span>
            <span>
              <small>Earned</small>
              <strong>{generatedProofSummary.payout.amount}</strong>
            </span>
            <span>
              <small>Release</small>
              <strong>{released ? "Released" : "Pending"}</strong>
            </span>
            <span>
              <small>Storage</small>
              <strong>
                {generatedProofSummary.protocolRefs.storageProvider}
              </strong>
            </span>
          </div>
        </section>
      )}

      <div className="my-work-command wide">
        <section className="panel my-work-list">
          <div className="section-heading">
            <div>
              <p className="small-label">Active work</p>
              <h2>Open items.</h2>
            </div>
          </div>
          <div className="my-work-table" role="list">
            {workRows.map((item) => (
              <button
                className="my-work-row"
                key={item.title}
                onClick={item.onClick}
              >
                <span className="my-work-title">
                  <strong>{item.title}</strong>
                  <small>{item.project}</small>
                </span>
                <span>
                  <small>Source</small>
                  <b>{item.source}</b>
                </span>
                <span>
                  <small>Status</small>
                  <b>{item.status}</b>
                </span>
                <span>
                  <small>Value</small>
                  <b>
                    {accepted && item.title === demoMyWork[0].title
                      ? generatedProofSummary.payout.amount
                      : item.value}
                  </b>
                </span>
                <span className="start-pill">{item.action}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
