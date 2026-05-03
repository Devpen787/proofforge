import React from "react";
import { demoAgentIdentity, demoMissionTerms } from "../demo";
import { getMissionDisplay } from "../app/missionDisplay";
import type {
  ActiveMission,
  ImportedMission,
  ProjectRequest
} from "../app/types";
import {
  ActionBar,
  DetailPane,
  PageHeader,
  PageSurface,
  RowList,
  StatusRow
} from "../components/ui";

function criteriaFor(activeMission: ActiveMission, imported: boolean) {
  if (activeMission === "request") {
    return [
      "Project steward request is attached",
      "Acceptance owner and value are clear",
      "Evidence packet can prove the requested outcome"
    ];
  }
  if (activeMission === "github" && imported) {
    return [
      "Original GitHub issue stays attached",
      "Proof target is derived from public issue context",
      "No comment or PR is posted without approval"
    ];
  }
  if (activeMission === "checkout") {
    return [
      "Chrome checkout completes with expected confirmation",
      "Safari result is captured with logs",
      "No payment credentials or customer data are exposed"
    ];
  }
  return [
    "Documented command runs in a clean fixture",
    "Failure or success is captured with logs",
    "Maintainer can understand the next fix"
  ];
}

function sourceKind(mission: ReturnType<typeof getMissionDisplay>) {
  if (mission.sourceUrl.startsWith("project://")) return "Project request";
  if (mission.sourceUrl.includes("github.com")) return "GitHub issue";
  if (mission.sourceLabel) return mission.sourceLabel;
  return "External source";
}

export function MissionDetailScreen({
  activeMission,
  projectRequest,
  importedMission,
  onBack,
  onAccept
}: {
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  onBack: () => void;
  onAccept: () => void;
}) {
  const mission = getMissionDisplay({
    activeMission,
    projectRequest,
    importedMission
  });
  const source = sourceKind(mission);
  const successCriteria = criteriaFor(activeMission, Boolean(importedMission));
  const packageFiles = [
    "evidence-packet.json",
    "case-file.md",
    "runner-result.json",
    "stdout.log"
  ];

  return (
    <section className="page-grid mission-detail-grid">
      <PageSurface>
        <PageHeader
          eyebrow="Mission preflight"
          title={mission.title}
          subtitle={mission.objective}
          actions={
            <button className="secondary-action" onClick={onBack}>
              Back to opportunities
            </button>
          }
        />

        <div className="pf-preflight-summary">
          <StatusRow label="Source" value={source} tone="good" />
          <StatusRow label="Accepts proof" value={mission.owner} tone="good" />
          <StatusRow label="Value" value={mission.reward} tone="good" />
          <StatusRow label="Safety" value={mission.risk} tone="good" />
          <StatusRow label="Runtime" value={mission.runtime} tone="good" />
        </div>

        <div className="pf-mission-layout">
          <div>
            <div className="pf-section-title">
              <p className="small-label">Requirements</p>
              <h2>Run only if this proof target is clear.</h2>
            </div>

            <RowList className="pf-check-list">
              {successCriteria.map((item) => (
                <div key={item}>
                  <span>✓</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </RowList>

            <div className="pf-proof-package">
              <div>
                <p className="small-label">Proof package</p>
                <h2>What the packet will include.</h2>
              </div>
              <div>
                {packageFiles.map((file) => (
                  <span key={file}>{file}</span>
                ))}
              </div>
            </div>

            <details className="pf-compact-details">
              <summary>Full requirements and source link</summary>
              <div>
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
            </details>
          </div>

          <DetailPane eyebrow="Bounded agent" title={demoAgentIdentity.id}>
            <StatusRow
              label="Owner"
              value={demoAgentIdentity.owner}
              tone="good"
            />
            <StatusRow
              label="Skills"
              value={demoAgentIdentity.skills.join(", ")}
              tone="good"
            />
            {demoMissionTerms.slice(3).map((term) => (
              <StatusRow
                key={term.label}
                label={term.label}
                value={term.value}
                tone="good"
              />
            ))}
            <div className="pf-agent-boundary">
              <span>Allowed: clone repo, run commands, capture logs.</span>
              <span>Blocked: PRs, comments, secrets, funds.</span>
            </div>
            <button className="primary-action full" onClick={onAccept}>
              Authorize bounded run
            </button>
          </DetailPane>
        </div>

        <ActionBar>
          <span className="status-pill safe">
            No external action before approval
          </span>
        </ActionBar>
      </PageSurface>
    </section>
  );
}
