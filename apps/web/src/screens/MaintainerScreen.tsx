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
import { proofSourceIssueUrl } from "../app/githubWriteback";
import { StatusBlock } from "../components/ui";

function hasSourceIssueAuthority(url: string) {
  const trimmed = url.trim();
  return (
    trimmed.startsWith(`${proofSourceIssueUrl}#issuecomment-`) ||
    trimmed.startsWith(`${proofSourceIssueUrl}#issue-`) ||
    trimmed === proofSourceIssueUrl
  );
}

export function MaintainerScreen({
  submitted,
  accepted,
  activeMission,
  walletConnected,
  walletAddress,
  walletProvider,
  acceptanceSignature,
  proofRegistryAddress,
  proofRegistryDeployTxHash,
  proofRegistryTxHash,
  proofRegistryStatus,
  githubAcceptanceUrl,
  onAccept,
  onConnectWallet,
  onSignAcceptance,
  onDeployRegistry,
  onAnchorProof,
  onRecordGitHubAcceptance,
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
  proofRegistryAddress: string;
  proofRegistryDeployTxHash: string;
  proofRegistryTxHash: string;
  proofRegistryStatus: string;
  githubAcceptanceUrl: string;
  onAccept: () => void;
  onConnectWallet: () => void;
  onSignAcceptance: () => Promise<void>;
  onDeployRegistry: () => Promise<void>;
  onAnchorProof: () => Promise<void>;
  onRecordGitHubAcceptance: (url: string) => void;
  onReview: () => void;
  onRevision: () => void;
  onReject: () => void;
}) {
  const [onchainError, setOnchainError] = React.useState("");
  const [githubUrlInput, setGithubUrlInput] =
    React.useState(githubAcceptanceUrl);
  const packet =
    activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const mission =
    activeMission === "checkout" ? demoConvertedMission : demoMission;
  const githubAuthorityRecorded = hasSourceIssueAuthority(githubAcceptanceUrl);
  const githubInputMatchesSource = hasSourceIssueAuthority(githubUrlInput);
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
    },
    {
      label: "Verification",
      value: acceptanceSignature
        ? walletProvider === "browser"
          ? "Recoverable"
          : "Demo only"
        : "Not signed"
    },
    {
      label: "Onchain",
      value: proofRegistryTxHash
        ? "Anchored"
        : proofRegistryAddress
          ? "Registry ready"
          : proofRegistryDeployTxHash
            ? "Deploy pending"
            : "Ready to deploy"
    },
    {
      label: "GitHub post",
      value: githubAuthorityRecorded
        ? "Source-linked"
        : githubAcceptanceUrl
          ? "Recorded, check source"
          : "Needed"
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
            {walletConnected && (
              <button
                className="secondary-action full"
                onClick={() => void onSignAcceptance()}
                disabled={Boolean(acceptanceSignature)}
              >
                {acceptanceSignature ? "Acceptance signed" : "Sign acceptance"}
              </button>
            )}
            <form
              className="github-writeback-form"
              onSubmit={(event) => {
                event.preventDefault();
                onRecordGitHubAcceptance(githubUrlInput);
              }}
            >
              <label>
                <small>GitHub acceptance URL</small>
                <input
                  value={githubUrlInput}
                  onChange={(event) =>
                    setGithubUrlInput(event.currentTarget.value)
                  }
                  placeholder={`${proofSourceIssueUrl}#issuecomment-...`}
                />
              </label>
              <button className="secondary-action full" type="submit">
                {githubAuthorityRecorded
                  ? "GitHub source verified"
                  : githubAcceptanceUrl
                    ? "Update GitHub post"
                    : "Record GitHub post"}
              </button>
              <button
                className="secondary-action full"
                type="button"
                onClick={() => window.open(proofSourceIssueUrl, "_blank")}
              >
                Open source issue
              </button>
              <small
                className={
                  githubUrlInput && !githubInputMatchesSource
                    ? "error-note"
                    : ""
                }
              >
                {githubInputMatchesSource
                  ? "Matches the source issue."
                  : "Use the source issue or its maintainer comment URL."}
              </small>
            </form>
            {accepted && !proofRegistryAddress && (
              <button
                className="secondary-action full"
                onClick={() => {
                  setOnchainError("");
                  void onDeployRegistry().catch((error: unknown) =>
                    setOnchainError(
                      error instanceof Error ? error.message : "Deploy failed"
                    )
                  );
                }}
                disabled={walletProvider !== "browser"}
              >
                Deploy proof registry
              </button>
            )}
            {accepted && proofRegistryAddress && (
              <button
                className="secondary-action full"
                onClick={() => {
                  setOnchainError("");
                  void onAnchorProof().catch((error: unknown) =>
                    setOnchainError(
                      error instanceof Error ? error.message : "Anchor failed"
                    )
                  );
                }}
                disabled={Boolean(proofRegistryTxHash)}
              >
                {proofRegistryTxHash ? "Proof anchored" : "Anchor onchain"}
              </button>
            )}
            {(proofRegistryStatus || onchainError) && (
              <small className={onchainError ? "error-note" : ""}>
                {onchainError || proofRegistryStatus}
              </small>
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
