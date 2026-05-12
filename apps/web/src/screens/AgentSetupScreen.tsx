import React from "react";
import { demoAgentIdentity } from "../demo";
import {
  ActionBar,
  DetailPane,
  PageHeader,
  PageSurface,
  StatusRow
} from "../components/ui";

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
  onStart,
  onSettings
}: {
  registered: boolean;
  onRegister: () => void;
  onStart: () => void;
  onSettings: () => void;
}) {
  return (
    <section className="page-grid agent-setup-grid">
      <PageSurface className="wide pf-agent-surface">
        <PageHeader
          eyebrow="Agent setup"
          title="Register the proof node."
          subtitle="This node can run, verify, and package evidence. Credit rolls up to Alex after accepted proof."
          actions={
            <button
              className="primary-action"
              onClick={registered ? onStart : onRegister}
            >
              {registered ? "Find source-backed work" : "Register proof node"}
            </button>
          }
        />

        <div className="pf-agent-layout">
          <div>
            <div className="pf-agent-identity">
              <span className="status-pill safe">
                {registered ? "Registered" : "Local profile"}
              </span>
              <strong>{demoAgentIdentity.id}</strong>
              <small>{demoAgentIdentity.owner} owns this proof node</small>
            </div>

            <div className="pf-agent-skills">
              {demoAgentIdentity.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <div className="pf-permission-table">
              <div className="pf-permission-head">
                <span>Area</span>
                <span>Allowed</span>
                <span>Blocked</span>
              </div>
              {permissionRows.map((row) => (
                <div key={row.label}>
                  <strong>{row.label}</strong>
                  <span>{row.allowed}</span>
                  <b>{row.blocked}</b>
                </div>
              ))}
            </div>
          </div>

          <DetailPane eyebrow="Credit owner" title="Rolls up to Alex">
            <StatusRow label="Status" value="Ready for work" tone="good" />
            <StatusRow
              label="ENS"
              value={demoAgentIdentity.ensRef}
              tone="good"
            />
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
          </DetailPane>
        </div>

        <ActionBar>
          {!registered ? (
            <button className="secondary-action" onClick={onStart}>
              Browse work first
            </button>
          ) : null}
          <button className="secondary-action" onClick={onSettings}>
            Policy settings
          </button>
        </ActionBar>
      </PageSurface>
    </section>
  );
}
