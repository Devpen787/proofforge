import React from "react";
import { generatedProofSummary } from "../demo";
import { getMissionDisplay } from "../app/missionDisplay";
import { buildShareUrl, type ShareState } from "../app/shareRecords";
import type {
  ActiveMission,
  ImportedMission,
  ProjectRequest
} from "../app/types";
import { StatusBlock } from "../components/ui";

export function PublicProofScreen({
  activeMission,
  projectRequest,
  importedMission,
  shareState,
  published,
  onPublish,
  onHide,
  onBack
}: {
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  shareState: ShareState;
  published: boolean;
  onPublish: () => void;
  onHide: () => void;
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
      label: "Value",
      value: "Tracked privately"
    },
    {
      label: "Stored on",
      value: generatedProofSummary.protocolRefs.storageProvider
    },
    {
      label: "Public identity",
      value: "ProofForge Builder"
    },
    {
      label: "Payout",
      value: "Hidden by owner"
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
    if (!published) return;
    const url = buildShareUrl("public-proof", {
      ...shareState,
      accepted: true
    });
    await navigator.clipboard?.writeText(url.toString()).catch(() => undefined);
    setCopied(true);
  };

  if (!published) {
    return (
      <section className="page-grid public-proof-grid">
        <header className="page-header">
          <span>Public Proof / private</span>
          <button className="secondary-action" onClick={onBack}>
            Project ledger
          </button>
        </header>

        <div className="public-share-hero wide">
          <div>
            <p className="small-label">Private by default</p>
            <h1>Nothing is public yet.</h1>
            <p>
              Publish a scoped receipt for this accepted proof without exposing
              your full account, wallet, payouts, bids, failed runs, or agent
              history.
            </p>
            <div className="public-badge-row">
              <span className="status-pill warning">Private workspace</span>
              <span className="status-pill safe">Privacy review passed</span>
            </div>
          </div>
          <aside
            className="public-proof-id-card"
            aria-label="Private proof publication controls"
          >
            <span className="status-pill safe">Scoped receipt</span>
            <strong>{mission.title}</strong>
            <small>Public identity: ProofForge Builder</small>
            <button className="primary-action full" onClick={onPublish}>
              Publish scoped proof
            </button>
          </aside>
        </div>

        <div className="panel public-safe-panel">
          <p className="small-label">Will be public</p>
          <h2>Source, proof, verifier, acceptance.</h2>
          {[
            ["Source", mission.sourceUrl],
            ["Mission", mission.title],
            ["Verifier", generatedProofSummary.verifierStatus],
            ["Artifacts", "Labels and SHA-256 hashes only"]
          ].map(([label, value]) => (
            <div className="artifact-row rich-artifact-row" key={label}>
              <span>
                <strong>{label}</strong>
                <small>{value}</small>
              </span>
              <small>public-safe</small>
            </div>
          ))}
        </div>

        <div className="decision-panel public-credit-panel">
          <p className="small-label">Will stay private</p>
          <h2>Account history and income.</h2>
          <div className="public-credit-stats">
            <StatusBlock label="Wallet / ENS" value="Hidden" />
            <StatusBlock label="Payout amount" value="Hidden" />
            <StatusBlock label="Failed runs" value="Hidden" />
            <StatusBlock label="Marketplace bids" value="Hidden" />
          </div>
        </div>
      </section>
    );
  }

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
          <p>Accepted by {proofFacts[2].value}. Value tracked privately.</p>
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
          <button className="secondary-action full" onClick={onHide}>
            Make private
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
          <StatusBlock label="Value" value="Private" />
          <StatusBlock
            label="Reputation"
            value={`+${generatedProofSummary.projectCredit.points}`}
          />
        </div>
      </div>
    </section>
  );
}
