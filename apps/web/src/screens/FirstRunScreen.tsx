import React from "react";
import { demoAgentIdentity, demoMission } from "../demo";
import { StatusBlock, StatusRow } from "../components/ui";

export function FirstRunScreen({
  onRun,
  onQueue
}: {
  onRun: () => void;
  onQueue: () => void;
}) {
  return (
    <section className="page-grid first-run-grid first-run-focused">
      <header className="page-header">
        <span>First Run</span>
        <button className="secondary-action" onClick={onQueue}>
          Choose another mission
        </button>
      </header>

      <section className="first-run-contract wide">
        <div className="first-run-contract-body">
          <div className="first-run-contract-copy">
            <p className="small-label">Agent-recommended mission</p>
            <h1>{demoMission.title}</h1>
            <p>
              Your proof node matched this source to its docs-validation skill.
              Review what it can check before authorizing a run.
            </p>
            <button
              className="primary-action first-run-primary"
              onClick={onRun}
            >
              Review agent assessment
            </button>
          </div>

          <aside className="first-run-terms-card">
            <StatusRow
              label="Proof node"
              value={demoAgentIdentity.id}
              tone="good"
            />
            <StatusBlock label="Repo" value={demoMission.repo} />
            <StatusRow
              label="Skill match"
              value="Docs validation"
              tone="good"
            />
            <StatusRow
              label="Allowed"
              value="Local command + logs"
              tone="good"
            />
            <StatusRow
              label="Blocked"
              value="PRs, comments, funds"
              tone="bad"
            />
            <StatusBlock
              label="Reward"
              value={`${demoMission.reward} + rep + credits`}
            />
          </aside>
        </div>
      </section>
    </section>
  );
}
