import React from "react";
import { demoMyWork, generatedProofSummary } from "../demo";
import { getMissionDisplay } from "../app/missionDisplay";
import type {
  ActiveMission,
  ImportedMission,
  PayoutReceipt,
  ProjectRequest
} from "../app/types";
import { PageHeader, PageSurface, RowList, StatusRow } from "../components/ui";

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
  onEarnings,
  onRelease,
  onRecordPayout,
  onPublicProof,
  publicProofPublished
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
  onEarnings: () => void;
  onRelease: () => void;
  onRecordPayout: (receipt: PayoutReceipt) => void;
  onPublicProof: () => void;
  publicProofPublished: boolean;
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
                ? publicProofPublished
                  ? "View public proof"
                  : "Publish proof"
                : "Release payout",
            title:
              mission.reward === "Credit"
                ? "The proof is accepted. Publish a scoped proof only if you want it public."
                : "The payout is earned. Publish proof and release payout as separate choices.",
            detail:
              "Maintainer acceptance created private credit. Public proof is opt-in and scoped.",
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
  const currentRows = workRows;
  const creditState = released
    ? "Released"
    : accepted
      ? "Earned"
      : submitted
        ? "In review"
        : "Not submitted";

  return (
    <PageSurface className="wide pf-my-work-surface">
      <PageHeader
        eyebrow="My Work"
        title="Track proof and earned value."
        subtitle={nextAction.title}
        actions={
          <button className="primary-action" onClick={nextAction.action}>
            {nextAction.label}
          </button>
        }
      />

      <div className="pf-work-state-strip">
        <StatusRow
          label="Active"
          value={submitted ? "Submitted" : "Ready"}
          tone="good"
        />
        <StatusRow
          label="Accepted"
          value={accepted ? "Yes" : "Waiting"}
          tone={accepted ? "good" : "bad"}
        />
        <StatusRow
          label="Earned"
          value={accepted ? mission.reward : "$0"}
          tone={accepted ? "good" : "bad"}
        />
        <StatusRow
          label="Released"
          value={released ? "Recorded" : "Pending"}
          tone={released ? "good" : "bad"}
        />
        <StatusRow
          label="Public"
          value={publicProofPublished ? "Published" : "Private"}
          tone={publicProofPublished ? "good" : "bad"}
        />
      </div>

      <div className="pf-my-work-layout">
        <RowList className="pf-work-table">
          <div className="pf-work-row head">
            <span>Work</span>
            <span>Source</span>
            <span>Status</span>
            <span>Value</span>
            <span>Action</span>
          </div>
          {currentRows.map((item) => (
            <button
              className="pf-work-row"
              key={item.title}
              onClick={item.onClick}
            >
              <strong>{item.title}</strong>
              <span>{item.source}</span>
              <span>{item.status}</span>
              <span>
                {accepted && item.title === demoMyWork[0].title
                  ? generatedProofSummary.payout.amount
                  : item.value}
              </span>
              <b>{item.action}</b>
            </button>
          ))}
        </RowList>

        <aside className="pf-work-detail">
          <p className="small-label">Selected proof</p>
          <h2>{mission.title}</h2>
          <StatusRow
            label="State"
            value={creditState}
            tone={accepted ? "good" : "bad"}
          />
          <StatusRow
            label="Accepted by"
            value={accepted ? mission.owner : "Waiting"}
            tone={accepted ? "good" : "bad"}
          />
          <StatusRow
            label="Credit"
            value={`+${generatedProofSummary.projectCredit.points}`}
            tone={accepted ? "good" : "bad"}
          />
          <StatusRow
            label="Receipt"
            value={
              released ? payoutReceipt?.txHash || "Recorded" : "Not released"
            }
            tone={released ? "good" : "bad"}
          />
          {accepted && !released ? (
            <div className="pf-work-receipt">
              <input
                aria-label="Payout transaction hash"
                placeholder="Wallet tx hash or receipt"
                value={receiptDraft.txHash}
                onChange={(event) =>
                  setReceiptDraft((current) => ({
                    ...current,
                    txHash: event.target.value
                  }))
                }
              />
              <button
                className="primary-action full"
                onClick={() => onRecordPayout(receiptDraft)}
              >
                Record release
              </button>
            </div>
          ) : null}
          <div className="pf-work-links">
            <button className="secondary-action full" onClick={onCaseFile}>
              Case file
            </button>
            <button className="secondary-action full" onClick={onEarnings}>
              Earnings
            </button>
            <button className="secondary-action full" onClick={onPublicProof}>
              Public proof
            </button>
            <button className="secondary-action full" onClick={onClarify}>
              Project work
            </button>
          </div>
        </aside>
      </div>

      <section className="pf-support-section">
        <div>
          <p className="small-label">Privacy</p>
          <h2>My Work is private by default.</h2>
        </div>
        <p>
          Accepted proof can be shared as a scoped public receipt. Your full
          work history, failed runs, bids, wallet details, and payout totals
          stay in this workspace unless you publish a specific proof.
        </p>
      </section>
    </PageSurface>
  );
}
