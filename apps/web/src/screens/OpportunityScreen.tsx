import React from "react";
import { demoProject, demoWork, generatedProofSummary } from "../demo";
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
  const readyWork = demoProject.opportunities.filter(
    (work) => work.state === "Ready to run"
  );
  const needsTriage = demoProject.opportunities.filter(
    (work) => work.state === "Needs triage"
  );
  const registryMetrics = [
    { label: "Active project", value: "1", detail: demoProject.name },
    {
      label: "Open work",
      value: String(demoProject.opportunities.length),
      detail: "source-backed"
    },
    {
      label: "Ready missions",
      value: String(readyWork.length),
      detail: "proofable now"
    },
    {
      label: "Accepted proof",
      value: demoProject.acceptedProof,
      detail: "project ledger"
    },
    {
      label: "Earned value",
      value: generatedProofSummary.payout.amount,
      detail: accepted || released ? packetState : "available on accept"
    }
  ];
  const proofFlow = ["Source", "Mission", "Node", "Packet", "Accept", "Credit"];

  return (
    <section className="pf-registry-page">
      <header className="pf-registry-hero">
        <div className="pf-registry-kicker">
          <span>Contribution registry</span>
          <b>{packetState}</b>
        </div>
        <div className="pf-registry-headline">
          <div>
            <h1>{heroTitle}</h1>
            <p>{heroBody}</p>
          </div>
          <div className="pf-home-actions">
            <button className="primary-action" onClick={handlePrimary}>
              {primaryAction}
            </button>
            <button className="secondary-action" onClick={onViewOpportunities}>
              Browse work
            </button>
          </div>
        </div>

        <div className="pf-registry-metrics" aria-label="Registry metrics">
          {registryMetrics.map((metric) => (
            <span key={metric.label}>
              <small>{metric.label}</small>
              <strong>{metric.value}</strong>
              <em>{metric.detail}</em>
            </span>
          ))}
        </div>
      </header>

      <section className="pf-registry-main">
        <article className="pf-registry-panel pf-current-proof">
          <div className="pf-panel-heading">
            <span>Current proof object</span>
            <b>{agentRegistered ? "Node ready" : "Node setup required"}</b>
          </div>
          <h2>
            {accepted || released
              ? generatedProofSummary.mission
              : selectedWork.title}
          </h2>
          <p>
            {accepted || released
              ? generatedProofSummary.evidenceSummary
              : `${selectedWork.repo} · accepted by ${selectedWork.owner}`}
          </p>

          <div className="pf-proof-flow" aria-label="Proof flow">
            {proofFlow.map((step, index) => (
              <span
                key={step}
                className={
                  accepted || released || index < 2 ? "is-active" : undefined
                }
              >
                {step}
              </span>
            ))}
          </div>

          <dl className="pf-current-proof-facts">
            <div>
              <dt>Project</dt>
              <dd>{demoProject.name}</dd>
            </div>
            <div>
              <dt>Acceptance</dt>
              <dd>
                {accepted || released
                  ? generatedProofSummary.acceptedBy
                  : selectedWork.owner}
              </dd>
            </div>
            <div>
              <dt>Value</dt>
              <dd>
                {accepted || released
                  ? generatedProofSummary.payout.amount
                  : `${selectedWork.reward} if accepted`}
              </dd>
            </div>
            <div>
              <dt>Proof node</dt>
              <dd>{agentRegistered ? "docs-runner-01" : "not registered"}</dd>
            </div>
          </dl>
        </article>

        <aside className="pf-registry-panel pf-registry-side">
          <div className="pf-panel-heading">
            <span>Project state</span>
            <b>{demoProject.status}</b>
          </div>
          <h2>{demoProject.name}</h2>
          <p>{demoProject.purpose}</p>
          <dl>
            <div>
              <dt>Pool</dt>
              <dd>{demoProject.pool}</dd>
            </div>
            <div>
              <dt>Ready</dt>
              <dd>{readyWork.length}</dd>
            </div>
            <div>
              <dt>Needs triage</dt>
              <dd>{needsTriage.length}</dd>
            </div>
            <div>
              <dt>Proof nodes</dt>
              <dd>{demoProject.agents}</dd>
            </div>
          </dl>
        </aside>
      </section>

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

      <section className="pf-work-table-card" aria-label="Ready work">
        <div className="pf-table-heading">
          <div>
            <p className="small-label">Work to prove</p>
            <h2>Ready source-backed missions.</h2>
          </div>
          <button className="secondary-action" onClick={onViewOpportunities}>
            View inventory
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
