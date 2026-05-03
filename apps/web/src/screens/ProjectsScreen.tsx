import React from "react";
import {
  demoProject,
  demoProjectLedgerRows,
  demoAgentIdentity,
  demoSourceConnections
} from "../demo";
import type { ProjectRequest } from "../app/types";
import {
  DetailPane,
  MetricStrip,
  PageHeader,
  PageSurface,
  RowList,
  StatusRow
} from "../components/ui";

function CompactPerson({
  name,
  role,
  status,
  tone
}: {
  name: string;
  role: string;
  status: string;
  tone: "safe" | "warning";
}) {
  return (
    <div className="compact-person-row">
      <span className="mini-avatar">{name.charAt(0).toUpperCase()}</span>
      <div>
        <strong>{name}</strong>
        <small>{role}</small>
      </div>
      <span
        className={tone === "safe" ? "status-pill safe" : "status-pill warning"}
      >
        {status}
      </span>
    </div>
  );
}

function OpportunityRow({
  title,
  detail,
  reward,
  safety,
  proofability,
  action,
  onQueue
}: {
  title: string;
  detail: string;
  reward: string;
  safety: string;
  proofability: string;
  action: string;
  onQueue: () => void;
}) {
  return (
    <div className="pf-project-work-row">
      <span className="opportunity-icon">{action === "Run" ? "▶" : "◇"}</span>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
        <span className="project-opportunity-meta">
          {reward} · {safety} · {proofability} proofable
        </span>
      </div>
      <button
        className={action === "Run" ? "primary-action" : "secondary-action"}
        onClick={onQueue}
      >
        {action}
      </button>
    </div>
  );
}

export function ProjectsScreen({
  projectStarted,
  inviteSent,
  agentAttached,
  workSuggested,
  onSaveProject,
  onInvite,
  onAttachAgent,
  onSuggestWork,
  onQueue,
  projectRequest
}: {
  projectStarted: boolean;
  inviteSent: boolean;
  agentAttached: boolean;
  workSuggested: boolean;
  onStartProject: () => void;
  onSaveProject: (profile: {
    projectName: string;
    projectPurpose: string;
  }) => void;
  onInvite: (email?: string) => void;
  onAttachAgent: () => void;
  onSuggestWork: (request?: Partial<ProjectRequest>) => void;
  onQueue: () => void;
  projectRequest: ProjectRequest;
}) {
  const primaryOpportunity = demoProject.opportunities[0];
  const [projectName, setProjectName] = React.useState(
    projectRequest.projectName
  );
  const [projectPurpose, setProjectPurpose] = React.useState(
    projectRequest.projectPurpose
  );
  const [requestTitle, setRequestTitle] = React.useState(projectRequest.title);
  const [requestDetail, setRequestDetail] = React.useState(
    projectRequest.detail
  );
  const [requestReward, setRequestReward] = React.useState(
    projectRequest.reward
  );
  const [acceptanceOwner, setAcceptanceOwner] = React.useState(
    projectRequest.acceptanceOwner
  );
  const [inviteEmail, setInviteEmail] = React.useState(
    projectRequest.inviteEmail
  );
  const primaryAction = !projectStarted
    ? () => onSaveProject({ projectName, projectPurpose })
    : !workSuggested
      ? () =>
          onSuggestWork({
            title: requestTitle,
            detail: requestDetail,
            reward: requestReward,
            acceptanceOwner,
            inviteEmail
          })
      : inviteSent
        ? onQueue
        : () => onInvite(inviteEmail);
  const primaryLabel = !projectStarted
    ? "Save project"
    : !workSuggested
      ? "Create work request"
      : inviteSent
        ? "Review sent request"
        : "Send contributor request";
  const metrics = [
    {
      label: "Pool",
      value: demoProject.pool,
      detail: `${demoProject.proofLedger.availablePool} available`
    },
    { label: "Accepted proof", value: "12", detail: "project ledger" },
    { label: "People", value: "8", detail: "contributors" },
    { label: "Helpers", value: "2", detail: "agents and nodes" }
  ];
  const activeWork = [
    ["Running", "Validate install docs", "docs-runner-01 · 60%"],
    ["Review", "Starter guide clarity", "packet-4821 · waiting"],
    ["Accepted", "Ubuntu install flow", "+12 rep"]
  ];

  return (
    <section className="page-grid project-room-grid">
      <PageSurface className="wide pf-project-command">
        <PageHeader
          eyebrow={`Projects / ${demoProject.name}`}
          title={projectRequest.projectName}
          subtitle={projectRequest.projectPurpose}
          actions={
            <>
              <button className="primary-action" onClick={primaryAction}>
                {primaryLabel}
              </button>
              <button className="secondary-action" onClick={onQueue}>
                Find sourced work
              </button>
            </>
          }
        />

        <div className="tag-row">
          <span className="status-pill safe">Active</span>
          {demoProject.lanes.map((lane) => (
            <span className="status-pill" key={lane}>
              {lane}
            </span>
          ))}
        </div>

        <MetricStrip metrics={metrics} />

        {!projectStarted && (
          <div className="pf-project-inline-form">
            <input
              aria-label="Project name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />
            <input
              aria-label="Project purpose"
              value={projectPurpose}
              onChange={(event) => setProjectPurpose(event.target.value)}
            />
          </div>
        )}

        {projectStarted && !workSuggested && (
          <div className="pf-project-inline-form multi">
            <input
              aria-label="Work request title"
              value={requestTitle}
              onChange={(event) => setRequestTitle(event.target.value)}
            />
            <input
              aria-label="Evidence request"
              value={requestDetail}
              onChange={(event) => setRequestDetail(event.target.value)}
            />
            <input
              aria-label="Reward"
              value={requestReward}
              onChange={(event) => setRequestReward(event.target.value)}
            />
            <input
              aria-label="Acceptance owner"
              value={acceptanceOwner}
              onChange={(event) => setAcceptanceOwner(event.target.value)}
            />
            <input
              aria-label="Contributor email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
            />
          </div>
        )}

        <div className="pf-project-layout">
          <main className="pf-project-main">
            {workSuggested && (
              <div className="pf-project-request-row" role="status">
                <span className="opportunity-icon">+</span>
                <div>
                  <strong>{projectRequest.title}</strong>
                  <small>
                    {inviteSent
                      ? `Sent to ${projectRequest.inviteEmail}`
                      : "Ready to send to contributor"}
                  </small>
                </div>
                <button className="secondary-action" onClick={onQueue}>
                  Open
                </button>
              </div>
            )}

            <div className="pf-project-section-head">
              <div>
                <p className="small-label">Open work</p>
                <h2>Choose proofable project work.</h2>
              </div>
              <span className="status-pill safe">
                Best: {primaryOpportunity.title}
              </span>
            </div>

            <RowList className="pf-project-work-list">
              {demoProject.opportunities.slice(0, 4).map((item) => (
                <OpportunityRow
                  key={item.title}
                  title={item.title}
                  detail={item.detail}
                  reward={item.reward}
                  safety={item.safety}
                  proofability={item.proofability}
                  action={item.action}
                  onQueue={onQueue}
                />
              ))}
            </RowList>

            <div className="pf-project-active-work">
              <div className="pf-project-section-head">
                <div>
                  <p className="small-label">Active work</p>
                  <h2>What is moving now.</h2>
                </div>
              </div>
              <div className="pf-project-board">
                {activeWork.map(([state, title, detail]) => (
                  <div key={title}>
                    <span>{state}</span>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <DetailPane eyebrow="Project rail" title="People, agent, value.">
            <StatusRow
              label="Proof node"
              value={
                agentAttached
                  ? `${demoAgentIdentity.id} attached`
                  : "Ready to attach"
              }
              tone="good"
            />
            <StatusRow
              label="Contributor"
              value={inviteSent ? projectRequest.inviteEmail : "Open seat"}
              tone={inviteSent ? "good" : "bad"}
            />
            <StatusRow
              label="Request"
              value={workSuggested ? "Created" : "Not created"}
              tone={workSuggested ? "good" : "bad"}
            />
            <StatusRow
              label="Committed"
              value={demoProject.proofLedger.committedPool}
              tone="good"
            />
            <StatusRow
              label="Earned"
              value={demoProject.proofLedger.earnedPayouts}
              tone="good"
            />
            <StatusRow
              label="Released"
              value={demoProject.proofLedger.releasedPayouts}
              tone="good"
            />
            <button
              className="secondary-action full"
              onClick={onAttachAgent}
              disabled={agentAttached}
            >
              {agentAttached ? "Agent attached" : "Attach agent"}
            </button>
          </DetailPane>
        </div>

        <details className="project-detail-drawer">
        <summary>Sources and proof ledger</summary>
        <div className="project-detail-drawer-body">
          <div>
            <h3>Sources</h3>
            {demoSourceConnections.map((source) => (
              <div className="project-flow-card" key={source.name}>
                <strong>{source.name}</strong>
                <small>
                  {source.state} · {source.detail}
                </small>
              </div>
            ))}
          </div>
          <div>
            <h3>Proof ledger</h3>
            {demoProjectLedgerRows.map((row) => (
              <div className="project-flow-card" key={row.proof}>
                <strong>{row.work}</strong>
                <small>
                  {row.source} · {row.status} · {row.value}
                </small>
              </div>
            ))}
          </div>
          <div>
            <h3>People</h3>
            {inviteSent && (
              <CompactPerson
                name={projectRequest.inviteEmail}
                role="Contributor invite"
                status="Pending"
                tone="warning"
              />
            )}
            {demoProject.peopleRoster.slice(0, 2).map((person) => (
              <CompactPerson
                key={person.name}
                name={person.name}
                role={person.role}
                status={person.status}
                tone={person.status === "Pending" ? "warning" : "safe"}
              />
            ))}
          </div>
        </div>
      </details>
      </PageSurface>
    </section>
  );
}
