import React from "react";
import {
  demoBuilderPassport,
  demoObservedContributions,
  demoPassportSignals,
  demoProjectRecommendations
} from "../demo";
import { PageHeader, PageSurface, RowList, StatusRow } from "../components/ui";

export function BuilderPassportScreen({
  onWork,
  onProjects
}: {
  onWork: () => void;
  onProjects: () => void;
}) {
  return (
    <PageSurface className="wide pf-passport-surface">
      <PageHeader
        eyebrow="Passport"
        title={demoBuilderPassport.displayName}
        subtitle="Portable contribution history. Observed work becomes credit only after accepted proof."
        actions={
          <button className="primary-action" onClick={onWork}>
            Open My Work
          </button>
        }
      />

      <div className="pf-passport-strip">
        <StatusRow
          label="Observed"
          value={String(demoBuilderPassport.observedCount)}
          tone="good"
        />
        <StatusRow
          label="Accepted proof"
          value={String(demoBuilderPassport.acceptedProofCount)}
          tone="good"
        />
        <StatusRow
          label="Agent runs"
          value={String(demoBuilderPassport.agentRunCount)}
          tone="good"
        />
        <StatusRow
          label="Proof points"
          value={String(demoBuilderPassport.proofPoints)}
          tone="good"
        />
      </div>

      <div className="pf-passport-layout">
        <RowList className="pf-passport-table">
          <div className="pf-passport-row head">
            <span>Contribution</span>
            <span>Project</span>
            <span>Source</span>
            <span>Status</span>
            <span>Value</span>
          </div>
          {demoObservedContributions.map((item) => (
            <div className="pf-passport-row" key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.project}</span>
              <span>{item.source}</span>
              <span>{item.status}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </RowList>

        <aside className="pf-passport-detail">
          <p className="small-label">@{demoBuilderPassport.handle}</p>
          <h2>Agent work rolls up here.</h2>
          {demoPassportSignals.map((signal) => (
            <StatusRow
              key={signal.label}
              label={signal.label}
              value={signal.value}
              tone={signal.tone}
            />
          ))}
          <div className="pf-specialty-list">
            {demoBuilderPassport.specialties.map((specialty) => (
              <span key={specialty}>{specialty}</span>
            ))}
          </div>
        </aside>
      </div>

      <section className="pf-support-section">
        <div>
          <p className="small-label">Recommended next work</p>
          <h2>History improves matching.</h2>
        </div>
        <RowList className="pf-recommendation-list">
          {demoProjectRecommendations.map((item) => (
            <button
              className="pf-recommendation-row"
              key={item.project}
              onClick={onProjects}
            >
              <strong>{item.project}</strong>
              <span>{item.reason}</span>
              <b>{item.next}</b>
            </button>
          ))}
        </RowList>
      </section>
    </PageSurface>
  );
}
