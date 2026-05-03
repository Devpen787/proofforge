import React from "react";
import { generatedProofSummary } from "../demo";
import { getMissionDisplay } from "../app/missionDisplay";
import { buildShareUrl, type ShareState } from "../app/shareRecords";
import type {
  ActiveMission,
  ImportedMission,
  PayoutReceipt,
  ProjectRequest
} from "../app/types";
import { StatusBlock } from "../components/ui";

export function PublicProofScreen({
  activeMission,
  projectRequest,
  importedMission,
  payoutReceipt,
  shareState,
  onBack
}: {
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  payoutReceipt: PayoutReceipt | null;
  shareState: ShareState;
  onBack: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const mission = getMissionDisplay({
    activeMission,
    projectRequest,
    importedMission
  });
  const proofFacts = [
    { label: "Status", value: generatedProofSummary.status },
    { label: "Project", value: mission.repo },
    {
      label: "Accepted by",
      value: mission.owner
    },
    { label: "Accepted", value: generatedProofSummary.acceptedDate },
    {
      label: "Reward outcome",
      value: `${mission.reward} accepted`
    },
    {
      label: "Stored on",
      value: generatedProofSummary.protocolRefs.storageProvider
    },
    {
      label: "Agent identity",
      value: generatedProofSummary.protocolRefs.identityLabel
    },
    {
      label: "Release tx",
      value: payoutReceipt?.txHash ?? "Pending"
    }
  ];
  const publicEvidence = generatedProofSummary.publicArtifacts.map(
    (artifact) => ({
      label: artifact.label,
      purpose: `${artifact.mediaType}, sha256 ${artifact.sha256Short}`,
      status: "Public ref"
    })
  );
  const copyPublicLink = async () => {
    const url = buildShareUrl("public-proof", {
      ...shareState,
      accepted: true
    });
    await navigator.clipboard?.writeText(url.toString()).catch(() => undefined);
    setCopied(true);
  };

  return (
    <section className="page-grid public-proof-grid">
      <header className="page-header">
        <span>Public Proof / public_{mission.packetId}</span>
        <button className="secondary-action" onClick={onBack}>
          Project ledger
        </button>
      </header>
      <div className="public-share-hero wide">
        <div>
          <p className="small-label">Public proof</p>
          <h1>{mission.title}</h1>
          <p>
            Accepted by {proofFacts[2].value}. Earned {mission.reward}.
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
          <strong>public_{mission.packetId}</strong>
          <small>
            {generatedProofSummary.protocolRefs.storageTxShort ??
              generatedProofSummary.protocolRefs.storageRootShort}
          </small>
          <button className="primary-action full" onClick={copyPublicLink}>
            {copied ? "Public link copied" : "Copy public link"}
          </button>
        </aside>
      </div>
      <div className="public-proof-dossier">
        <div className="public-proof-summary">
          <p className="small-label">What was proven</p>
          <h2>{mission.objective}</h2>
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
        {generatedProofSummary.payout.settlement.txHash && (
          <div className="artifact-row rich-artifact-row">
            <span>
              <strong>0G payout release</strong>
              <small>{generatedProofSummary.payout.settlement.txHash}</small>
            </span>
            <small>{generatedProofSummary.payout.settlement.amount}</small>
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
          <StatusBlock label="Project" value={mission.repo} />
          <StatusBlock
            label="Accepted"
            value={generatedProofSummary.acceptedDate}
          />
          <StatusBlock label="Earned" value={mission.reward} />
          <StatusBlock
            label="Reputation"
            value={`+${generatedProofSummary.projectCredit.points}`}
          />
        </div>
      </div>
    </section>
  );
}
