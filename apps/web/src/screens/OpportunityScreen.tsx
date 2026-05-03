import React from "react";
import {
  demoProject,
  demoWork,
  generatedProofSummary
} from "../demo";
import type { ActiveMission } from "../app/types";

export function OpportunityScreen({
  agentRegistered,
  accepted,
  released,
  revisionRequested,
  rejected,
  onRelease,
  onResolveRevision,
  onStart,
  onAgentSetup,
  onPublicProof,
  onViewOpportunities
}: {
  agentRegistered: boolean;
  accepted: boolean;
  released: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  activeMission: ActiveMission;
  onRelease: () => void;
  onResolveRevision: () => void;
  onStart: () => void;
  onAgentSetup: () => void;
  onPublicProof: () => void;
  onViewOpportunities: () => void;
}) {
  const packetState = rejected
    ? "Rejected"
    : released
      ? "Released"
      : accepted
        ? "Earned"
        : revisionRequested
          ? "Revision requested"
          : "Ready to start";
  const heroTitle = !agentRegistered
    ? "Set up your proof node."
    : revisionRequested
      ? "Fix the packet."
      : rejected
        ? "Packet rejected."
        : accepted || released
          ? "Proof accepted."
          : "Find useful work. Prove it. Earn accepted credit.";
  const heroBody = !agentRegistered
    ? "Connect the local worker before running sourced tasks."
    : revisionRequested
      ? "A maintainer asked for a cleaner packet."
      : rejected
        ? "No payout was earned."
        : accepted && !released
          ? "Release the earned payout."
          : released
            ? "Public proof and credit are ready."
            : "Start with one safe task the runner can complete.";
  const primaryAction = !agentRegistered
    ? "Set up proof node"
    : revisionRequested
      ? "Open Case File"
      : released
        ? "View public proof"
        : accepted && !released
          ? "Release payout"
          : "Start sourced proof";
  const handlePrimary = !agentRegistered
    ? onAgentSetup
    : revisionRequested
      ? onResolveRevision
      : released
        ? onPublicProof
        : accepted && !released
          ? onRelease
          : onStart;
  const selectedWork = demoWork[1] || demoWork[0];

  return (
    <section className="page-grid pf-home-reference">
      <div className="pf-home-hero">
        <div className="pf-home-copy">
          <span className="pf-state-chip">{packetState}</span>
          <h1>{heroTitle}</h1>
          <p>{heroBody}</p>
          <div className="pf-home-actions">
            <button className="primary-action" onClick={handlePrimary}>
              {primaryAction}
            </button>
            <button className="secondary-action" onClick={onViewOpportunities}>
              View source-backed work
            </button>
          </div>
        </div>

        <aside className="pf-selected-mission" aria-label="Selected mission">
          <div className="pf-selected-topline">
            <span>Selected mission</span>
            <b>{agentRegistered ? "Ready" : "Node needed"}</b>
          </div>
          <h2>{selectedWork.title}</h2>
          <div className="pf-selected-card">
            <span className="pf-play-dot" aria-hidden="true">
              ▶
            </span>
            <div>
              <strong>{selectedWork.risk} · {selectedWork.runtime}</strong>
              <small>Accepted by {selectedWork.owner}</small>
            </div>
          </div>
          <dl>
            <div>
              <dt>Reward</dt>
              <dd>{selectedWork.reward} + rep + credits</dd>
            </div>
            <div>
              <dt>Approval</dt>
              <dd>Before submit</dd>
            </div>
            <div>
              <dt>Project</dt>
              <dd>{demoProject.name}</dd>
            </div>
          </dl>
        </aside>
      </div>

      {accepted || released ? (
        <section className="pf-accepted-summary" aria-label="Accepted proof">
          <span>
            <small>Proof</small>
            <strong>{generatedProofSummary.mission}</strong>
          </span>
          <span>
            <small>Accepted by</small>
            <strong>{generatedProofSummary.acceptedBy}</strong>
          </span>
          <span>
            <small>Earned</small>
            <strong>{generatedProofSummary.payout.amount}</strong>
          </span>
          <span>
            <small>Release</small>
            <strong>{released ? "Released" : "Pending"}</strong>
          </span>
        </section>
      ) : null}

      <section className="pf-work-table-card">
        <div className="pf-table-heading">
          <div>
            <p className="small-label">Ready work for you</p>
            <h2>Choose useful work with a clear proof path.</h2>
          </div>
          <button className="secondary-action" onClick={onViewOpportunities}>
            View all opportunities
          </button>
        </div>

        <div className="pf-work-table" role="table" aria-label="Ready work">
          <div className="pf-work-head" role="row">
            <span>Mission</span>
            <span>Accepts proof</span>
            <span>Reward</span>
            <span>Runtime</span>
            <span>Risk</span>
            <span />
          </div>
          {demoWork.map((work) => (
            <button
              className="pf-work-table-row"
              key={work.title}
              onClick={onStart}
              role="row"
            >
              <span className="pf-work-title" role="cell">
                <i aria-hidden="true">▶</i>
                <span>
                  <strong>{work.title}</strong>
                  <small>{work.repo}</small>
                </span>
              </span>
              <span role="cell">
                <small>Accepts proof</small>
                <b>{work.owner}</b>
              </span>
              <b role="cell">{work.reward}</b>
              <span role="cell">{work.runtime}</span>
              <span className={`status-pill ${work.tone}`} role="cell">
                {work.risk}
              </span>
              <span className="start-pill" role="cell">
                Start
              </span>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
