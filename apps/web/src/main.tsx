import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { demoActivity, demoMission, demoPacket, demoWork } from "./demoData";

function App() {
  const [screen, setScreen] = React.useState<"opportunity" | "run" | "case-file" | "maintainer" | "scoreboard">(
    "opportunity"
  );
  const [accepted, setAccepted] = React.useState(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">PF</span>
          <strong>ProofForge</strong>
        </div>
        <nav className="nav-list" aria-label="Primary">
          <NavButton label="Opportunity" active={screen === "opportunity"} onClick={() => setScreen("opportunity")} />
          <NavButton label="Runner" active={screen === "run"} onClick={() => setScreen("run")} />
          <NavButton label="Case Files" active={screen === "case-file"} onClick={() => setScreen("case-file")} />
          <NavButton label="Maintainer" active={screen === "maintainer"} onClick={() => setScreen("maintainer")} />
          <NavButton label="Scoreboard" active={screen === "scoreboard"} onClick={() => setScreen("scoreboard")} />
        </nav>
        <div className="node-status">
          <span className="avatar">A</span>
          <div>
            <strong>Alex</strong>
            <span>Node active</span>
          </div>
        </div>
      </aside>

      <main className="main">
        {screen === "opportunity" && <OpportunityScreen onStart={() => setScreen("run")} />}
        {screen === "run" && <RunnerScreen onPacket={() => setScreen("case-file")} />}
        {screen === "case-file" && <CaseFileScreen onSubmit={() => setScreen("maintainer")} />}
        {screen === "maintainer" && (
          <MaintainerScreen
            accepted={accepted}
            onAccept={() => {
              setAccepted(true);
              setScreen("scoreboard");
            }}
          />
        )}
        {screen === "scoreboard" && <ScoreboardScreen accepted={accepted} onNext={() => setScreen("opportunity")} />}
      </main>
    </div>
  );
}

function OpportunityScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="page-grid page-grid-hero">
      <div className="hero-card">
        <p className="small-label">Proof, not noise</p>
        <h1>Turn messy open-source work into proof someone can trust.</h1>
        <div className="safety-list">
          <span>No public posts.</span>
          <span>No PRs.</span>
          <span>No payments.</span>
          <span>Your agent runs safely until you approve.</span>
        </div>
        <button className="primary-action" onClick={onStart}>
          Run your first proof packet
        </button>
      </div>
      <div className="proof-orbit" aria-label="Proof workflow visual">
        <div className="shield">✓</div>
        <span className="orbit-node node-one">Work</span>
        <span className="orbit-node node-two">Run</span>
        <span className="orbit-node node-three">Verify</span>
        <span className="orbit-node node-four">Credit</span>
      </div>
      <MetricStrip />
      <WorkList onStart={onStart} />
    </section>
  );
}

function MetricStrip() {
  return (
    <div className="metric-strip">
      <Metric label="Visible rewards" value="$1,240" />
      <Metric label="Accepted this week" value="128" />
      <Metric label="Active nodes" value="42" />
      <Metric label="Your fit today" value="$63" />
    </div>
  );
}

function WorkList({ onStart }: { onStart: () => void }) {
  return (
    <section className="panel wide">
      <div className="section-heading">
        <h2>Ready work for you</h2>
        <button className="link-button">View all opportunities</button>
      </div>
      {demoWork.map((work) => (
        <button className="work-row" key={work.title} onClick={onStart}>
          <span>
            <strong>{work.title}</strong>
            <small>{work.repo}</small>
          </span>
          <b>{work.reward}</b>
          <small>{work.runtime}</small>
          <span className={`status-pill ${work.tone}`}>{work.risk}</span>
        </button>
      ))}
    </section>
  );
}

function RunnerScreen({ onPacket }: { onPacket: () => void }) {
  return (
    <section className="page-grid runner-grid">
      <header className="page-header">
        <span>Runner / {demoMission.title}</span>
        <button className="danger-action">Cancel Run</button>
      </header>
      <div className="panel">
        <h2>Mission lifecycle</h2>
        <Timeline />
      </div>
      <div className="terminal-card">
        <h2>Live output</h2>
        <pre>{`$ npm run proof:check

Checking documented install flow...
Missing docs-ready.flag. The documented setup is incomplete.

Artifacts written:
runner-result.json
stdout.log
stderr.log
environment.json`}</pre>
      </div>
      <div className="panel">
        <h2>Runner security</h2>
        <StatusRow label="Sandbox" value="Required" tone="good" />
        <StatusRow label="Write access" value="Blocked" tone="bad" />
        <StatusRow label="Secrets" value="None" tone="good" />
        <StatusRow label="External" value="Locked" tone="bad" />
        <div className="approval-box">
          <strong>Approval checkpoint</strong>
          <p>This run created a proof packet. Nothing leaves your workspace unless you approve.</p>
          <button className="primary-action full" onClick={onPacket}>
            Approve Packet
          </button>
        </div>
      </div>
    </section>
  );
}

function CaseFileScreen({ onSubmit }: { onSubmit: () => void }) {
  return (
    <section className="page-grid case-grid">
      <header className="page-header">
        <span>Case File / {demoPacket.id}</span>
        <code>Download JSON via npm run demo:packet</code>
      </header>
      <div className="panel">
        <h2>What was tested</h2>
        <p>{demoPacket.objective}</p>
        <h2>What happened</h2>
        <p>{demoPacket.summary}</p>
        <h2>Privacy review</h2>
        <ul className="check-list">
          <li>Secrets detected: 0</li>
          <li>Local paths masked</li>
          <li>Raw logs private</li>
          <li>No external actions taken</li>
        </ul>
      </div>
      <div className="panel">
        <h2>Proof artifacts</h2>
        {demoPacket.artifacts.map((artifact) => (
          <div className="artifact-row" key={artifact}>
            <span>{artifact}</span>
            <small>Generated</small>
          </div>
        ))}
      </div>
      <div className="decision-panel">
        <p className="small-label">Submit decision</p>
        <h2>Evidence first. Code later.</h2>
        <p>If accepted: $8 earned, +12 reputation, +2 credits.</p>
        <button className="primary-action full" onClick={onSubmit}>
          Submit to Maintainer Inbox
        </button>
      </div>
    </section>
  );
}

function MaintainerScreen({ accepted, onAccept }: { accepted: boolean; onAccept: () => void }) {
  return (
    <section className="page-grid maintainer-grid">
      <header className="page-header">
        <span>Maintainer Workspace</span>
      </header>
      <div className="metric-strip compact">
        <Metric label="Unresolved" value={accepted ? "0" : "1"} />
        <Metric label="Accepted" value={accepted ? "1" : "0"} />
        <Metric label="Revision" value="0" />
        <Metric label="Rejected" value="0" />
      </div>
      <div className="panel wide">
        <p className="small-label">Review clean proof, not agent noise.</p>
        <h2>Proof Packet Ready</h2>
        <p>Installer flow on Ubuntu fixture produced logs, environment details, and verifier checks.</p>
        <div className="decision-row">
          <button className="secondary-action">Review Packet</button>
          <button className="primary-action" onClick={onAccept} disabled={accepted}>
            {accepted ? "Accepted" : "Accept & Mark Earned"}
          </button>
          <button className="warning-action">Request Revision</button>
          <button className="danger-action">Reject Packet</button>
        </div>
      </div>
    </section>
  );
}

function ScoreboardScreen({ accepted, onNext }: { accepted: boolean; onNext: () => void }) {
  return (
    <section className="page-grid scoreboard-grid">
      <header className="page-header">
        <span>Scoreboard</span>
        <button className="primary-action" onClick={onNext}>
          Generate Proof Packet
        </button>
      </header>
      <div className="metric-strip wide">
        <Metric label="Available" value="$63" />
        <Metric label="Pending" value={accepted ? "$0" : "$8"} />
        <Metric label="Earned" value={accepted ? "$8" : "$0"} />
        <Metric label="Reputation" value={accepted ? "176" : "164"} />
      </div>
      <div className="panel">
        <h2>Your next step</h2>
        <p>{accepted ? "Store the packet on 0G with env credentials." : "Ask the maintainer to accept the submitted packet."}</p>
      </div>
      <div className="panel">
        <h2>Recent activity</h2>
        {demoActivity.map((item) => (
          <div className="activity-row" key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <ol className="timeline">
      {["Sandbox created", "Fixture copied", "Command executed", "Logs captured", "Verifier passed", "Packet ready"].map(
        (step) => (
          <li key={step}>{step}</li>
        )
      )}
    </ol>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function StatusRow({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" }) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <b className={tone}>{value}</b>
    </div>
  );
}

function NavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button className={active ? "nav-button active" : "nav-button"} aria-current={active ? "page" : undefined} onClick={onClick}>
      {label}
    </button>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
