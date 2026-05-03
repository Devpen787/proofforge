import React from "react";
import { demoAgentIdentity, demoRunnerTrace } from "../demo";
import { getMissionDisplay } from "../app/missionDisplay";
import type {
  ActiveMission,
  ImportedMission,
  ProjectRequest
} from "../app/types";
import {
  PageHeader,
  PageSurface,
  RunnerTimeline,
  StatusRow
} from "../components/ui";

function buildRunnerOutput(
  activeMission: ActiveMission,
  mission: ReturnType<typeof getMissionDisplay>,
  projectRequest: ProjectRequest,
  importedMission: ImportedMission | null
) {
  if (activeMission === "request") {
    return `$ npm run proof:project-request
source=project request
project=${projectRequest.projectName}
accepted_by=${projectRequest.acceptanceOwner}
allowed=local checks, logs, evidence packaging
blocked=public posts, PRs, secrets, funds

Running bounded proof for project request...
Evidence captured for contributor review.

Artifacts written:
runner-result.json
request-evidence.json
environment.json`;
  }

  if (activeMission === "github" && importedMission) {
    return `$ npm run proof:github -- --url ${importedMission.sourceUrl}
source=${importedMission.sourceUrl}
repo=${importedMission.repo}
accepted_by=${importedMission.acceptanceOwner}
blocked=GitHub comments, PRs, secrets, funds

Assessing imported GitHub issue...
Proof target: ${importedMission.objective}
Evidence captured for maintainer review.

Artifacts written:
github-source.json
runner-result.json
environment.json`;
  }

  return `$ npm run proof:check -- --mission ${activeMission}
source=${mission.sourceUrl}
skill=bounded repository verification
allowed=local checks, logs, environment manifest
blocked=PRs, comments, secrets, funds

Running ${mission.title.toLowerCase()}...
Verifier checked command output and required artifacts.
Packet draft created for human review.

Artifacts written:
runner-result.json
stdout.log
stderr.log
environment.json`;
}

export function RunnerScreen({
  activeMission,
  projectRequest,
  importedMission,
  agentRegistered,
  onCancel,
  onPacket,
  onAgentSetup
}: {
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  agentRegistered: boolean;
  onCancel: () => void;
  onPacket: () => void;
  onAgentSetup: () => void;
}) {
  const mission = getMissionDisplay({
    activeMission,
    projectRequest,
    importedMission
  });
  const output = buildRunnerOutput(
    activeMission,
    mission,
    projectRequest,
    importedMission
  );
  const seededRegistered =
    new URLSearchParams(window.location.search).get("seed") === "registered";

  if (!agentRegistered && !seededRegistered) {
    return (
      <section className="page-grid runner-grid">
        <PageSurface className="wide pf-runner-surface">
          <PageHeader
            eyebrow="Runner blocked"
            title="Register a proof node first."
            subtitle="The run needs a local agent identity so limits, evidence, and credit roll up to the right owner."
            actions={
              <button className="primary-action" onClick={onAgentSetup}>
                Set up proof node
              </button>
            }
          />
          <div className="pf-runner-rail inline">
            <StatusRow label="Run" value="Blocked" tone="bad" />
            <StatusRow label="External actions" value="Locked" tone="good" />
            <StatusRow label="Credit owner" value="Missing" tone="bad" />
          </div>
        </PageSurface>
      </section>
    );
  }

  return (
    <section className="page-grid runner-grid">
      <PageSurface className="wide pf-runner-surface">
        <PageHeader
          eyebrow="Runner"
          title="Bounded run completed."
          subtitle={mission.title}
          actions={
            <>
              <button className="danger-action" onClick={onCancel}>
                Cancel run
              </button>
              <button className="primary-action" onClick={onPacket}>
                Review packet
              </button>
            </>
          }
        />

        <div className="pf-runner-layout">
          <div className="pf-runner-main">
            <section className="pf-runner-status">
              <p className="small-label">Execution state</p>
              <h2>No external action was taken.</h2>
              <p>
                The proof node ran the allowed local command, captured evidence,
                and prepared a draft packet for human review.
              </p>
              <RunnerTimeline steps={demoRunnerTrace} />
            </section>

            <section className="pf-runner-terminal">
              <div className="pf-terminal-head">
                <h2>Live output</h2>
                <span className="status-pill safe">Evidence-only</span>
              </div>
              <pre>{output}</pre>
            </section>
          </div>

          <aside className="pf-runner-rail">
            <p className="small-label">Run control</p>
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

            <div className="pf-output-preview">
              <p className="small-label">Packet output</p>
              {[
                "evidence-packet.json",
                "case-file.md",
                "policy.json",
                "environment.json"
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <button className="primary-action full" onClick={onPacket}>
              Open case file
            </button>
          </aside>
        </div>
      </PageSurface>
    </section>
  );
}
