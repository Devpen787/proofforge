import React from "react";
import { demoAgentIdentity } from "../demo";
import type { ProofEvent } from "../app/types";
import { PageHeader, PageSurface, RowList, StatusRow } from "../components/ui";

const policyRows = [
  {
    area: "Repository",
    allowed: "Clone public repositories",
    blocked: "Private repositories"
  },
  {
    area: "Execution",
    allowed: "Run bounded commands",
    blocked: "Spend funds"
  },
  {
    area: "Publishing",
    allowed: "Package evidence",
    blocked: "PRs and public comments"
  },
  {
    area: "Privacy",
    allowed: "Mask local paths",
    blocked: "Secrets in exported logs"
  }
];

export function TrustCenterScreen({
  agentRegistered,
  proofEvents,
  onAgentSetup,
  onSettings
}: {
  agentRegistered: boolean;
  proofEvents: ProofEvent[];
  onAgentSetup: () => void;
  onSettings: () => void;
}) {
  const recentEvents = proofEvents.slice(-4).reverse();

  return (
    <PageSurface className="wide pf-trust-surface">
      <PageHeader
        eyebrow="Trust Center"
        title="Capability, boundary, audit."
        subtitle="The agent can produce evidence. External action, funds, secrets, and public submission stay gated by humans."
        actions={
          <button className="primary-action" onClick={onAgentSetup}>
            Review agent
          </button>
        }
      />

      <div className="pf-trust-layout">
        <RowList>
          <div className="pf-trust-row head">
            <span>Area</span>
            <span>Allowed</span>
            <span>Blocked</span>
          </div>
          {policyRows.map((row) => (
            <div className="pf-trust-row" key={row.area}>
              <strong>{row.area}</strong>
              <span>{row.allowed}</span>
              <b>{row.blocked}</b>
            </div>
          ))}
        </RowList>

        <aside className="pf-trust-detail">
          <p className="small-label">Current node</p>
          <h2>{demoAgentIdentity.id}</h2>
          <StatusRow
            label="Status"
            value={agentRegistered ? "Registered" : "Local profile"}
            tone={agentRegistered ? "good" : "bad"}
          />
          <StatusRow
            label="Owner"
            value={demoAgentIdentity.owner}
            tone="good"
          />
          <StatusRow label="Skills" value="Declared only" tone="good" />
          <StatusRow
            label="Events"
            value={String(proofEvents.length)}
            tone="good"
          />
          <button className="secondary-action full" onClick={onSettings}>
            Integration settings
          </button>
        </aside>
      </div>

      <section className="pf-trust-audit">
        <p className="small-label">Audit trail</p>
        {recentEvents.length ? (
          recentEvents.map((event) => (
            <div className="pf-audit-row" key={event.id}>
              <strong>{event.type.replaceAll("_", " ")}</strong>
              <span>{event.eventHash}</span>
              <span>{event.signature ? "Signed" : "Unsigned"}</span>
            </div>
          ))
        ) : (
          <div className="pf-audit-row">
            <strong>No proof events yet</strong>
            <span>Run a packet to create the first audit hash.</span>
            <span>Waiting</span>
          </div>
        )}
      </section>
    </PageSurface>
  );
}
