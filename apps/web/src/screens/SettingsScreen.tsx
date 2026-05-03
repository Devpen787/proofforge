import React from "react";
import { demoAgentIdentity } from "../demo";
import type { WalletProviderMode } from "../app/types";
import { StatusRow } from "../components/ui";

export function SettingsScreen({
  agentRegistered,
  walletConnected,
  walletAddress,
  walletProvider,
  acceptanceSignature,
  payoutReceiptRef,
  onExportWorkspace,
  onImportWorkspaceFile,
  onExportNetworkRecord,
  onExportProjectRecord,
  onConnectWallet,
  onRecordPayoutReceipt,
  onAgentSetup,
  onHelp
}: {
  agentRegistered: boolean;
  walletConnected: boolean;
  walletAddress: string;
  walletProvider: WalletProviderMode;
  acceptanceSignature: string;
  payoutReceiptRef: string;
  onExportWorkspace: () => void;
  onImportWorkspaceFile: (file: File) => Promise<void>;
  onExportNetworkRecord: () => Promise<void>;
  onExportProjectRecord: () => Promise<void>;
  onConnectWallet: () => void;
  onRecordPayoutReceipt: (receipt: string) => void;
  onAgentSetup: () => void;
  onHelp: () => void;
}) {
  const importInputRef = React.useRef<HTMLInputElement | null>(null);
  const [receiptInput, setReceiptInput] = React.useState(payoutReceiptRef);

  return (
    <section className="page-grid utility-grid">
      <div className="utility-hero wide">
        <div>
          <p className="small-label">Settings</p>
          <h1>Connections, agent, payout preferences.</h1>
          <p>
            Configure the rails once. Keep the work screens focused on doing the
            work.
          </p>
        </div>
        <button className="primary-action" onClick={onAgentSetup}>
          {agentRegistered ? "Review agent" : "Set up proof node"}
        </button>
      </div>

      <section className="panel utility-panel">
        <p className="small-label">Sources</p>
        <h2>Work imports</h2>
        <StatusRow label="GitHub" value="Issue import ready" tone="good" />
        <StatusRow label="Marketplace" value="Manual import" tone="good" />
        <StatusRow label="Project backlog" value="Demo source" tone="good" />
      </section>

      <section className="panel utility-panel">
        <p className="small-label">Agent</p>
        <h2>{demoAgentIdentity.id}</h2>
        <StatusRow
          label="Status"
          value={agentRegistered ? "Registered" : "Local profile"}
          tone={agentRegistered ? "good" : "bad"}
        />
        <StatusRow label="Identity" value="8004-ready" tone="good" />
        <StatusRow label="Skills" value="8239-ready" tone="good" />
      </section>

      <section className="panel utility-panel">
        <p className="small-label">Payout</p>
        <h2>Collection rules</h2>
        <StatusRow label="Method" value="Manual / external" tone="good" />
        <StatusRow
          label="Wallet"
          value={
            walletConnected
              ? walletProvider === "browser"
                ? "MetaMask connected"
                : "Local demo signer"
              : "Receipt reference only"
          }
          tone={walletConnected ? "good" : "bad"}
        />
        <StatusRow
          label="Address"
          value={walletAddress || "Not connected"}
          tone={walletAddress ? "good" : "bad"}
        />
        <StatusRow label="Release" value="After acceptance" tone="good" />
        <StatusRow
          label="Signature"
          value={
            acceptanceSignature
              ? walletProvider === "browser"
                ? "Recoverable signature"
                : "Demo signature"
              : "Optional"
          }
          tone={acceptanceSignature ? "good" : "bad"}
        />
        <button className="secondary-action full" onClick={onConnectWallet}>
          {walletConnected ? "Wallet connected" : "Connect MetaMask"}
        </button>
      </section>

      <section className="panel utility-panel">
        <p className="small-label">Network records</p>
        <h2>Portable persistence</h2>
        <StatusRow label="Reviewer links" value="Share state" tone="good" />
        <StatusRow label="Public proof" value="Share state" tone="good" />
        <StatusRow label="Project sync" value="Export-ready JSON" tone="good" />
        <StatusRow label="0G" value="Export-ready JSON" tone="good" />
        <StatusRow
          label="Payout receipt"
          value={payoutReceiptRef || "Not recorded"}
          tone={payoutReceiptRef ? "good" : "bad"}
        />
        <div className="utility-action-stack">
          <button className="secondary-action full" onClick={onExportWorkspace}>
            Export workspace
          </button>
          <button
            className="secondary-action full"
            onClick={() => importInputRef.current?.click()}
          >
            Import workspace file
          </button>
          <input
            ref={importInputRef}
            aria-label="Import workspace file"
            hidden
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) void onImportWorkspaceFile(file);
              event.currentTarget.value = "";
            }}
          />
          <button
            className="secondary-action full"
            onClick={() => void onExportNetworkRecord()}
          >
            Export network record
          </button>
          <button
            className="secondary-action full"
            onClick={() => void onExportProjectRecord()}
          >
            Export project record
          </button>
        </div>
        <form
          className="utility-action-stack"
          onSubmit={(event) => {
            event.preventDefault();
            onRecordPayoutReceipt(receiptInput);
          }}
        >
          <label>
            <small>Payout receipt or tx hash</small>
            <input
              value={receiptInput}
              onChange={(event) => setReceiptInput(event.currentTarget.value)}
              placeholder="0x... or external receipt URL"
            />
          </label>
          <button className="secondary-action full" type="submit">
            Record payout receipt
          </button>
        </form>
      </section>

      <details className="panel wide utility-disclosure">
        <summary>
          <span>
            <small className="small-label">Defaults</small>
            <strong>Privacy and safety policy</strong>
          </span>
          <b>Show</b>
        </summary>
        <div className="utility-rule-grid">
          {[
            ["Public comments", "Require approval"],
            ["Pull requests", "Require approval"],
            ["Secrets", "Never mounted"],
            ["Raw logs", "Private by default"],
            ["Local paths", "Masked"],
            ["Funds", "Never spent by agent"]
          ].map(([label, value]) => (
            <StatusRow key={label} label={label} value={value} tone="good" />
          ))}
        </div>
      </details>

      <button className="secondary-action utility-help-link" onClick={onHelp}>
        Open Help
      </button>
    </section>
  );
}
