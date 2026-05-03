import React from "react";
import type { WorkSourceImport } from "@proofforge/sources";
import { importGitHubIssueLead } from "@proofforge/sources";
import {
  demoProject,
  demoProjectWorkLead,
  demoWorkLead,
  generatedProofSummary
} from "../demo";
import type { ActiveMission } from "../app/types";
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
  onRun
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
}) {
  const [activeFilter, setActiveFilter] = React.useState("Best fit");
  const [githubUrl, setGithubUrl] = React.useState(
    "https://github.com/Devpen787/proofforge/issues/1"
  );
  const [liveImport, setLiveImport] = React.useState<WorkSourceImport | null>(
    null
  );
  const [importStatus, setImportStatus] = React.useState<
    "idle" | "loading" | "failed"
  >("idle");
  const proofability = workLeadClarified ? "88%" : demoWorkLead.proofability;
  const triageMode = importedLead || workLeadClarified || workLeadConverted;
  const sourceUseLabel = (mode: string) =>
    mode.includes("submission context")
      ? "Submission checklist"
      : "Runnable work lead";
  const valuePathLabel = (valuePath: string) =>
    valuePath === "external" ? "External reward" : "Reputation";
  const importGitHubIssue = async () => {
    setImportStatus("loading");
    try {
      const imported = await importGitHubIssueLead({ url: githubUrl });
      setLiveImport(imported);
      setImportStatus("idle");
    } catch {
      setImportStatus("failed");
    }
  };
  const importedSources = liveImport
    ? [
        {
          source: liveImport.source,
          title: liveImport.lead.title,
          sourceUrl: liveImport.lead.sourceUrl,
          repo: liveImport.lead.repo,
          acceptanceOwner: liveImport.lead.acceptanceOwner,
          status: liveImport.lead.status,
          proofability: `${liveImport.lead.proofability}%`,
          valuePath: liveImport.lead.reward?.type ?? "reputation",
          mode: "live browser import"
        },
        ...generatedProofSummary.generatedWorkSources
      ]
    : generatedProofSummary.generatedWorkSources;
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
                  <strong>{demoProjectWorkLead.title}</strong>
                  <small>{demoProjectWorkLead.rawRequest}</small>
                  <div className="opportunity-card-meta">
                    <span>{demoProjectWorkLead.source}</span>
                    <span>Docs steward accepts</span>
                    <span>Contributor request</span>
                    <span>{demoProjectWorkLead.proofability} proofable</span>
                  </div>
                </div>
                <button
                  className="primary-action"
                  onClick={() => onRun("docs")}
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
                {importStatus === "failed" && (
                  <small>Import failed. Check the issue URL.</small>
                )}
              </div>
              <button
                className="secondary-action"
                onClick={importGitHubIssue}
                disabled={importStatus === "loading"}
              >
                {importStatus === "loading" ? "Importing" : "Import"}
              </button>
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
          <details className="source-inventory-drawer">
            <summary>
              Source context <b>{importedSources.length}</b>
            </summary>
            <div
              className="source-inventory-table"
              aria-label="Imported sources"
            >
              {importedSources.map((source, index) => (
                <div
                  className="source-inventory-row"
                  key={`${source.source}-${source.repo}-${source.title}-${index}`}
                >
                  <span>
                    <strong>{source.title}</strong>
                    <small>{source.repo}</small>
                  </span>
                  <span>
                    <small>Source</small>
                    <b>{source.source}</b>
                  </span>
                  <span>
                    <small>Owner</small>
                    <b>{source.acceptanceOwner}</b>
                  </span>
                  <span>
                    <small>Status</small>
                    <b>{source.status.replace("_", " ")}</b>
                  </span>
                  <span>
                    <small>Value</small>
                    <b>{valuePathLabel(source.valuePath)}</b>
                  </span>
                  <span>
                    <small>Action</small>
                    <b>{sourceUseLabel(source.mode)}</b>
                  </span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
