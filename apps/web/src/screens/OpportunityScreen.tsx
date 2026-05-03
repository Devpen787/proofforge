import React from "react";
import {
  demoAgentIdentity,
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
          : "Find work. Prove it. Get credited.";
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
      : accepted && !released
        ? "Release payout"
        : "Start sourced proof";
  const handlePrimary = !agentRegistered
    ? onAgentSetup
    : revisionRequested
      ? onResolveRevision
      : accepted && !released
        ? onRelease
        : onStart;

  return (
    <section className="page-grid home-grid">
      <div className="home-start-card wide">
        <div className="home-start-copy">
          <span className="status-pill safe">{packetState}</span>
          <h1>{heroTitle}</h1>
          <p>{heroBody}</p>
          <div className="home-actions">
            <button className="primary-action" onClick={handlePrimary}>
              {primaryAction}
            </button>
            {!agentRegistered && (
              <button
                className="secondary-action"
                onClick={onViewOpportunities}
              >
                See source-backed work
              </button>
            )}
            {revisionRequested && (
              <button className="secondary-action" onClick={onStart}>
                Start sourced proof
              </button>
            )}
            {(accepted || released) && (
              <button className="secondary-action" onClick={onPublicProof}>
                View public proof
              </button>
            )}
          </div>
        </div>
        <aside className="home-profile-panel">
          <div className="home-profile-head">
            <span className="mini-avatar">A</span>
            <span>
              <strong>Alex</strong>
              <small>
                {agentRegistered ? demoAgentIdentity.id : "No node yet"}
              </small>
            </span>
          </div>
          <div className="home-profile-grid">
            <span>
              <small>Wallet</small>
              <strong>{released ? "Released" : "Manual payout"}</strong>
            </span>
            <span>
              <small>Project</small>
              <strong>{demoProject.name}</strong>
            </span>
            <span>
              <small>Reputation</small>
              <strong>164</strong>
            </span>
            <span>
              <small>Level</small>
              <strong>4</strong>
            </span>
          </div>
        </aside>
      </div>

      <section className="home-tracker-strip wide">
        <span>
          <strong>{accepted || released ? "$8" : "$0"}</strong>
          <small>Earned</small>
        </span>
        <span>
          <strong>{accepted && !released ? "$8" : "$0"}</strong>
          <small>Pending release</small>
        </span>
        <span>
          <strong>{demoProject.acceptedProof}</strong>
          <small>Project proofs</small>
        </span>
        <span>
          <strong>{demoProject.opportunities.length}</strong>
          <small>Open missions</small>
        </span>
      </section>

      {agentRegistered && !accepted && !released && (
        <section className="panel wide home-work-compact">
          <div className="section-heading">
            <div>
              <p className="small-label">Ready work</p>
              <h2>Pick one sourced mission.</h2>
            </div>
            <button className="link-button" onClick={onViewOpportunities}>
              View all
            </button>
          </div>
          {demoWork.slice(0, 2).map((work) => (
            <button className="work-row" key={work.title} onClick={onStart}>
              <span className="work-main">
                <strong>{work.title}</strong>
                <small>{work.repo}</small>
              </span>
              <span className="work-owner">
                <small>Accepts proof</small>
                <b>{work.owner}</b>
              </span>
              <b>{work.reward}</b>
              <small>{work.runtime}</small>
              <span className={`status-pill ${work.tone}`}>{work.risk}</span>
              <span className="start-pill">Start</span>
            </button>
          ))}
        </section>
      )}

      {(revisionRequested || rejected) && (
        <section className="panel wide home-work-compact">
          <div className="section-heading">
            <h2>Ready work for you</h2>
            <button className="link-button" onClick={onViewOpportunities}>
              View all opportunities
            </button>
          </div>
          {demoWork.slice(0, 2).map((work) => (
            <button className="work-row" key={work.title} onClick={onStart}>
              <span className="work-main">
                <strong>{work.title}</strong>
                <small>{work.repo}</small>
              </span>
              <span className="work-owner">
                <small>Accepts proof</small>
                <b>{work.owner}</b>
              </span>
              <b>{work.reward}</b>
              <small>{work.runtime}</small>
              <span className={`status-pill ${work.tone}`}>{work.risk}</span>
              <span className="start-pill">Start</span>
            </button>
          ))}
        </section>
      )}

      {(accepted || released) && (
        <section className="panel wide home-work-compact">
          <div className="section-heading">
            <div>
              <p className="small-label">Accepted proof</p>
              <h2>Credit and next work.</h2>
            </div>
            <button className="link-button" onClick={onViewOpportunities}>
              View opportunities
            </button>
          </div>
          <div className="home-proof-summary">
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
            <span>
              <small>Stored on</small>
              <strong>
                {generatedProofSummary.protocolRefs.storageProvider}
              </strong>
            </span>
          </div>
          <div className="home-next-work">
            {demoWork.slice(0, 2).map((work) => (
              <button className="work-row" key={work.title} onClick={onStart}>
                <span className="work-main">
                  <strong>{work.title}</strong>
                  <small>{work.repo}</small>
                </span>
                <span className="work-owner">
                  <small>Accepts proof</small>
                  <b>{work.owner}</b>
                </span>
                <b>{work.reward}</b>
                <small>{work.runtime}</small>
                <span className={`status-pill ${work.tone}`}>{work.risk}</span>
                <span className="start-pill">Start</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="panel wide home-activity-panel">
        <div className="section-heading">
          <div>
            <p className="small-label">Activity</p>
            <h2>What changed.</h2>
          </div>
          <button className="link-button" onClick={onViewOpportunities}>
            Find work
          </button>
        </div>
        <div className="home-activity-list">
          <span>
            <b>Proof node</b>
            <strong>
              {agentRegistered ? "Ready for local runs" : "Setup needed"}
            </strong>
            <small>Current</small>
          </span>
          <span>
            <b>Project</b>
            <strong>{demoProject.name}</strong>
            <small>{demoProject.opportunities.length} sourced missions</small>
          </span>
          <span>
            <b>Latest proof</b>
            <strong>
              {accepted || released
                ? "Accepted by maintainer"
                : "No packet submitted"}
            </strong>
            <small>
              {accepted || released ? "+12 reputation" : "Start a mission"}
            </small>
          </span>
        </div>
      </section>
    </section>
  );
}
