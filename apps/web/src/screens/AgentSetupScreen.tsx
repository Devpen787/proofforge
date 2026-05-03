import React from "react";
import { demoAgentIdentity } from "../demo";
import { StatusRow } from "../components/ui";

const permissionRows = [
  {
    label: "Repository access",
    allowed: "Clone public repos",
    blocked: "Private repos"
  },
  {
    label: "Execution",
    allowed: "Run commands",
    blocked: "Spend funds"
  },
  {
    label: "Evidence",
    allowed: "Capture logs",
    blocked: "Expose secrets"
  },
  {
    label: "Submission",
    allowed: "Package evidence",
    blocked: "PRs or comments"
  }
];

export function AgentSetupScreen({
  registered,
  onRegister,
  onStart
}: {
  registered: boolean;
  onRegister: () => void;
  onStart: () => void;
}) {
  return (
    <section className="page-grid agent-setup-grid">
      <div className="agent-setup-hero wide">
        <div>
          <p className="small-label">Agent / Node Setup</p>
          <h1>Register the agent that will do the work.</h1>
          <p>Connect the worker you want credited for completed proof work.</p>
          <div className="home-actions">
            <button
              className="primary-action"
              onClick={registered ? onStart : onRegister}
            >
              {registered ? "Find source-backed work" : "Register proof node"}
            </button>
            {!registered && (
              <button className="secondary-action" onClick={onStart}>
                Browse work first
              </button>
            )}
          </div>
        </div>
        <aside className="agent-id-card">
          <span className="status-pill safe">
            {registered ? "Registered" : "Local profile"}
          </span>
          <strong>{demoAgentIdentity.id}</strong>
          <small>{demoAgentIdentity.owner} owns this proof node</small>
          <StatusRow label="Status" value="Ready for work" tone="good" />
          <StatusRow label="ENS" value={demoAgentIdentity.ensRef} tone="good" />
        </aside>
      </div>

      <section className="agent-command-panel wide">
        <div className="agent-command-header">
          <div>
            <p className="small-label">Agent profile</p>
            <h2>Skills and limits.</h2>
          </div>
          <StatusRow
            label="Project"
            value={demoAgentIdentity.project}
            tone="good"
          />
          <StatusRow
            label="Credit"
            value={`${demoAgentIdentity.acceptedProofs} proofs / ${demoAgentIdentity.earnedCredit}`}
            tone="good"
          />
        </div>

        <div className="agent-skill-row">
          {demoAgentIdentity.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>

        <div className="agent-permission-table">
          {permissionRows.map((row) => (
            <div key={row.label}>
              <strong>{row.label}</strong>
              <span>{row.allowed}</span>
              <b>{row.blocked}</b>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
