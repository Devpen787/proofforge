import React from "react";
import {
  demoConvertedMission,
  demoConvertedPacket,
  demoMission,
  demoPacket,
  generatedProofSummary
} from "../demo";
import type { ActiveMission } from "../app/types";
import type { WalletProviderMode } from "../app/types";
import { StatusBlock } from "../components/ui";

export function MaintainerScreen({
  submitted,
  accepted,
  activeMission,
  walletConnected,
  walletAddress,
  walletProvider,
  acceptanceSignature,
  onAccept,
  onConnectWallet,
  onSignAcceptance,
  onReview,
  onRevision,
  onReject
}: {
  submitted: boolean;
  accepted: boolean;
  activeMission: ActiveMission;
  walletConnected: boolean;
  walletAddress: string;
  walletProvider: WalletProviderMode;
  acceptanceSignature: string;
  onAccept: () => void;
  onConnectWallet: () => void;
  onSignAcceptance: () => Promise<void>;
  onReview: () => void;
  onRevision: () => void;
  onReject: () => void;
}) {
  const packet =
    activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const mission =
    activeMission === "checkout" ? demoConvertedMission : demoMission;
  const hasReviewPacket = submitted || !accepted;
  const decisionState = accepted
    ? "Accepted"
    : hasReviewPacket
      ? "Decision due"
      : "No packet";
  const proofFacts = [
    { label: "Verifier", value: generatedProofSummary.verifierStatus },
    { label: "Risk", value: mission.risk },
    {
      label: "Storage",
      value: generatedProofSummary.protocolRefs.storageProvider
    },
    { label: "Artifacts", value: `${packet.artifacts.length} files` },
    { label: "Payout", value: generatedProofSummary.payout.amount },
    {
      label: "Reviewer signature",
      value: acceptanceSignature
        ? walletProvider === "browser"
          ? "MetaMask signed"
          : "Demo signed"
        : walletConnected
          ? "Ready"
          : "Wallet optional"
    },
    {
      label: "Wallet",
      value: walletAddress || "Not connected"
    }
  ];
  return (
    <section className="page-grid maintainer-focus-grid">
      <header className="page-header">
        <span>Maintainer Review</span>
      </header>
      <section className="maintainer-review-console wide">
        <div className="maintainer-review-header">
          <div>
            <p className="small-label">Submitted evidence packet</p>
            <h1>Accept the proof and create the earned record.</h1>
            <p>{mission.title}</p>
            <span>Docs install proof</span>
          </div>
          <span
            className={accepted ? "status-pill safe" : "status-pill warning"}
          >
            {decisionState}
          </span>
        </div>

        <div className="maintainer-review-body">
          <div className="maintainer-proof-panel">
            <p className="small-label">Verdict</p>
            <h2>{packet.result}</h2>
            <div className="maintainer-fact-strip">
              {proofFacts.map((fact) => (
                <StatusBlock
                  key={fact.label}
                  label={fact.label}
                  value={fact.value}
                />
              ))}
            </div>
          </div>

          <aside className="maintainer-decision-rail">
            <p className="small-label">Decision</p>
            <strong>
              {accepted ? "Proof accepted" : "Accept recommended"}
            </strong>
            <span>{packet.recommendedAction}</span>
            <button
              className="primary-action full"
              onClick={onAccept}
              disabled={accepted}
            >
              {accepted ? "Accepted" : "Accept & Mark Earned"}
            </button>
            {!walletConnected && (
              <button
                className="secondary-action full"
                onClick={onConnectWallet}
              >
                Connect MetaMask
              </button>
            )}
            {accepted && (
              <button
                className="secondary-action full"
                onClick={() => void onSignAcceptance()}
                disabled={Boolean(acceptanceSignature)}
              >
                {acceptanceSignature ? "Acceptance signed" : "Sign acceptance"}
              </button>
            )}
            {!accepted && (
              <>
                <button className="warning-action full" onClick={onRevision}>
                  Request Revision
                </button>
                <button className="danger-action full" onClick={onReject}>
                  Reject Packet
                </button>
              </>
            )}
            <button className="secondary-action full" onClick={onReview}>
              Review Packet
            </button>
          </aside>
        </div>

        <details className="project-detail-drawer">
          <summary>Decision details</summary>
          <p>{generatedProofSummary.whatWasProven}</p>
        </details>
      </section>
    </section>
  );
}
