import React from "react";
import type { WorkSourceImport } from "@proofforge/sources";
import { importGitHubIssueLead } from "@proofforge/sources";
import { demoProject, demoProjectWorkLead, demoWorkLead } from "../demo";
import { formatReward } from "../app/missionDisplay";
import type {
  ActiveMission,
  ImportedMission,
  ProjectRequest
} from "../app/types";
import { StatusRow } from "../components/ui";

export function WorkQueueScreen({
  importedLead,
  projectWorkSuggested,
  workLeadClarified,
  workLeadConverted,
  onImport,
  onViewInventory,
  onClarifyLead,
  onConvertLead,
  onRejectLead,
  onRun,
  onImportGitHubMission,
  importedMission,
  projectRequest
}: {
  importedLead: boolean;
  projectWorkSuggested: boolean;
  workLeadClarified: boolean;
  workLeadConverted: boolean;
  onImport: () => void;
  onViewInventory: () => void;
  onClarifyLead: () => void;
  onConvertLead: () => void;
  onRejectLead: () => void;
  onRun: (mission: ActiveMission) => void;
  onImportGitHubMission: (mission: ImportedMission) => void;
  importedMission: ImportedMission | null;
  projectRequest: ProjectRequest;
}) {
  const [activeFilter, setActiveFilter] = React.useState("Best fit");
  const [githubUrl, setGithubUrl] = React.useState(
    "https://github.com/microsoft/vscode/issues/1"
  );
  const [liveImport, setLiveImport] = React.useState<WorkSourceImport | null>(
    null
  );
  const [importStatus, setImportStatus] = React.useState<
    "idle" | "loading" | "failed"
  >("idle");
  const proofability = workLeadClarified ? "88%" : demoWorkLead.proofability;
  const triageMode = importedLead || workLeadClarified || workLeadConverted;
  const importGitHubIssue = async () => {
    setImportStatus("loading");
    try {
      const imported = await importGitHubIssueLead({ url: githubUrl });
      setLiveImport(imported);
      onImportGitHubMission({
        title: imported.lead.title,
        repo: imported.lead.repo,
        reward:
          imported.lead.reward?.type === "cash" ||
          imported.lead.reward?.type === "external"
            ? formatReward(
                imported.lead.reward?.amount,
                imported.lead.reward?.currency
              )
            : "Credit",
        runtime: "30 min",
        risk: imported.lead.riskLevel === "low" ? "Safe" : "Needs review",
        valuePath:
          imported.lead.reward?.type === "cash" ||
          imported.lead.reward?.type === "external"
            ? "External reward, tracked after acceptance"
            : "Repository credit, tracked after acceptance",
        sourceUrl: imported.lead.sourceUrl,
        acceptanceOwner: imported.lead.acceptanceOwner,
        objective: imported.lead.rawRequest,
        proofability: `${imported.lead.proofability}%`,
        requirements: imported.lead.desiredEvidence,
        issueNumber: imported.ref.issueNumber,
        importedAt: imported.importedAt
      });
      setImportStatus("idle");
    } catch {
      setImportStatus("failed");
    }
  };
  const readyOpportunities = demoProject.opportunities.filter(
    (opportunity) => opportunity.state === "Ready to run"
  );
  const triageOpportunities = demoProject.opportunities.filter(
    (opportunity) => opportunity.state === "Needs triage"
  );
  const renderOpportunityRow = (
    opportunity: (typeof demoProject.opportunities)[number],
    index: number
  ) => (
    <article
      className={
        index === 0 && opportunity.action === "Run"
          ? "opportunity-card selected"
          : "opportunity-card"
      }
      key={opportunity.title}
    >
      <div className="opportunity-card-main">
        <span className="opportunity-icon">{index + 1}</span>
        <div>
          <strong>{opportunity.title}</strong>
          <small>{opportunity.detail}</small>
          <div className="opportunity-card-meta">
            <span>{opportunity.source}</span>
            <span>{opportunity.acceptedBy}</span>
            <span>{opportunity.reward}</span>
            <span>{opportunity.proofability} proofable</span>
          </div>
        </div>
      </div>
      <button
        className={
          opportunity.action === "Run" ? "primary-action" : "secondary-action"
        }
        onClick={() =>
          opportunity.action === "Run"
            ? onRun(opportunity.mission as ActiveMission)
            : onImport()
        }
      >
        {opportunity.action === "Run" ? "Assess" : opportunity.action}
      </button>
    </article>
  );

  if (triageMode) {
    return (
      <section className="page-grid work-queue-flow">
        <header className="page-header">
          <span>Opportunities / Imported work</span>
          <button className="secondary-action" onClick={onViewInventory}>
            View inventory
          </button>
        </header>

        <div className="triage-workbench wide compact-triage">
          <div>
            <p className="small-label">Imported opportunity</p>
            <h1>{demoWorkLead.title}</h1>
            <div className="tag-row">
              {demoWorkLead.categories.map((category) => (
                <span className="status-pill safe" key={category}>
                  {category}
                </span>
              ))}
            </div>
          </div>

          <section className="triage-fit-table">
            <StatusRow label="Risk" value={demoWorkLead.risk} tone="bad" />
            <StatusRow label="Reward" value={demoWorkLead.reward} tone="good" />
            <StatusRow
              label="Accepts proof"
              value={demoWorkLead.acceptsProof}
              tone="good"
            />
            <StatusRow
              label="Missing"
              value={workLeadClarified ? "None" : demoWorkLead.missing}
              tone={workLeadClarified ? "good" : "bad"}
            />
            <StatusRow label="Proofability" value={proofability} tone="good" />
          </section>

          <section className="triage-next-card compact-triage-action">
            <div>
              <h2>
                {workLeadConverted
                  ? "Ready to run."
                  : workLeadClarified
                    ? "Convert this lead."
                    : "Ask one question before any run starts."}
              </h2>
              <p>
                {workLeadConverted
                  ? "Checkout QA verification is ready to run."
                  : workLeadClarified
                    ? "Browser targets are confirmed."
                    : demoWorkLead.nextQuestion}
              </p>
            </div>
            <div className="decision-row">
              <button
                className="primary-action"
                onClick={
                  workLeadConverted
                    ? () => onRun("checkout")
                    : workLeadClarified
                      ? onConvertLead
                      : onClarifyLead
                }
              >
                {workLeadConverted
                  ? "Run mission"
                  : workLeadClarified
                    ? "Convert"
                    : "Ask clarification"}
              </button>
              <button className="danger-action" onClick={onRejectLead}>
                Reject
              </button>
            </div>
          </section>
        </div>

        {projectWorkSuggested && (
          <details className="project-detail-drawer wide">
            <summary>{demoProjectWorkLead.title}</summary>
            <StatusRow
              label="Missing"
              value={demoProjectWorkLead.missing}
              tone="bad"
            />
          </details>
        )}

        {workLeadConverted && (
          <button
            className="primary-action wide"
            onClick={() => onRun("checkout")}
          >
            Run converted mission
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="page-grid work-queue-grid">
      <header className="page-header">
        <span>Opportunities</span>
        <button
          className="secondary-action"
          aria-label="Import work"
          onClick={onImport}
        >
          Import work
        </button>
      </header>

      <div className="opportunity-command-panel wide">
        <div className="opportunity-list-panel">
          <div className="section-heading">
            <div>
              <p className="small-label">Sourced work inventory</p>
              <h2>Choose sourced work.</h2>
            </div>
          </div>
          <div
            className="opportunity-filter-row"
            aria-label="Opportunity filters"
          >
            {["Best fit", "Safe", "Docs", "Rewards"].map((filter) => (
              <button
                className={activeFilter === filter ? "active" : ""}
                key={filter}
                disabled={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="opportunity-lane-list">
            {projectWorkSuggested && (
              <article className="project-request-opportunity">
                <div>
                  <p className="small-label">Project request</p>
                  <strong>{projectRequest.title}</strong>
                  <small>{projectRequest.detail}</small>
                  <div className="opportunity-card-meta">
                    <span>{projectRequest.projectName}</span>
                    <span>{projectRequest.acceptanceOwner} accepts</span>
                    <span>Contributor request</span>
                    <span>88% proofable</span>
                  </div>
                </div>
                <button
                  className="primary-action"
                  onClick={() => onRun("request")}
                >
                  Accept request
                </button>
              </article>
            )}

            <article className="github-import-row">
              <div>
                <strong>Import GitHub issue</strong>
                <input
                  aria-label="GitHub issue URL"
                  value={githubUrl}
                  onChange={(event) => setGithubUrl(event.target.value)}
                />
                {liveImport && (
                  <small>
                    Imported {liveImport.lead.repo} issue #
                    {liveImport.ref.issueNumber}: {liveImport.lead.status}
                  </small>
                )}
                {importedMission && !liveImport && (
                  <small>
                    Imported {importedMission.repo}: ready to assess.
                  </small>
                )}
                {importStatus === "failed" && (
                  <small>Import failed. Check the issue URL.</small>
                )}
              </div>
              <div className="github-import-actions">
                <button
                  className="secondary-action"
                  onClick={importGitHubIssue}
                  disabled={importStatus === "loading"}
                >
                  {importStatus === "loading" ? "Importing" : "Import"}
                </button>
                {importedMission && (
                  <button
                    className="primary-action"
                    onClick={() => onRun("github")}
                  >
                    Assess imported issue
                  </button>
                )}
              </div>
            </article>

            <section className="opportunity-lane">
              <div className="opportunity-lane-heading">
                <span>Ready missions</span>
                <b>{readyOpportunities.length}</b>
              </div>
              {readyOpportunities.map(renderOpportunityRow)}
            </section>

            <section className="opportunity-lane">
              <div className="opportunity-lane-heading">
                <span>Needs details</span>
                <b>{triageOpportunities.length}</b>
              </div>
              {triageOpportunities.map((opportunity, index) =>
                renderOpportunityRow(
                  opportunity,
                  readyOpportunities.length + index
                )
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
