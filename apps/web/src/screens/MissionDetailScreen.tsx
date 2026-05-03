import React from "react";
import {
  demoConvertedMission,
  demoConvertedPacket,
  demoMission,
  demoMissionTerms,
  demoPacket,
  demoWorkLead
} from "../demo";
import type { ActiveMission } from "../app/types";
import { StatusBlock, StatusRow } from "../components/ui";

export function MissionDetailScreen({
  activeMission,
  onBack,
  onAccept
}: {
  activeMission: ActiveMission;
  onBack: () => void;
  onAccept: () => void;
}) {
  const mission =
    activeMission === "checkout" ? demoConvertedMission : demoMission;
  const packet =
    activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const owner =
    activeMission === "checkout"
      ? demoWorkLead.acceptsProof
      : "Commons reviewer";
  const successCriteria =
    activeMission === "checkout"
      ? [
          "Chrome checkout completes with expected confirmation",
          "Safari result is captured with logs",
          "No payment credentials or customer data are exposed"
        ]
      : [
          "Documented command is run in a clean fixture",
          "Failure or success is captured with logs",
          "Maintainer can understand the next fix"
        ];
  const sourceLabel =
    activeMission === "checkout" ? "Marketplace task" : "GitHub issue";
  const valueLabel =
    activeMission === "checkout" ? "$25 if accepted" : "$8 if accepted";

  return (
    <section className="page-grid mission-detail-grid">
      <header className="page-header">
        <span>Mission Detail / {mission.title}</span>
        <button className="secondary-action" onClick={onBack}>
          Back to Opportunities
        </button>
      </header>
      <div className="mission-decision-hero wide">
        <div>
          <p className="small-label">Ready to run</p>
          <h2>{mission.title}</h2>
          <p>{packet.objective}</p>
          <div className="mission-detail-facts">
            <StatusBlock label="Accepts proof" value={owner} />
            <StatusBlock label="Risk" value={mission.risk} />
            <StatusBlock label="Runtime" value={mission.runtime} />
            <StatusBlock label="Source" value={mission.repo} />
          </div>
        </div>
        <aside className="mission-run-card">
          <span>Earn if accepted</span>
          <strong>{mission.reward}</strong>
          <small>{mission.valuePath}</small>
          <button className="primary-action full" onClick={onAccept}>
            Accept and run
          </button>
        </aside>
      </div>
      <div className="panel mission-review-panel wide">
        <div className="mission-review-header">
          <div>
            <p className="small-label">Before you run</p>
            <h2>Confirm the work.</h2>
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
            <h3>Mission terms</h3>
            <div className="mission-source-grid">
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
