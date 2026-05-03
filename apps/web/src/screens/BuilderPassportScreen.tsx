import React from "react";
import {
  demoBuilderPassport,
  demoHackathonPrizeReadiness,
  demoObservedContributions,
  demoPassportSignals,
  demoProjectRecommendations,
  demoV2CompletionItems,
  demoV2ConnectionRows
} from "../demo";
import { StatusBlock, StatusRow } from "../components/ui";

export function BuilderPassportScreen({
  onWork,
  onProjects
}: {
  onWork: () => void;
  onProjects: () => void;
}) {
  return (
    <section className="page-grid passport-grid">
      <div className="passport-hero wide">
        <div>
          <p className="small-label">Builder Passport / V2</p>
          <h1>{demoBuilderPassport.displayName}</h1>
          <p>
            Connected history, accepted proof, value signals, and agent work in
            one contribution graph.
          </p>
          <div className="home-actions">
            <button className="primary-action" onClick={onWork}>
              Continue current work
            </button>
            <button className="secondary-action" onClick={onProjects}>
              Open tracked projects
            </button>
          </div>
        </div>
        <aside className="passport-id-card">
          <span className="status-pill safe">Proof before credit</span>
          <strong>@{demoBuilderPassport.handle}</strong>
          <small>Observed work only becomes credit after accepted proof.</small>
        </aside>
      </div>

      <section className="passport-stats wide">
        <StatusBlock
          label="Observed"
          value={String(demoBuilderPassport.observedCount)}
        />
        <StatusBlock
          label="Accepted proof"
          value={String(demoBuilderPassport.acceptedProofCount)}
        />
        <StatusBlock
          label="Value signals"
          value={String(demoBuilderPassport.linkedValueSignalCount)}
        />
        <StatusBlock
          label="Agent runs"
          value={String(demoBuilderPassport.agentRunCount)}
        />
        <StatusBlock
          label="Proof points"
          value={String(demoBuilderPassport.proofPoints)}
        />
      </section>

      <section className="panel passport-panel">
        <div className="section-heading">
          <div>
            <p className="small-label">Contribution graph</p>
            <h2>Observed, accepted, linked.</h2>
          </div>
        </div>
        <div className="passport-row-list">
          {demoObservedContributions.map((item) => (
            <div className="passport-row" key={item.title}>
              <span>
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
                <b>{item.value}</b>
              </span>
            </div>
          ))}
        </div>
      </section>

      <aside className="panel passport-panel">
        <div className="section-heading">
          <div>
            <p className="small-label">Signals</p>
            <h2>Claim boundaries.</h2>
          </div>
        </div>
        {demoPassportSignals.map((signal) => (
          <StatusRow
            key={signal.label}
            label={signal.label}
            value={signal.value}
            tone={signal.tone}
          />
        ))}
        <div className="passport-specialties">
          {demoBuilderPassport.specialties.map((specialty) => (
            <span key={specialty}>{specialty}</span>
          ))}
        </div>
      </aside>

      <section className="panel passport-panel wide">
        <div className="section-heading">
          <div>
            <p className="small-label">Recommended next work</p>
            <h2>History improves the next mission.</h2>
          </div>
        </div>
        <div className="passport-recommendations">
          {demoProjectRecommendations.map((item) => (
            <button
              className="passport-recommendation"
              key={item.project}
              onClick={onProjects}
            >
              <span>
                <strong>{item.project}</strong>
                <small>{item.reason}</small>
              </span>
              <b>{item.next}</b>
            </button>
          ))}
        </div>
      </section>

      <section className="panel passport-panel wide">
        <div className="section-heading">
          <div>
            <p className="small-label">Hackathon prize readiness</p>
            <h2>Bounty requirements become proof fields.</h2>
          </div>
        </div>
        <div className="passport-prize-grid">
          {demoHackathonPrizeReadiness.map((item) => (
            <div className="passport-prize-item" key={item.label}>
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
              <b>{item.status}</b>
              <code>{item.field}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="panel passport-panel wide">
        <div className="section-heading">
          <div>
            <p className="small-label">V2 connection layer</p>
            <h2>Connected, persisted, proof-gated.</h2>
          </div>
        </div>
        <div className="passport-v2-grid">
          <div className="passport-v2-status">
            {demoV2CompletionItems.map((item) => (
              <StatusRow
                key={item.label}
                label={item.label}
                value={item.value}
                tone={item.tone}
              />
            ))}
          </div>
          <div className="passport-row-list">
            {demoV2ConnectionRows.map((row) => (
              <div className="passport-connection-row" key={row.label}>
                <span>
                  <strong>{row.label}</strong>
                  <small>{row.detail}</small>
                </span>
                <b>{row.status}</b>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
