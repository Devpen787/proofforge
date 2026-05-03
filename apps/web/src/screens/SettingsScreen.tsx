import React from "react";
import { demoAgentIdentity } from "../demo";
import { StatusRow } from "../components/ui";

export function SettingsScreen({
  agentRegistered,
  onAgentSetup,
  onHelp,
  onExport,
  onReset
}: {
  agentRegistered: boolean;
  onAgentSetup: () => void;
  onHelp: () => void;
  onExport: () => void;
  onReset: () => void;
}) {
  return (
    <section className="page-grid utility-grid">
      <div className="utility-hero wide">
        <div>
          <p className="small-label">Settings</p>
          <h1>Connections, agent, payout preferences.</h1>
          <p>
            Configure the rails once. Keep the work screens focused on doing the
            work.
          </p>
        </div>
        <button className="primary-action" onClick={onAgentSetup}>
          {agentRegistered ? "Review agent" : "Set up proof node"}
        </button>
      </div>

      <section className="panel utility-panel">
        <p className="small-label">Sources</p>
        <h2>Work imports</h2>
        <StatusRow label="GitHub" value="Issue import ready" tone="good" />
        <StatusRow label="Marketplace" value="Manual import" tone="good" />
        <StatusRow label="Project backlog" value="Demo source" tone="good" />
      </section>

      <section className="panel utility-panel">
        <p className="small-label">Agent</p>
        <h2>{demoAgentIdentity.id}</h2>
        <StatusRow
          label="Status"
          value={agentRegistered ? "Registered" : "Local profile"}
          tone={agentRegistered ? "good" : "bad"}
        />
        <StatusRow label="Identity" value="8004-ready" tone="good" />
        <StatusRow label="Skills" value="8239-ready" tone="good" />
      </section>

      <section className="panel utility-panel">
        <p className="small-label">Payout</p>
        <h2>Collection rules</h2>
        <StatusRow label="Method" value="Manual / external" tone="good" />
        <StatusRow label="Wallet" value="Receipt reference only" tone="bad" />
        <StatusRow label="Release" value="After acceptance" tone="good" />
      </section>

      <section className="panel utility-panel">
        <p className="small-label">Workspace</p>
        <h2>Local V1 state</h2>
        <StatusRow label="Storage" value="Browser local" tone="good" />
        <StatusRow label="Mode" value="Single user" tone="good" />
        <div className="settings-action-row">
          <button className="secondary-action" onClick={onExport}>
            Export workspace
          </button>
          <button className="danger-action" onClick={onReset}>
            Reset workspace
          </button>
        </div>
      </section>

      <details className="panel wide utility-disclosure">
        <summary>
          <span>
            <small className="small-label">Defaults</small>
            <strong>Privacy and safety policy</strong>
          </span>
          <b>Show</b>
        </summary>
        <div className="utility-rule-grid">
          {[
            ["Public comments", "Require approval"],
            ["Pull requests", "Require approval"],
            ["Secrets", "Never mounted"],
            ["Raw logs", "Private by default"],
            ["Local paths", "Masked"],
            ["Funds", "Never spent by agent"]
          ].map(([label, value]) => (
            <StatusRow key={label} label={label} value={value} tone="good" />
          ))}
        </div>
      </details>

      <button className="secondary-action utility-help-link" onClick={onHelp}>
        Open Help
      </button>
    </section>
  );
}
