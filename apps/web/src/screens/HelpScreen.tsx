import React from "react";
import { StatusRow } from "../components/ui";

const lifecycle = [
  "Source work",
  "Run agent",
  "Create packet",
  "Maintainer accepts",
  "Track value"
];

export function HelpScreen({
  onStart,
  onSettings
}: {
  onStart: () => void;
  onSettings: () => void;
}) {
  return (
    <section className="page-grid utility-grid">
      <div className="utility-hero wide">
        <div>
          <p className="small-label">Help</p>
          <h1>ProofForge in plain terms.</h1>
          <p>
            The product screens stay short. This page holds the definitions,
            rules, and payout semantics.
          </p>
        </div>
        <button className="primary-action" onClick={onStart}>
          Start proof flow
        </button>
      </div>

      <section className="panel wide utility-lifecycle">
        <p className="small-label">Lifecycle</p>
        <h2>Proof before payout.</h2>
        <div>
          {lifecycle.map((step, index) => (
            <span key={step}>
              <b>{index + 1}</b>
              {step}
            </span>
          ))}
        </div>
      </section>

      <section className="panel utility-panel">
        <p className="small-label">Glossary</p>
        <h2>Core terms</h2>
        <StatusRow label="Opportunity" value="Sourced work" tone="good" />
        <StatusRow label="Mission" value="Runnable proof scope" tone="good" />
        <StatusRow label="Packet" value="Reviewable evidence" tone="good" />
        <StatusRow label="Credit" value="Accepted contribution" tone="good" />
      </section>

      <section className="panel utility-panel">
        <p className="small-label">Payout</p>
        <h2>Earned is not released.</h2>
        <StatusRow label="Earned" value="Accepted proof" tone="good" />
        <StatusRow label="Released" value="Marked paid" tone="good" />
        <StatusRow label="Rejected" value="No payout" tone="bad" />
      </section>

      <section className="panel utility-panel">
        <p className="small-label">Agent safety</p>
        <h2>Useful, boxed in.</h2>
        <StatusRow label="Can" value="Run and package proof" tone="good" />
        <StatusRow label="Cannot" value="Post, PR, or spend" tone="bad" />
        <StatusRow label="Approval" value="Required to submit" tone="good" />
      </section>

      <button
        className="secondary-action utility-help-link"
        onClick={onSettings}
      >
        Open Settings
      </button>
    </section>
  );
}
