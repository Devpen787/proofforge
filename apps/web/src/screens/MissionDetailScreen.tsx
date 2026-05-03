import React from "react";
import {
  demoAgentIdentity,
  demoMissionTerms,
  demoWorkLead,
  getDemoMission,
  getDemoPacket
} from "../demo";
import type { ActiveMission, ProjectRequest } from "../app/types";
import { StatusBlock, StatusRow } from "../components/ui";

export function MissionDetailScreen({
  activeMission,
  projectRequest,
  onBack,
  onAccept
}: {
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  onBack: () => void;
  onAccept: () => void;
}) {
  const mission = getDemoMission(activeMission);
  const packet = getDemoPacket(activeMission);
  const owner =
    activeMission === "request"
      ? projectRequest.acceptanceOwner
      : activeMission === "checkout"
        ? demoWorkLead.acceptsProof
        : "Commons reviewer";
  const missionTitle =
    activeMission === "request" ? projectRequest.title : mission.title;
  const missionObjective =
    activeMission === "request" ? projectRequest.detail : packet.objective;
  const missionReward =
    activeMission === "request" ? projectRequest.reward : mission.reward;
  const missionRepo =
    activeMission === "request" ? projectRequest.projectName : mission.repo;
  const successCriteria =
    activeMission === "request"
      ? [
          "Project steward request is attached",
          "Acceptance owner and value are clear",
          "Evidence packet can prove the requested outcome"
        ]
      : activeMission === "checkout"
        ? [
            "Chrome checkout completes with expected confirmation",
            "Safari result is captured with logs",
            "No payment credentials or customer data are exposed"
          ]
        : activeMission === "docs"
          ? [
              "Documented command is run in a clean fixture",
              "Failure or success is captured with logs",
              "Maintainer can understand the next fix"
            ]
          : mission.submissionRequirements.slice(0, 3);
  const sourceLabel =
    activeMission === "request"
      ? "Project request"
      : activeMission === "checkout"
        ? "Marketplace task"
        : mission.sourceUrl.includes("github.com")
          ? "GitHub issue"
          : "Project backlog";
  const valueLabel = `${missionReward} if accepted`;
  const agentChecks =
    activeMission === "checkout"
      ? [
          "Confirmed browser targets after clarification",
          "Can capture screenshots and console logs",
          "Cannot touch payment credentials or customer data"
        ]
      : activeMission === "docs"
        ? [
            "Checked public source issue and repo fixture",
            "Can run the documented install command locally",
            "Cannot post comments, open PRs, or spend funds"
          ]
        : [
            `Checked ${sourceLabel.toLowerCase()} and repo fixture`,
            "Can run bounded local checks and capture evidence",
            "Cannot post comments, open PRs, or spend funds"
          ];

  return (
    <section className="page-grid mission-detail-grid">
      <header className="page-header">
        <span>Mission Detail / {missionTitle}</span>
        <button className="secondary-action" onClick={onBack}>
          Back to Opportunities
        </button>
      </header>
      <div className="mission-decision-hero wide">
        <div>
          <p className="small-label">Agent assessment</p>
          <h2>{missionTitle}</h2>
          <p>{missionObjective}</p>
          <div className="mission-detail-facts">
            <StatusBlock label="Accepts proof" value={owner} />
            <StatusBlock label="Risk" value={mission.risk} />
            <StatusBlock label="Runtime" value={mission.runtime} />
            <StatusBlock label="Source" value={missionRepo} />
          </div>
        </div>
        <aside className="mission-run-card">
          <span>Authorize bounded run</span>
          <strong>{missionReward}</strong>
          <small>{mission.valuePath}</small>
          <button className="primary-action full" onClick={onAccept}>
            Authorize agent run
          </button>
        </aside>
      </div>
      <div className="panel mission-review-panel wide">
        <div className="mission-review-header">
          <div>
            <p className="small-label">Before you run</p>
            <h2>Confirm the source, agent fit, and proof target.</h2>
          </div>
          <StatusRow label="Source" value={sourceLabel} tone="good" />
          <StatusRow label="Value" value={valueLabel} tone="good" />
        </div>

        <div className="mission-review-grid">
          <div>
            <h3>Success criteria</h3>
            <div className="mission-criteria-list">
              {successCriteria.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div>
            <h3>Agent assessment</h3>
            <div className="mission-criteria-list">
              {agentChecks.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div>
            <h3>Mission terms</h3>
            <div className="mission-source-grid">
              <StatusRow
                label="Proof node"
                value={demoAgentIdentity.id}
                tone="good"
              />
              {demoMissionTerms.map((term) => (
                <StatusRow
                  key={term.label}
                  label={term.label}
                  value={term.label === "Acceptance owner" ? owner : term.value}
                  tone="good"
                />
              ))}
            </div>
          </div>
        </div>

        <details className="mission-detail-disclosure">
          <summary>
            <span>Details</span>
            <b>No external action</b>
          </summary>
          <div className="mission-detail-disclosure-grid">
            <div>
              <h3>Source requirements</h3>
              <StatusRow
                label="Source URL"
                value={mission.sourceUrl}
                tone="good"
              />
              <StatusRow
                label="Value path"
                value={mission.valuePath}
                tone="good"
              />
              {mission.submissionRequirements.map((requirement) => (
                <StatusRow
                  key={requirement}
                  label={requirement}
                  value="Required"
                  tone="good"
                />
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
