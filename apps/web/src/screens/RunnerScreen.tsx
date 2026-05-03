import React from "react";
import { demoConvertedMission, demoMission, demoRunnerTrace } from "../demo";
import type { ActiveMission } from "../app/types";
import { RunnerTimeline, StatusRow } from "../components/ui";

export function RunnerScreen({
  activeMission,
  onCancel,
  onPacket
}: {
  activeMission: ActiveMission;
  onCancel: () => void;
  onPacket: () => void;
}) {
  const mission =
    activeMission === "checkout" ? demoConvertedMission : demoMission;
  const output =
    activeMission === "checkout"
      ? `$ npm run proof:browser

Checking checkout flow in Chrome and Safari...
Chrome checkout completed with expected confirmation.
Safari confirmation logs are incomplete.

Artifacts written:
browser-report.json
chrome.png
safari.png
environment.json`
      : `$ npm run proof:check

Checking documented install flow...
Missing docs-ready.flag. The documented setup is incomplete.

Artifacts written:
runner-result.json
stdout.log
stderr.log
environment.json`;

  return (
    <section className="page-grid runner-grid">
      <header className="page-header">
        <span>Runner / {mission.title}</span>
        <button className="danger-action" onClick={onCancel}>
          Cancel Run
        </button>
      </header>
      <div className="runner-hero">
        <div>
          <p className="small-label">Run complete</p>
          <h2>Docs issue found.</h2>
          <p>
            The install check failed in a clean workspace. Nothing has been
            posted.
          </p>
          <button className="primary-action" onClick={onPacket}>
            Approve Packet
          </button>
        </div>
        <div className="runner-hero-stats">
          <StatusRow
            label="Earn if accepted"
            value={mission.reward}
            tone="good"
          />
          <StatusRow label="External actions" value="Locked" tone="bad" />
          <StatusRow label="Packet state" value="Draft ready" tone="good" />
        </div>
      </div>
      <div className="terminal-card">
        <h2>Live output</h2>
        <pre>{output}</pre>
      </div>
      <section className="panel runner-timeline-panel wide">
        <div className="section-heading">
          <div>
            <p className="small-label">Proof trace</p>
            <h2>Evidence is ready for review.</h2>
          </div>
          <span className="status-pill safe">No external action</span>
        </div>
        <RunnerTimeline steps={demoRunnerTrace} />
      </section>
    </section>
  );
}
