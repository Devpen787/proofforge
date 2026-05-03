import React from "react";
import {
  demoProject,
  demoProjectWorkLead,
  demoWorkLead,
  generatedProofSummary
} from "../demo";
import type { ActiveMission } from "../app/types";
import { StatusBlock, StatusRow } from "../components/ui";

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
  const selectedOpportunity = demoProject.opportunities[0];
  const proofability = workLeadClarified ? "88%" : demoWorkLead.proofability;
  const triageMode = importedLead || workLeadClarified || workLeadConverted;
  const sourceUseLabel = (mode: string) =>
    mode.includes("submission context")
      ? "Submission checklist"
      : "Runnable work lead";
  const valuePathLabel = (valuePath: string) =>
    valuePath === "external" ? "External reward" : "Reputation";

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
          aria-label="Import external task"
          onClick={onImport}
        >
          Import external task
        </button>
      </header>

      <div className="opportunity-command-panel wide">
        <div className="opportunity-list-panel">
          <div className="section-heading">
            <div>
              <p className="small-label">Sourced work inventory</p>
              <h2>Pick or triage work.</h2>
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
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="source-inventory-table" aria-label="Imported sources">
            {generatedProofSummary.generatedWorkSources.map((source) => (
              <div className="source-inventory-row" key={source.title}>
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
          <div className="opportunity-card-list">
            {demoProject.opportunities.map((opportunity, index) => (
              <article
                className={
                  index === 0 ? "opportunity-card selected" : "opportunity-card"
                }
                key={opportunity.title}
              >
                <div className="opportunity-card-main">
                  <span className="opportunity-icon">{index + 1}</span>
                  <div>
                    <strong>{opportunity.title}</strong>
                    <small>{opportunity.detail}</small>
                    <div className="opportunity-card-meta">
                      <span>{opportunity.reward}</span>
                      <span>{opportunity.safety}</span>
                      <span>{opportunity.proofability} proofable</span>
                    </div>
                  </div>
                </div>
                <button
                  className={
                    opportunity.action === "Run"
                      ? "primary-action"
                      : "secondary-action"
                  }
                  onClick={() =>
                    opportunity.action === "Run" ? onRun("docs") : onImport()
                  }
                >
                  {opportunity.action}
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="opportunity-detail-panel compact-opportunity-detail">
          <p className="small-label">Selected</p>
          <h2>{selectedOpportunity.title}</h2>
          <div className="opportunity-detail-stats">
            <StatusBlock label="Reward" value={selectedOpportunity.reward} />
            <StatusBlock label="Safety" value={selectedOpportunity.safety} />
            <StatusBlock
              label="Proofability"
              value={selectedOpportunity.proofability}
            />
            <StatusBlock label="Accepted by" value="Commons reviewer" />
          </div>
          <div className="decision-row">
            <button className="primary-action" onClick={() => onRun("docs")}>
              Run this mission
            </button>
            <button className="secondary-action" onClick={onImport}>
              Import another
            </button>
          </div>
        </aside>
      </div>

      {projectWorkSuggested && (
        <div className="project-work-lead-card wide" role="status">
          <div>
            <p className="small-label">Project Work Lead created</p>
            <h2>{demoProjectWorkLead.title}</h2>
            <p>{demoProjectWorkLead.rawRequest}</p>
          </div>
          <div className="diagnosis-grid">
            <StatusRow
              label="Source"
              value={demoProjectWorkLead.source}
              tone="good"
            />
            <StatusRow
              label="Proofability"
              value={demoProjectWorkLead.proofability}
              tone="good"
            />
            <StatusRow
              label="Missing"
              value={demoProjectWorkLead.missing}
              tone="bad"
            />
            <StatusRow
              label="Recommendation"
              value="Clarify before Mission"
              tone="bad"
            />
          </div>
        </div>
      )}
    </section>
  );
}
