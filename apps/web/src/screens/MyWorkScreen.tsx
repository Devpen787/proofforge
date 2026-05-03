import React from "react";
import { demoMyWork, generatedProofSummary } from "../demo";
import { getMissionDisplay } from "../app/missionDisplay";
import type {
  ActiveMission,
  ImportedMission,
  PayoutReceipt,
  ProjectRequest
} from "../app/types";

export function MyWorkScreen({
  agentRegistered,
  submitted,
  accepted,
  released,
  revisionRequested,
  rejected,
  activeMission,
  projectRequest,
  importedMission,
  payoutReceipt,
  onMission,
  onClarify,
  onCaseFile,
  onAgentSetup,
  onRelease,
  onRecordPayout,
  onPublicProof
}: {
  agentRegistered: boolean;
  submitted: boolean;
  accepted: boolean;
  released: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  payoutReceipt: PayoutReceipt | null;
  onMission: () => void;
  onClarify: () => void;
  onCaseFile: () => void;
  onAgentSetup: () => void;
  onRelease: () => void;
  onRecordPayout: (receipt: PayoutReceipt) => void;
  onPublicProof: () => void;
}) {
  const mission = getMissionDisplay({
    activeMission,
    projectRequest,
    importedMission
  });
  const [receiptDraft, setReceiptDraft] = React.useState<PayoutReceipt>({
    chain: "0G Galileo",
    token: "0G",
    amount: mission.reward,
    txHash: payoutReceipt?.txHash ?? "",
    recipient: "Contributor wallet"
  });
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
            label:
              mission.reward === "Credit"
                ? "View public proof"
                : "Release payout",
            title:
              mission.reward === "Credit"
                ? "The proof is accepted. Record payout only if one happens."
                : "The payout is earned. Record release when it happens.",
            detail:
              "Maintainer acceptance created credit and an earned payout. Release is a separate manual step in V1.",
            action: mission.reward === "Credit" ? onPublicProof : onRelease
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
      title: mission.title,
      project: mission.repo,
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
  const currentRows = accepted
    ? workRows.filter((item) => item.status !== "Accepted")
    : workRows;

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
              <strong>{mission.title}</strong>
            </span>
            <span>
              <small>Accepted by</small>
              <strong>{mission.owner}</strong>
            </span>
            <span>
              <small>Credit</small>
              <strong>+{generatedProofSummary.projectCredit.points}</strong>
            </span>
            <span>
              <small>Earned</small>
              <strong>{mission.reward}</strong>
            </span>
            <span>
              <small>Release</small>
              <strong>
                {released ? payoutReceipt?.txHash || "Released" : "Pending"}
              </strong>
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

      {accepted && !released && (
        <section className="my-work-receipt wide">
          <div>
            <p className="small-label">Wallet receipt</p>
            <h2>Track external payout release.</h2>
          </div>
          <input
            aria-label="Payout transaction hash"
            placeholder="Paste wallet tx hash or receipt reference"
            value={receiptDraft.txHash}
            onChange={(event) =>
              setReceiptDraft((current) => ({
                ...current,
                txHash: event.target.value
              }))
            }
          />
          <button
            className="primary-action"
            onClick={() => onRecordPayout(receiptDraft)}
          >
            Record release
          </button>
        </section>
      )}

      <div className="my-work-command wide">
        <section className="panel my-work-list">
          <div className="section-heading">
            <div>
              <p className="small-label">Active work</p>
              <h2>Current work.</h2>
            </div>
          </div>
          <div className="my-work-table" role="list">
            {currentRows.map((item) => (
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
