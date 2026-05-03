import React from "react";
import { PageHeader, PageSurface, RowList, StatusRow } from "../components/ui";

const helpRows = [
  ["Opportunity", "Sourced work that may become a mission"],
  ["Mission", "Runnable proof scope with owner, value, and safety"],
  ["Packet", "Reviewable evidence for a maintainer"],
  ["Credit", "Accepted contribution record"],
  ["Earned", "Accepted proof with value recorded"],
  ["Released", "External payout or receipt marked paid"]
];

const policyRows = [
  ["Agent can", "Run commands and package evidence", "good"],
  ["Agent cannot", "Post, open PRs, access secrets, or spend", "bad"],
  ["Submission", "Requires human approval", "good"],
  ["Raw logs", "Private unless explicitly exported", "good"]
] as const;

export function HelpScreen({
  onStart,
  onSettings
}: {
  onStart: () => void;
  onSettings: () => void;
}) {
  return (
    <PageSurface className="wide pf-help-surface">
      <PageHeader
        eyebrow="Help"
        title="ProofForge in plain terms."
        subtitle="Reference material only. You do not need this page to finish the demo flow."
        actions={
          <button className="primary-action" onClick={onStart}>
            Start proof flow
          </button>
        }
      />

      <div className="pf-help-layout">
        <RowList className="pf-help-table">
          <div className="pf-help-row head">
            <span>Term</span>
            <span>Meaning</span>
          </div>
          {helpRows.map(([term, meaning]) => (
            <div className="pf-help-row" key={term}>
              <strong>{term}</strong>
              <span>{meaning}</span>
            </div>
          ))}
        </RowList>

        <aside className="pf-help-detail">
          <p className="small-label">Rules</p>
          <h2>Proof before payout.</h2>
          {policyRows.map(([label, value, tone]) => (
            <StatusRow key={label} label={label} value={value} tone={tone} />
          ))}
          <button className="secondary-action full" onClick={onSettings}>
            Open Settings
          </button>
        </aside>
      </div>
    </PageSurface>
  );
}
