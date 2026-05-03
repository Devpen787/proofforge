import React from "react";
import { demoMission } from "../demo";
import { StatusBlock } from "../components/ui";

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
            <p className="small-label">Starter mission</p>
            <h1>{demoMission.title}</h1>
            <p>
              Run the docs install check locally. Nothing is submitted or paid
              until review.
            </p>
            <button
              className="primary-action first-run-primary"
              onClick={onRun}
            >
              Run safest earning mission
            </button>
          </div>

          <aside className="first-run-terms-card">
            <StatusBlock label="Repo" value={demoMission.repo} />
            <StatusBlock label="Risk" value={demoMission.risk} />
            <StatusBlock label="Runtime" value={demoMission.runtime} />
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
