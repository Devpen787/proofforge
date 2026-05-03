import React from "react";
import { generatedProofSummary } from "../demo";
import type { ActiveMission } from "../app/types";
import { buildShareUrl, type SharedAppState } from "../app/shareRecords";
import { StatusBlock } from "../components/ui";

export function PublicProofScreen({
  activeMission,
  shareState,
  onBack
}: {
  activeMission: ActiveMission;
  shareState: SharedAppState;
  onBack: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const proofFacts = [
    { label: "Status", value: generatedProofSummary.status },
    { label: "Project", value: generatedProofSummary.project },
    {
      label: "Accepted by",
      value:
        activeMission === "checkout"
          ? "External buyer"
          : generatedProofSummary.acceptedBy
    },
    {
      label: "Reward outcome",
      value: `${generatedProofSummary.payout.amount} ${generatedProofSummary.payout.status}`
    },
    {
      label: "Stored on",
      value: generatedProofSummary.protocolRefs.storageProvider
    }
  ];
  const publicEvidence = generatedProofSummary.publicArtifacts.map(
    (artifact) => ({
      label: artifact.label,
      purpose: `${artifact.mediaType}, sha256 ${artifact.sha256Short}`,
      status: "Public ref"
    })
  );

  return (
    <section className="page-grid public-proof-grid">
      <header className="page-header">
        <span>Public Proof / {generatedProofSummary.publicPacketId}</span>
        <button className="secondary-action" onClick={onBack}>
          Back to Earnings
        </button>
      </header>
      <div className="public-share-hero wide">
        <div>
          <p className="small-label">Public proof</p>
          <h1>{generatedProofSummary.mission}</h1>
          <p>
            Accepted by {proofFacts[2].value}. Earned{" "}
            {generatedProofSummary.payout.amount}.
          </p>
          <div className="public-badge-row">
            <span className="status-pill safe">Accepted</span>
          </div>
        </div>
        <aside
          className="public-proof-id-card"
          aria-label="Public proof reference"
        >
          <span className="status-pill safe">Shareable proof</span>
          <strong>{generatedProofSummary.publicPacketId}</strong>
          <small>
            {generatedProofSummary.protocolRefs.storageTxShort ??
              generatedProofSummary.protocolRefs.storageRootShort}
          </small>
          <button
            className="primary-action full"
            onClick={async () => {
              setCopied(true);
              const url = buildShareUrl("public-proof", {
                ...shareState,
                accepted: true
              });
              await navigator.clipboard?.writeText(url).catch(() => undefined);
            }}
          >
            {copied ? "Public link copied" : "Copy public link"}
          </button>
          <button className="secondary-action full" onClick={onBack}>
            View ledger
          </button>
        </aside>
      </div>
      <div className="public-proof-dossier">
        <div className="public-proof-summary">
          <p className="small-label">What was proven</p>
          <h2>{generatedProofSummary.whatWasProven}</h2>
          <div className="public-fact-grid">
            {proofFacts.map((fact) => (
              <StatusBlock
                key={fact.label}
                label={fact.label}
                value={fact.value}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="panel public-safe-panel">
        <p className="small-label">Evidence</p>
        <h2>Shared artifacts.</h2>
        {generatedProofSummary.protocolRefs.storageUri && (
          <div className="artifact-row rich-artifact-row">
            <span>
              <strong>0G storage root</strong>
              <small>{generatedProofSummary.protocolRefs.storageUri}</small>
            </span>
            <small>{generatedProofSummary.protocolRefs.storageStatus}</small>
          </div>
        )}
        {publicEvidence.map((artifact) => (
          <div className="artifact-row rich-artifact-row" key={artifact.label}>
            <span>
              <strong>{artifact.label}</strong>
              <small>{artifact.purpose}</small>
            </span>
            <small>{artifact.status}</small>
          </div>
        ))}
      </div>
      <div className="decision-panel public-credit-panel">
        <p className="small-label">Credit</p>
        <h2>{generatedProofSummary.projectCredit.contributor}</h2>
        <div className="public-credit-stats">
          <StatusBlock label="Project" value={generatedProofSummary.project} />
          <StatusBlock
            label="Earned"
            value={generatedProofSummary.payout.amount}
          />
          <StatusBlock
            label="Reputation"
            value={`+${generatedProofSummary.projectCredit.points}`}
          />
        </div>
      </div>
    </section>
  );
}
