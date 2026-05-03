import React from "react";
import { demoAgentIdentity, getDemoMission, demoRunnerTrace } from "../demo";
import type { ActiveMission } from "../app/types";
import { RunnerTimeline, StatusRow } from "../components/ui";

export function RunnerScreen({
  activeMission,
  agentRegistered,
  onCancel,
  onPacket,
  onAgentSetup
}: {
  activeMission: ActiveMission;
  agentRegistered: boolean;
  onCancel: () => void;
  onPacket: () => void;
  onAgentSetup: () => void;
}) {
  const mission = getDemoMission(activeMission);
  const output =
    activeMission === "checkout"
      ? `$ npm run proof:browser

Agent assessment:
source=external marketplace task
skill=browser QA
allowed=local browser checks, screenshots, console logs
blocked=real payments, customer data, public submission

Checking checkout flow in Chrome and Safari...
Chrome checkout completed with expected confirmation.
Safari confirmation logs are incomplete.

Artifacts written:
browser-report.json
chrome.png
safari.png
environment.json`
      : activeMission === "docs"
        ? `$ npm run proof:check

Agent assessment:
source=GitHub issue + repo fixture
skill=docs validation
allowed=local command, logs, environment manifest
blocked=PRs, comments, secrets, funds

Checking documented install flow...
Missing docs-ready.flag. The documented setup is incomplete.

Artifacts written:
runner-result.json
stdout.log
stderr.log
environment.json`
        : `$ npm run proof:check -- --mission ${activeMission}

Agent assessment:
source=${mission.sourceUrl}
skill=bounded repository verification
allowed=local checks, logs, environment manifest
blocked=PRs, comments, secrets, funds

Running ${mission.title.toLowerCase()}...
Evidence captured for maintainer review.

Artifacts written:
runner-result.json
stdout.log
stderr.log
environment.json`;

  if (!agentRegistered) {
    return (
      <section className="page-grid runner-grid">
        <header className="page-header">
          <span>Runner / {mission.title}</span>
        </header>
        <div className="runner-hero wide">
          <div>
            <p className="small-label">Proof node required</p>
            <h2>Register the worker before running proof.</h2>
            <p>
              ProofForge needs a local agent identity so evidence, limits, and
              credit roll up to the right owner.
            </p>
            <button className="primary-action" onClick={onAgentSetup}>
              Set up proof node
            </button>
          </div>
          <div className="runner-hero-stats">
            <StatusRow label="Run" value="Blocked" tone="bad" />
            <StatusRow label="External actions" value="Locked" tone="good" />
            <StatusRow label="Credit owner" value="Missing" tone="bad" />
          </div>
        </div>
      </section>
    );
  }

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
          <h2>Bounded agent run completed.</h2>
          <p>
            The proof node assessed the source, ran only the allowed local
            command, captured evidence, and kept external actions locked.
          </p>
          <button className="primary-action" onClick={onPacket}>
            Review evidence packet
          </button>
        </div>
        <div className="runner-hero-stats">
          <StatusRow
            label="Proof node"
            value={demoAgentIdentity.id}
            tone="good"
          />
          <StatusRow
            label="Owner"
            value={demoAgentIdentity.owner}
            tone="good"
          />
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
            <h2>Assessment, run, verification, packet.</h2>
          </div>
          <span className="status-pill safe">No external action</span>
        </div>
        <RunnerTimeline steps={demoRunnerTrace} />
      </section>
    </section>
  );
}
