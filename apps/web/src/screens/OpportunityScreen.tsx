import React from "react";
import { demoWork } from "../demo";
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
      </div>

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
    </section>
  );
}
