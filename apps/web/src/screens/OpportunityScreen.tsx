import React from "react";
import {
  demoAgentIdentity,
  demoProject,
  demoWork,
  generatedProofSummary
} from "../demo";
import {
  DetailPane,
  MetricStrip,
  PageHeader,
  PageSurface,
  RowList
} from "../components/ui";
import type { ActiveMission } from "../app/types";

export function OpportunityScreen({
  agentRegistered,
  accepted,
  released,
  revisionRequested,
  rejected,
  onRelease,
  onResolveRevision,
  onStart,
  onAgentSetup,
  onPublicProof,
  onViewOpportunities
}: {
  agentRegistered: boolean;
  accepted: boolean;
  released: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  activeMission: ActiveMission;
  onRelease: () => void;
  onResolveRevision: () => void;
  onStart: () => void;
  onAgentSetup: () => void;
  onPublicProof: () => void;
  onViewOpportunities: () => void;
}) {
  const packetState = rejected
    ? "Rejected"
    : released
      ? "Released"
      : accepted
        ? "Earned"
        : revisionRequested
          ? "Revision requested"
          : "Ready to start";
  const heroTitle = !agentRegistered
    ? "Set up your proof node."
    : revisionRequested
      ? "Fix the packet."
      : rejected
        ? "Packet rejected."
        : accepted || released
          ? "Proof accepted."
          : "Find work. Prove it. Get credited.";
  const heroBody = !agentRegistered
    ? "Connect the local worker before running sourced tasks."
    : revisionRequested
      ? "A maintainer asked for a cleaner packet."
      : rejected
        ? "No payout was earned."
        : accepted && !released
          ? "Release the earned payout."
          : released
            ? "Public proof and credit are ready."
            : "Start with one safe task the runner can complete.";
  const primaryAction = !agentRegistered
    ? "Set up proof node"
    : revisionRequested
      ? "Open Case File"
      : released
        ? "View public proof"
        : accepted && !released
          ? "Release payout"
          : "Start sourced proof";
  const handlePrimary = !agentRegistered
    ? onAgentSetup
    : revisionRequested
      ? onResolveRevision
      : released
        ? onPublicProof
        : accepted && !released
          ? onRelease
          : onStart;
  const metrics = [
    {
      label: "Earned",
      value: accepted || released ? "$8" : "$0",
      detail: accepted || released ? "Accepted proof" : "No packet yet"
    },
    {
      label: "Pending release",
      value: accepted && !released ? "$8" : "$0",
      detail: released ? "Released" : "Manual release"
    },
    {
      label: "Project proofs",
      value: demoProject.acceptedProof,
      detail: demoProject.name
    },
    {
      label: "Open missions",
      value: String(demoProject.opportunities.length),
      detail: "Source-backed"
    }
  ];

  return (
    <section className="page-grid home-grid">
      <PageSurface className="pf-home-surface">
        <PageHeader
          eyebrow={packetState}
          title={heroTitle}
          subtitle={heroBody}
          actions={
            <button className="primary-action" onClick={handlePrimary}>
              {primaryAction}
            </button>
          }
        />

        <MetricStrip metrics={metrics} />

        <div className="pf-home-layout">
          <div>
            <div className="section-heading pf-compact-heading">
              <div>
                <p className="small-label">
                  {accepted || released ? "Accepted proof" : "Ready work"}
                </p>
                <h2>
                  {accepted || released
                    ? "Credit recorded. Keep moving."
                    : "Pick one sourced mission."}
                </h2>
              </div>
              <button className="link-button" onClick={onViewOpportunities}>
                View all
              </button>
            </div>

            {accepted || released ? (
              <div className="pf-proof-row">
                <span>
                  <small>Proof</small>
                  <strong>{generatedProofSummary.mission}</strong>
                </span>
                <span>
                  <small>Accepted by</small>
                  <strong>{generatedProofSummary.acceptedBy}</strong>
                </span>
                <span>
                  <small>Earned</small>
                  <strong>{generatedProofSummary.payout.amount}</strong>
                </span>
                <span>
                  <small>Release</small>
                  <strong>{released ? "Released" : "Pending"}</strong>
                </span>
              </div>
            ) : null}

            <RowList>
              {demoWork.slice(0, 3).map((work) => (
                <button
                  className="work-row pf-work-row"
                  key={work.title}
                  onClick={onStart}
                >
                  <span className="work-main">
                    <strong>{work.title}</strong>
                    <small>{work.repo}</small>
                  </span>
                  <span className="work-owner">
                    <small>Accepts proof</small>
                    <b>{work.owner}</b>
                  </span>
                  <b>{work.reward}</b>
                  <small>{work.runtime}</small>
                  <span className={`status-pill ${work.tone}`}>
                    {work.risk}
                  </span>
                  <span className="start-pill">Start</span>
                </button>
              ))}
            </RowList>
          </div>

          <DetailPane
            eyebrow="Proof node"
            title={agentRegistered ? demoAgentIdentity.id : "Not registered"}
            action={
              <button className="secondary-action full" onClick={onAgentSetup}>
                {agentRegistered ? "Review node" : "Set up node"}
              </button>
            }
          >
            <div className="status-row">
              <span>Owner</span>
              <b className="good">Alex</b>
            </div>
            <div className="status-row">
              <span>Project</span>
              <b className="good">{demoProject.name}</b>
            </div>
            <div className="status-row">
              <span>Current state</span>
              <b className={agentRegistered ? "good" : "warn"}>
                {agentRegistered ? "Ready" : "Setup needed"}
              </b>
            </div>
            <div className="status-row">
              <span>Public proof</span>
              <b className={accepted || released ? "good" : "warn"}>
                {accepted || released ? "Available" : "After acceptance"}
              </b>
            </div>
          </DetailPane>
        </div>
      </PageSurface>
    </section>
  );
}
