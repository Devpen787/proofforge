import React from "react";
import { demoAgentIdentity } from "../demo";
import { PageHeader, PageSurface, RowList, StatusRow } from "../components/ui";
import type { AppState, ProofEvent, WalletIdentity } from "../app/types";

function maskAddress(address?: string) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function SettingsScreen({
  agentRegistered,
  onAgentSetup,
  onTrustCenter,
  onHelp,
  onExport,
  onImport,
  onReset,
  onConnectWallet,
  onSaveEnsName,
  onSignLatestProofEvent,
  onExportProofRecord,
  proofEvents,
  walletIdentity
}: {
  agentRegistered: boolean;
  onAgentSetup: () => void;
  onTrustCenter: () => void;
  onHelp: () => void;
  onExport: () => void;
  onImport: (state: Partial<Omit<AppState, "screen">>) => void;
  onReset: () => void;
  onConnectWallet: () => Promise<void>;
  onSaveEnsName: (ensName: string) => void;
  onSignLatestProofEvent: () => Promise<void>;
  onExportProofRecord: () => void;
  proofEvents: ProofEvent[];
  walletIdentity: WalletIdentity | null;
}) {
  const [ensName, setEnsName] = React.useState(
    walletIdentity?.ensName ?? demoAgentIdentity.ensRef
  );
  const importWorkspace = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    onImport(JSON.parse(text) as Partial<Omit<AppState, "screen">>);
  };
  return (
    <PageSurface className="wide pf-settings-surface">
      <PageHeader
        eyebrow="Settings"
        title="Connections and demo readiness."
        subtitle="Account rails live here so proof workflows stay focused."
        actions={
          <button className="primary-action" onClick={onAgentSetup}>
            {agentRegistered ? "Review agent" : "Set up proof node"}
          </button>
        }
      />

      <div className="pf-settings-layout">
        <RowList className="pf-settings-groups">
          <section>
            <p className="small-label">Work sources</p>
            <StatusRow label="GitHub" value="Issue import ready" tone="good" />
            <StatusRow label="Marketplace" value="Manual import" tone="good" />
            <StatusRow
              label="Project backlog"
              value="Local demo source"
              tone="good"
            />
          </section>
          <section>
            <p className="small-label">Agent</p>
            <StatusRow
              label={demoAgentIdentity.id}
              value={agentRegistered ? "Registered" : "Local profile"}
              tone={agentRegistered ? "good" : "bad"}
            />
            <StatusRow
              label="Owner"
              value={demoAgentIdentity.owner}
              tone="good"
            />
            <StatusRow
              label="Skills"
              value="docs, repo, command, evidence"
              tone="good"
            />
          </section>
          <section>
            <p className="small-label">Wallet and payout</p>
            <StatusRow
              label="Wallet"
              value={maskAddress(walletIdentity?.address)}
              tone={walletIdentity?.address ? "good" : "bad"}
            />
            <StatusRow label="Payout" value="Manual/external" tone="good" />
            <StatusRow label="Release" value="After acceptance" tone="good" />
          </section>
          <section>
            <p className="small-label">0G-ready proof record</p>
            <StatusRow
              label="Events"
              value={String(proofEvents.length)}
              tone="good"
            />
            <StatusRow
              label="Latest hash"
              value={proofEvents.at(-1)?.eventHash ?? "No events yet"}
              tone={proofEvents.length ? "good" : "bad"}
            />
            <StatusRow
              label="Signature"
              value={
                proofEvents.at(-1)?.signature ? "Wallet signed" : "Unsigned"
              }
              tone={proofEvents.at(-1)?.signature ? "good" : "bad"}
            />
          </section>
        </RowList>

        <aside className="pf-settings-actions">
          <p className="small-label">Actions</p>
          <button className="secondary-action full" onClick={onConnectWallet}>
            Connect wallet
          </button>
          <button className="secondary-action full" onClick={onTrustCenter}>
            Trust Center
          </button>
          <label className="settings-field">
            <span>Agent ENS</span>
            <input
              aria-label="Agent ENS name"
              value={ensName}
              onChange={(event) => setEnsName(event.target.value)}
            />
          </label>
          <button
            className="secondary-action full"
            onClick={() => onSaveEnsName(ensName)}
          >
            Save ENS name
          </button>
          <button
            className="secondary-action full"
            onClick={onSignLatestProofEvent}
            disabled={!proofEvents.length}
          >
            Sign latest proof event
          </button>
          <button
            className="secondary-action full"
            onClick={onExportProofRecord}
          >
            Export proof record
          </button>
          <button className="secondary-action full" onClick={onExport}>
            Export workspace
          </button>
          <label className="secondary-action full settings-file-action">
            Import workspace
            <input
              aria-label="Import workspace file"
              type="file"
              accept="application/json"
              onChange={(event) => importWorkspace(event.target.files?.[0])}
            />
          </label>
          <button className="danger-action full" onClick={onReset}>
            Reset workspace
          </button>
          <button className="secondary-action full" onClick={onHelp}>
            Open Help
          </button>
        </aside>
      </div>
    </PageSurface>
  );
}
