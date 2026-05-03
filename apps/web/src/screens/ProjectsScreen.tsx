import React from "react";
import {
  demoProject,
  demoProjectLedgerRows,
  demoAgentIdentity,
  demoSourceConnections
} from "../demo";
import type { ProjectRequest } from "../app/types";
import { StatusRow } from "../components/ui";

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
    <div className="project-opportunity-row">
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
  onStartProject,
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

  return (
    <section className="page-grid project-room-grid">
      <header className="project-room-hero wide">
        <div className="project-hero-copy">
          <span className="project-kicker">Projects / {demoProject.name}</span>
          <h1>{projectRequest.projectName}</h1>
          <p>{projectRequest.projectPurpose}</p>
          <div className="tag-row">
            <span className="status-pill safe">Active</span>
            {demoProject.lanes.map((lane) => (
              <span className="status-pill" key={lane}>
                {lane}
              </span>
            ))}
          </div>
        </div>
        <div className="project-hero-actions">
          <button
            className="primary-action"
            onClick={
              !workSuggested
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
                  : () => onInvite(inviteEmail)
            }
          >
            {!workSuggested
              ? "Create work request"
              : inviteSent
                ? "Review sent request"
                : "Send contributor request"}
          </button>
          <button className="secondary-action" onClick={onQueue}>
            Find sourced work
          </button>
        </div>
      </header>

      {projectStarted && (
        <div className="project-action-banner wide" role="status">
          <div>
            <strong>Project started</strong>
            <span>
              Create a work request, send it, then review submitted proof.
            </span>
          </div>
          <span className="status-pill safe">Launch draft</span>
        </div>
      )}

      {!projectStarted && (
        <section className="project-request-strip wide">
          <div>
            <p className="small-label">Create project</p>
            <h2>Define the workspace people and agents can help.</h2>
          </div>
          <div className="project-form-grid">
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
            <button
              className="primary-action"
              onClick={() => onSaveProject({ projectName, projectPurpose })}
            >
              Save project
            </button>
          </div>
        </section>
      )}

      {projectStarted && !workSuggested && (
        <section className="project-request-strip wide">
          <div>
            <p className="small-label">Create work request</p>
            <h2>Ask a contributor or agent owner to prove useful work.</h2>
          </div>
          <div className="project-form-grid request-form-grid">
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
            <button
              className="primary-action"
              onClick={() =>
                onSuggestWork({
                  title: requestTitle,
                  detail: requestDetail,
                  reward: requestReward,
                  acceptanceOwner,
                  inviteEmail
                })
              }
            >
              Create request
            </button>
          </div>
        </section>
      )}

      {workSuggested && (
        <div className="project-request-strip wide" role="status">
          <div>
            <p className="small-label">Contributor request</p>
            <h2>{projectRequest.title} is ready.</h2>
            <span>
              Source, acceptance owner, proof target, and value path are set.
            </span>
          </div>
          <div className="project-request-actions">
            <span
              className={
                inviteSent ? "status-pill safe" : "status-pill warning"
              }
            >
              {inviteSent
                ? `Sent to ${projectRequest.inviteEmail}`
                : "Ready to send"}
            </span>
            <button
              className="primary-action"
              onClick={inviteSent ? onQueue : () => onInvite(inviteEmail)}
            >
              {inviteSent ? "Open as contributor" : "Send request"}
            </button>
          </div>
        </div>
      )}

      <div className="project-room-main wide">
        <section className="panel project-opportunities-panel">
          <div className="section-heading">
            <div>
              <p className="small-label">Project work</p>
              <h2>Work in this project.</h2>
            </div>
            <span className="status-pill safe">
              Best: {primaryOpportunity.title}
            </span>
          </div>
          <div className="project-opportunity-list">
            {workSuggested && (
              <div className="project-opportunity-row project-opportunity-new">
                <span className="opportunity-icon">+</span>
                <div>
                  <strong>{projectRequest.title}</strong>
                  <small>
                    {inviteSent
                      ? "Sent to contributor for acceptance"
                      : "Ready to send to a contributor"}
                  </small>
                </div>
                <button className="secondary-action" onClick={onQueue}>
                  Open
                </button>
              </div>
            )}
            {demoProject.opportunities.slice(0, 3).map((item) => (
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
          </div>
          <button className="secondary-action full" onClick={onQueue}>
            Open sourced inventory
          </button>
        </section>

        <aside className="panel project-ops-panel">
          <div className="section-heading">
            <div>
              <p className="small-label">Steward actions</p>
              <h2>Agent, people, value.</h2>
            </div>
          </div>
          <div className="project-ops-list">
            <div>
              <span>
                <small>Proof node</small>
                <strong>{demoAgentIdentity.id}</strong>
                <b>
                  {agentAttached ? "Attached to project" : "Ready to attach"}
                </b>
              </span>
              <button
                className="secondary-action"
                onClick={onAttachAgent}
                disabled={agentAttached}
              >
                {agentAttached ? "Attached" : "Attach agent"}
              </button>
            </div>
            <div>
              <span>
                <small>Contributor</small>
                <strong>
                  {inviteSent ? projectRequest.inviteEmail : "Open seat"}
                </strong>
                <b>{inviteSent ? "Invite pending" : "Invite not sent"}</b>
              </span>
              <button
                className="secondary-action"
                onClick={() => onInvite(inviteEmail)}
                disabled={inviteSent}
              >
                {inviteSent ? "Pending" : "Invite"}
              </button>
            </div>
            <div>
              <span>
                <small>Project state</small>
                <strong>
                  {projectStarted ? "Active sprint" : "Draft sprint"}
                </strong>
                <b>
                  {projectStarted ? "Accepting proof" : "Needs steward start"}
                </b>
              </span>
              <button
                className="secondary-action"
                onClick={onStartProject}
                disabled={projectStarted}
              >
                {projectStarted ? "Started" : "Start project"}
              </button>
            </div>
          </div>
          <div className="project-value-ledger">
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
            <StatusRow
              label="Method"
              value={demoProject.proofLedger.payoutMethod}
              tone="good"
            />
          </div>
        </aside>
      </div>

      <details className="project-detail-drawer wide">
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
    </section>
  );
}
