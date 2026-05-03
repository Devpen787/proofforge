import React from "react";
import {
  demoProject,
  demoProjectLedgerRows,
  demoSourceConnections,
  demoV2Signals
} from "../demo";

function CompactPerson({
  name,
  role,
  status,
  tone
}: {
  name: string;
  role: string;
  status: string;
  tone: "safe" | "warning";
}) {
  return (
    <div className="compact-person-row">
      <span className="mini-avatar">{name.charAt(0).toUpperCase()}</span>
      <div>
        <strong>{name}</strong>
        <small>{role}</small>
      </div>
      <span
        className={tone === "safe" ? "status-pill safe" : "status-pill warning"}
      >
        {status}
      </span>
    </div>
  );
}

function OpportunityRow({
  title,
  detail,
  reward,
  safety,
  proofability,
  action,
  onQueue
}: {
  title: string;
  detail: string;
  reward: string;
  safety: string;
  proofability: string;
  action: string;
  onQueue: () => void;
}) {
  return (
    <div className="project-opportunity-row">
      <span className="opportunity-icon">{action === "Run" ? "▶" : "◇"}</span>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
        <span className="project-opportunity-meta">
          {reward} · {safety} · {proofability} proofable
        </span>
      </div>
      <button
        className={action === "Run" ? "primary-action" : "secondary-action"}
        onClick={onQueue}
      >
        {action}
      </button>
    </div>
  );
}

export function ProjectsScreen({
  projectStarted,
  inviteSent,
  workSuggested,
  onStartProject,
  onInvite,
  onSuggestWork,
  onQueue
}: {
  projectStarted: boolean;
  inviteSent: boolean;
  agentAttached: boolean;
  workSuggested: boolean;
  onStartProject: () => void;
  onInvite: () => void;
  onAttachAgent: () => void;
  onSuggestWork: () => void;
  onQueue: () => void;
}) {
  const primaryOpportunity = demoProject.opportunities[0];

  return (
    <section className="page-grid project-room-grid">
      <header className="project-room-hero wide">
        <div className="project-hero-copy">
          <span className="project-kicker">Projects / {demoProject.name}</span>
          <h1>{demoProject.name}</h1>
          <p>{demoProject.purpose}</p>
          <div className="tag-row">
            <span className="status-pill safe">Active</span>
            {demoProject.lanes.map((lane) => (
              <span className="status-pill" key={lane}>
                {lane}
              </span>
            ))}
          </div>
        </div>
        <div className="project-hero-actions">
          <button className="primary-action" onClick={onSuggestWork}>
            {workSuggested ? "Project lead ready" : "Suggest project work"}
          </button>
          <button className="secondary-action" onClick={onQueue}>
            Find sourced work
          </button>
        </div>
      </header>

      {projectStarted && (
        <div className="project-action-banner wide" role="status">
          <div>
            <strong>Project started</strong>
            <span>Invite a contributor or attach an agent.</span>
          </div>
          <span className="status-pill safe">Launch draft</span>
        </div>
      )}

      <div className="project-room-main wide">
        <section className="panel project-opportunities-panel wide">
          <div className="section-heading">
            <div>
              <p className="small-label">Project work</p>
              <h2>Work in this project.</h2>
            </div>
            <span className="status-pill safe">
              Best: {primaryOpportunity.title}
            </span>
          </div>
          <div className="project-opportunity-list">
            {workSuggested && (
              <div className="project-opportunity-row project-opportunity-new">
                <span className="opportunity-icon">+</span>
                <div>
                  <strong>Project Work Lead created</strong>
                  <small>Clarify before Mission</small>
                </div>
                <button className="secondary-action" onClick={onQueue}>
                  Triage
                </button>
              </div>
            )}
            {demoProject.opportunities.slice(0, 3).map((item) => (
              <OpportunityRow
                key={item.title}
                title={item.title}
                detail={item.detail}
                reward={item.reward}
                safety={item.safety}
                proofability={item.proofability}
                action={item.action}
                onQueue={onQueue}
              />
            ))}
          </div>
          <button className="secondary-action full" onClick={onQueue}>
            Open sourced inventory
          </button>
        </section>
      </div>

      <details className="project-detail-drawer wide">
        <summary>Sources, ledger, and V2 signals</summary>
        <div className="project-detail-drawer-body">
          <div>
            <h3>Sources</h3>
            {demoSourceConnections.map((source) => (
              <div className="project-flow-card" key={source.name}>
                <strong>{source.name}</strong>
                <small>
                  {source.state} · {source.detail}
                </small>
              </div>
            ))}
          </div>
          <div>
            <h3>Proof ledger</h3>
            {demoProjectLedgerRows.map((row) => (
              <div className="project-flow-card" key={row.proof}>
                <strong>{row.work}</strong>
                <small>
                  {row.source} · {row.status} · {row.value}
                </small>
              </div>
            ))}
          </div>
          <div>
            <h3>People and next signals</h3>
            <button className="secondary-action full" onClick={onInvite}>
              {inviteSent ? "Invite pending" : "Invite contributor"}
            </button>
            {inviteSent && (
              <CompactPerson
                name="sam@builder.dev"
                role="Contributor invite"
                status="Pending"
                tone="warning"
              />
            )}
            {demoProject.peopleRoster.slice(0, 2).map((person) => (
              <CompactPerson
                key={person.name}
                name={person.name}
                role={person.role}
                status={person.status}
                tone={person.status === "Pending" ? "warning" : "safe"}
              />
            ))}
            <button className="secondary-action full" onClick={onStartProject}>
              {projectStarted ? "Project started" : "Start project"}
            </button>
            {demoV2Signals.map((signal) => (
              <div className="benefit-row" key={signal}>
                <div>
                  <strong>V2</strong>
                  <small>{signal}</small>
                </div>
                <span>Planned</span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}
