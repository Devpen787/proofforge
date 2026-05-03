import React from "react";
import { getMissionDisplay } from "../app/missionDisplay";
import type {
  ActiveMission,
  ImportedMission,
  PayoutReceipt,
  ProjectRequest
} from "../app/types";
import { PageHeader, PageSurface, RowList, StatusRow } from "../components/ui";

export function EarningsScreen({
  accepted,
  released,
  activeMission,
  projectRequest,
  importedMission,
  payoutReceipt,
  onWork,
  onSettings,
  onRelease
}: {
  accepted: boolean;
  released: boolean;
  activeMission: ActiveMission;
  projectRequest: ProjectRequest;
  importedMission: ImportedMission | null;
  payoutReceipt: PayoutReceipt | null;
  onWork: () => void;
  onSettings: () => void;
  onRelease: () => void;
}) {
  const mission = getMissionDisplay({
    activeMission,
    projectRequest,
    importedMission
  });
  const earnedValue = accepted ? mission.reward : "$0";
  const releasedValue = released ? mission.reward : "$0";
  const ledgerRows = [
    {
      event: "Packet submitted",
      state: accepted ? "Accepted" : "Waiting",
      value: accepted ? earnedValue : "$0",
      receipt: "No payout release yet"
    },
    {
      event: "Earned record",
      state: accepted ? "Created" : "Not created",
      value: earnedValue,
      receipt: "Maintainer acceptance"
    },
    {
      event: "Release record",
      state: released ? "Recorded" : "Pending",
      value: releasedValue,
      receipt: payoutReceipt?.txHash || "External/manual"
    }
  ];

  return (
    <PageSurface className="wide pf-money-surface">
      <PageHeader
        eyebrow="Earnings"
        title="Earned is not released."
        subtitle="ProofForge records acceptance, earned value, and release receipts without pretending to move money automatically."
        actions={
          <button className="primary-action" onClick={onWork}>
            Open My Work
          </button>
        }
      />

      <div className="pf-money-strip">
        <StatusRow label="Available" value="$63" tone="good" />
        <StatusRow
          label="Earned"
          value={earnedValue}
          tone={accepted ? "good" : "bad"}
        />
        <StatusRow
          label="Released"
          value={releasedValue}
          tone={released ? "good" : "bad"}
        />
        <StatusRow
          label="Receipt"
          value={payoutReceipt?.txHash || "Not recorded"}
          tone={released ? "good" : "bad"}
        />
      </div>

      <div className="pf-money-layout">
        <RowList>
          <div className="pf-money-row head">
            <span>Event</span>
            <span>State</span>
            <span>Value</span>
            <span>Receipt</span>
          </div>
          {ledgerRows.map((row) => (
            <div className="pf-money-row" key={row.event}>
              <strong>{row.event}</strong>
              <span>{row.state}</span>
              <span>{row.value}</span>
              <span>{row.receipt}</span>
            </div>
          ))}
        </RowList>

        <aside className="pf-money-detail">
          <p className="small-label">Selected payout</p>
          <h2>{mission.title}</h2>
          <StatusRow label="Type" value="External/manual" tone="good" />
          <StatusRow label="Accepted by" value={mission.owner} tone="good" />
          <StatusRow
            label="Release"
            value={released ? "Recorded" : "Separate step"}
            tone={released ? "good" : "bad"}
          />
          {!released && accepted ? (
            <button className="primary-action full" onClick={onRelease}>
              Mark released
            </button>
          ) : null}
          <button className="secondary-action full" onClick={onSettings}>
            Payment settings
          </button>
        </aside>
      </div>
    </PageSurface>
  );
}
