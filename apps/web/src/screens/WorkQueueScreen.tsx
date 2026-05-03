import React from "react";
import type { WorkSourceImport } from "@proofforge/sources";
import { importGitHubIssueLead } from "@proofforge/sources";
import {
  demoProject,
  demoProjectWorkLead,
  demoWorkLead,
  demoWorkLeadDiagnosis
} from "../demo";
import { formatReward } from "../app/missionDisplay";
import type {
  ActiveMission,
  ImportedMission,
  ProjectRequest
} from "../app/types";
import {
  ActionBar,
  DetailPane,
  MetricStrip,
  PageHeader,
  PageSurface,
  RowList,
  StatusRow
} from "../components/ui";

type DemoOpportunity = (typeof demoProject.opportunities)[number];
function score(value: string) {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

function WorkRow({
  item,
  selected,
  onRun,
  onImport
}: {
  item: DemoOpportunity;
  selected: boolean;
  onRun: (mission: ActiveMission) => void;
  onImport: () => void;
}) {
  const ready = item.action === "Run";
  return (
    <article className={selected ? "pf-source-row selected" : "pf-source-row"}>
      <div>
        <strong>{item.title}</strong>
        <small>{item.detail}</small>
      </div>
      <span>{item.source}</span>
      <span>{item.acceptedBy}</span>
      <b>{item.reward}</b>
      <span>{item.safety}</span>
      <button
        className={ready ? "primary-action" : "secondary-action"}
        onClick={() =>
          ready ? onRun(item.mission as ActiveMission) : onImport()
        }
      >
        {ready ? "Assess" : item.action}
      </button>
    </article>
  );
}

function ImportedIssueRow({
  githubUrl,
  liveImport,
  importedMission,
  importStatus,
  onUrlChange,
  onImportIssue,
  onRun
}: {
  githubUrl: string;
  liveImport: WorkSourceImport | null;
  importedMission: ImportedMission | null;
  importStatus: "idle" | "loading" | "failed";
  onUrlChange: (value: string) => void;
  onImportIssue: () => void;
  onRun: (mission: ActiveMission) => void;
}) {
  const status =
    liveImport || importedMission
      ? "Ready to assess"
      : importStatus === "failed"
        ? "Import failed"
        : "Paste a public issue URL";
  return (
    <article className="pf-source-import-row">
      <div>
        <strong>Import GitHub issue</strong>
        <input
          aria-label="GitHub issue URL"
          value={githubUrl}
          onChange={(event) => onUrlChange(event.target.value)}
        />
        <small>{status}</small>
      </div>
      <button
        className="secondary-action"
        onClick={onImportIssue}
        disabled={importStatus === "loading"}
      >
        {importStatus === "loading" ? "Importing" : "Import"}
      </button>
      {importedMission ? (
        <button className="primary-action" onClick={() => onRun("github")}>
          Assess
        </button>
      ) : null}
    </article>
  );
}

function TriagePane({
  clarified,
  converted,
  onClarify,
  onConvert,
  onReject,
  onRun
}: {
  clarified: boolean;
  converted: boolean;
  onClarify: () => void;
  onConvert: () => void;
  onReject: () => void;
  onRun: (mission: ActiveMission) => void;
}) {
  return (
    <DetailPane eyebrow="Work lead" title={demoWorkLead.title}>
      <p className="pf-muted-copy">{demoWorkLead.rawRequest}</p>
      <StatusRow label="Risk" value={demoWorkLead.risk} tone="bad" />
      <StatusRow label="Reward" value={demoWorkLead.reward} tone="good" />
      <StatusRow
        label="Accepts proof"
        value={demoWorkLead.acceptsProof}
        tone="good"
      />
      <StatusRow
        label="Missing"
        value={clarified ? "None" : demoWorkLead.missing}
        tone={clarified ? "good" : "bad"}
      />
      <div className="pf-diagnosis">
        {demoWorkLeadDiagnosis.map((row) => (
          <StatusRow
            key={row.label}
            label={row.label}
            value={
              row.label === "Missing detail" && clarified
                ? "Confirmed"
                : row.value
            }
            tone={
              row.label === "Missing detail" && clarified ? "good" : row.tone
            }
          />
        ))}
      </div>
      {!clarified ? (
        <strong className="pf-next-question">
          {demoWorkLead.nextQuestion}
        </strong>
      ) : null}
      <ActionBar>
        <button
          className="primary-action"
          onClick={
            converted
              ? () => onRun("checkout")
              : clarified
                ? onConvert
                : onClarify
          }
        >
          {converted
            ? "Run converted mission"
            : clarified
              ? "Convert to mission"
              : "Ask clarification"}
        </button>
        <button className="danger-action" onClick={onReject}>
          Reject
        </button>
      </ActionBar>
    </DetailPane>
  );
}

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
  const [githubUrl, setGithubUrl] = React.useState(
    "https://github.com/microsoft/vscode/issues/1"
  );
  const [liveImport, setLiveImport] = React.useState<WorkSourceImport | null>(
    null
  );
  const [importStatus, setImportStatus] = React.useState<
    "idle" | "loading" | "failed"
  >("idle");
  const triageMode = importedLead || workLeadClarified || workLeadConverted;
  const ready = demoProject.opportunities.filter(
    (item) => item.state === "Ready to run"
  );
  const selected = ready[0];
  const average = Math.round(
    ready.reduce((total, item) => total + score(item.proofability), 0) /
      ready.length
  );

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
  return (
    <section className="page-grid work-queue-grid">
      <PageSurface className="wide">
        <PageHeader
          eyebrow="Opportunities"
          title="Choose source-backed work."
          subtitle="Only scoped work becomes a mission. Raw requests stay in triage until owner, proof, and value path are clear."
          actions={
            <button className="secondary-action" onClick={onImport}>
              Import work
            </button>
          }
        />

        <MetricStrip
          metrics={[
            { label: "Ready missions", value: String(ready.length) },
            { label: "Needs triage", value: "3" },
            { label: "Avg proofability", value: `${average}%` },
            { label: "Sources", value: "3", detail: "GitHub, project, market" }
          ]}
        />

        <div className="pf-opportunity-layout">
          <div>
            <div className="pf-source-head">
              <span>Work</span>
              <span>Source</span>
              <span>Accepts</span>
              <span>Value</span>
              <span>Safety</span>
              <span />
            </div>

            <RowList>
              {projectWorkSuggested ? (
                <article className="pf-source-row selected">
                  <div>
                    <strong>{projectRequest.title}</strong>
                    <small>{projectRequest.detail}</small>
                  </div>
                  <span>Project request</span>
                  <span>{projectRequest.acceptanceOwner}</span>
                  <b>{projectRequest.reward}</b>
                  <span>Safe</span>
                  <button
                    className="primary-action"
                    onClick={() => onRun("request")}
                  >
                    Assess
                  </button>
                </article>
              ) : null}

              <ImportedIssueRow
                githubUrl={githubUrl}
                liveImport={liveImport}
                importedMission={importedMission}
                importStatus={importStatus}
                onUrlChange={setGithubUrl}
                onImportIssue={importGitHubIssue}
                onRun={onRun}
              />

              {ready.map((item, index) => (
                <WorkRow
                  item={item}
                  selected={!projectWorkSuggested && index === 0}
                  onRun={onRun}
                  onImport={onImport}
                  key={item.title}
                />
              ))}
            </RowList>
          </div>

          {triageMode ? (
            <TriagePane
              clarified={workLeadClarified}
              converted={workLeadConverted}
              onClarify={onClarifyLead}
              onConvert={onConvertLead}
              onReject={onRejectLead}
              onRun={onRun}
            />
          ) : (
            <DetailPane eyebrow="Best first mission" title={selected.title}>
              <p className="pf-muted-copy">{selected.detail}</p>
              <StatusRow label="Source" value={selected.source} tone="good" />
              <StatusRow
                label="Accepts proof"
                value={selected.acceptedBy}
                tone="good"
              />
              <StatusRow label="Value" value={selected.reward} tone="good" />
              <StatusRow label="Safety" value={selected.safety} tone="good" />
              <StatusRow
                label="Proofability"
                value={selected.proofability}
                tone="good"
              />
              <button
                className="primary-action full"
                onClick={() => onRun(selected.mission as ActiveMission)}
              >
                Assess mission
              </button>
            </DetailPane>
          )}
        </div>

        {projectWorkSuggested && !triageMode ? (
          <ActionBar>
            <button className="secondary-action" onClick={onViewInventory}>
              View all inventory
            </button>
            <span className="pf-muted-copy">{demoProjectWorkLead.missing}</span>
          </ActionBar>
        ) : null}
      </PageSurface>
    </section>
  );
}
