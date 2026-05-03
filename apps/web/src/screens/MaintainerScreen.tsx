import React from "react";
import { demoAgentIdentity, getDemoPacket } from "../demo";
import { getMissionDisplay } from "../app/missionDisplay";
import type {
  ActiveMission,
  ImportedMission,
  ProofEvent,
  ProjectRequest,
  WalletIdentity
} from "../app/types";
import {
  DetailPane,
  PageHeader,
  PageSurface,
  RowList,
  StatusRow
} from "../components/ui";

export function MaintainerScreen({
  submitted,
  accepted,
  activeMission,
  projectRequest,
  importedMission,
  walletIdentity,
  proofEvents,
  onAccept,
  onSignLatestProofEvent,
  onReview,
  onRevision,
  onReject
}: {
  submitted: boolean;
  accepted: boolean;
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  walletIdentity: WalletIdentity | null;
  proofEvents: ProofEvent[];
  onAccept: () => void;
  onSignLatestProofEvent: () => Promise<void>;
  onReview: () => void;
  onRevision: () => void;
  onReject: () => void;
}) {
  const packet = getDemoPacket(activeMission);
  const mission = getMissionDisplay({
    activeMission,
    projectRequest,
    importedMission
  });
  const hasReviewPacket = submitted || accepted;
  const decisionState = accepted
    ? "Accepted"
    : hasReviewPacket
      ? "Decision due"
      : "No packet";
  const latestEvent = proofEvents.at(-1);
  const acceptanceSigned =
    latestEvent?.type === "packet_accepted" && Boolean(latestEvent.signature);
  const queueRows = [
    {
      title: mission.title,
      source: mission.repo,
      status: decisionState,
      confidence: "86%",
      value: mission.reward
    },
    {
      title: "Reproduce Windows build error",
      source: "polkadot-js/api",
      status: "Queued",
      confidence: "84%",
      value: "$12"
    },
    {
      title: "Improve quick start guide",
      source: "Docs Onboarding Sprint",
      status: "Needs packet",
      confidence: "88%",
      value: "$10"
    }
  ];
  return (
    <PageSurface className="wide pf-maintainer-surface">
      <PageHeader
        eyebrow="Maintainer Review"
        title="Decide submitted proof."
        subtitle="One accepted packet creates an earned record. Release stays separate."
        actions={
          <span
            className={accepted ? "status-pill safe" : "status-pill warning"}
          >
            {decisionState}
          </span>
        }
      />

      <div className="pf-maintainer-layout">
        <RowList className="pf-maintainer-queue">
          <div className="pf-maintainer-row head">
            <span>Packet</span>
            <span>Source</span>
            <span>Status</span>
            <span>Confidence</span>
            <span>Value</span>
          </div>
          {queueRows.map((row) => (
            <button
              className={`pf-maintainer-row ${row.title === mission.title ? "selected" : ""}`}
              key={row.title}
              onClick={row.title === mission.title ? onReview : undefined}
            >
              <strong>{row.title}</strong>
              <span>{row.source}</span>
              <span>{row.status}</span>
              <span>{row.confidence}</span>
              <span>{row.value}</span>
            </button>
          ))}
        </RowList>

        <DetailPane eyebrow="Selected packet" title={mission.title}>
          <StatusRow
            label="What was proven"
            value={packet.result}
            tone="good"
          />
          <StatusRow label="Risk" value={mission.risk} tone="good" />
          <StatusRow
            label="Proof node"
            value={demoAgentIdentity.id}
            tone="good"
          />
          <StatusRow
            label="Credit to"
            value={demoAgentIdentity.owner}
            tone="good"
          />
          <StatusRow
            label="Earned if accepted"
            value={mission.reward}
            tone="good"
          />
          <p className="pf-muted-copy">{packet.recommendedAction}</p>
          <div className="pf-maintainer-actions">
            <button className="secondary-action full" onClick={onReview}>
              Review
            </button>
            <button
              className="primary-action full"
              onClick={onAccept}
              disabled={accepted}
            >
              {accepted ? "Accepted" : "Accept & Mark Earned"}
            </button>
            {accepted ? (
              <button
                className="secondary-action full"
                onClick={onSignLatestProofEvent}
                disabled={!walletIdentity?.address || acceptanceSigned}
              >
                {acceptanceSigned ? "Acceptance signed" : "Sign acceptance"}
              </button>
            ) : (
              <>
                <button className="warning-action full" onClick={onRevision}>
                  Request Revision
                </button>
                <button className="danger-action full" onClick={onReject}>
                  Reject
                </button>
              </>
            )}
          </div>
        </DetailPane>
      </div>
    </PageSurface>
  );
}
