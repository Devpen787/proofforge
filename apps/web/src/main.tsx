import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  demoActivity,
  demoArtifacts,
  demoFirstRunSteps,
  demoMission,
  demoPacket,
  demoProject,
  demoProofLoop,
  demoPublicArtifacts,
  demoImportExample,
  demoSafetyDefaults,
  demoSourcePipeline,
  demoSourceTypes,
  demoUnlockProgress,
  demoWork,
  demoWorkLead
} from "./demoData";
import { routeLabels, screens, type Screen } from "./routes";

function screenFromHash(): Screen {
  const candidate = window.location.hash.replace("#", "");
  return screens.includes(candidate as Screen) ? (candidate as Screen) : "opportunity";
}

function App() {
  const [screen, setScreenState] = React.useState<Screen>(screenFromHash);
  const [accepted, setAccepted] = React.useState(false);
  const [released, setReleased] = React.useState(false);
  const setScreen = React.useCallback((nextScreen: Screen) => {
    window.location.hash = nextScreen;
    setScreenState(nextScreen);
  }, []);

  React.useEffect(() => {
    const onHashChange = () => setScreenState(screenFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">PF</span>
          <strong>ProofForge</strong>
        </div>
        <nav className="nav-list" aria-label="Primary">
          {screens.map((route) => (
            <NavButton key={route} label={routeLabels[route]} active={screen === route} onClick={() => setScreen(route)} />
          ))}
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
        {screen === "opportunity" && <OpportunityScreen onStart={() => setScreen("first-run")} />}
        {screen === "first-run" && <FirstRunScreen onRun={() => setScreen("run")} onQueue={() => setScreen("work-queue")} />}
        {screen === "projects" && <ProjectsScreen onQueue={() => setScreen("work-queue")} />}
        {screen === "work-queue" && <WorkQueueScreen onRun={() => setScreen("run")} />}
        {screen === "run" && <RunnerScreen onPacket={() => setScreen("case-file")} />}
        {screen === "case-file" && <CaseFileScreen onSubmit={() => setScreen("maintainer")} />}
        {screen === "maintainer" && (
          <MaintainerScreen
            accepted={accepted}
            onAccept={() => {
              setAccepted(true);
              setReleased(false);
              setScreen("scoreboard");
            }}
          />
        )}
        {screen === "scoreboard" && (
          <ScoreboardScreen
            accepted={accepted}
            released={released}
            onRelease={() => setReleased(true)}
            onNext={() => setScreen("first-run")}
            onPublicProof={() => setScreen("public-proof")}
          />
        )}
        {screen === "public-proof" && <PublicProofScreen onBack={() => setScreen("scoreboard")} />}
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
      <ProofLoopCard />
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

function ProofLoopCard() {
  return (
    <section className="proof-loop-card" aria-label="ProofForge proof loop">
      <p className="small-label">How proof moves</p>
      <h2>Work becomes proof, then credit.</h2>
      <div className="proof-loop-list">
        {demoProofLoop.map((step, index) => (
          <div className="proof-loop-step" key={step.label}>
            <span>{index + 1}</span>
            <div>
              <strong>{step.label}</strong>
              <small>{step.detail}</small>
            </div>
          </div>
        ))}
      </div>
      <p className="quiet-copy">Raw work never skips the gate. Agents run locally, evidence is reviewed, then accepted proof becomes credit.</p>
    </section>
  );
}

function FirstRunScreen({ onRun, onQueue }: { onRun: () => void; onQueue: () => void }) {
  return (
    <section className="page-grid first-run-grid">
      <header className="page-header">
        <span>First Run</span>
        <button className="secondary-action" onClick={onQueue}>Choose another mission</button>
      </header>
      <div className="panel first-run-steps">
        <p className="small-label">Guided first proof</p>
        <h2>Your first win in six steps.</h2>
        {demoFirstRunSteps.map((step, index) => (
          <div className="wizard-step" key={step.label}>
            <span>{index + 1}</span>
            <div>
              <strong>{step.label}</strong>
              <small>{step.detail}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="panel first-run-mission">
        <p className="small-label">Starter mission</p>
        <h2>{demoMission.title}</h2>
        <p className="quiet-copy">Start with a safe docs validation mission. Your agent runs locally, captures evidence, and stops for approval before anything is submitted.</p>
        <div className="triage-grid">
          <StatusBlock label="Repo" value={demoMission.repo} />
          <StatusBlock label="Risk" value={demoMission.risk} />
          <StatusBlock label="Runtime" value={demoMission.runtime} />
          <StatusBlock label="Reward" value={`${demoMission.reward} + rep + credits`} />
        </div>
        <div className="first-run-agent">
          <h3>What the agent will do</h3>
          <ul className="check-list">
            <li>Clone or load the fixture repo</li>
            <li>Run the documented install check</li>
            <li>Capture logs and environment</li>
            <li>Build the evidence packet draft</li>
          </ul>
        </div>
        <button className="primary-action full" onClick={onRun}>Run safest starter mission</button>
      </div>
      <div className="panel">
        <h2>Safety defaults</h2>
        <p className="quiet-copy">This is the rule that keeps ProofForge useful instead of noisy.</p>
        {demoSafetyDefaults.map((item) => (
          <StatusRow key={item} label={item} value="Locked" tone="good" />
        ))}
      </div>
    </section>
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
          <span className="work-main">
            <strong>{work.title}</strong>
            <small>{work.repo}</small>
          </span>
          <span className="work-owner">
            <small>Accepts proof</small>
            <b>{work.owner}</b>
          </span>
          <b>{work.reward}</b>
          <small>{work.runtime}</small>
          <span className={`status-pill ${work.tone}`}>{work.risk}</span>
          <span className="start-pill">Start</span>
        </button>
      ))}
    </section>
  );
}

function ProjectsScreen({ onQueue }: { onQueue: () => void }) {
  return (
    <section className="page-grid projects-grid">
      <header className="page-header">
        <span>Projects</span>
        <button className="primary-action">Start Project</button>
      </header>
      <div className="panel wide project-hero">
        <div>
          <p className="small-label">Community project layer</p>
          <h2>{demoProject.name}</h2>
          <p>{demoProject.purpose}</p>
        </div>
        <span className="status-pill safe">{demoProject.status}</span>
      </div>
      <div className="metric-strip wide">
        <Metric label="People" value={demoProject.people} />
        <Metric label="Agents" value={demoProject.agents} />
        <Metric label="Proof accepted" value={demoProject.acceptedProof} />
        <Metric label="Reward pool" value={demoProject.pool} />
      </div>
      <div className="panel command-room">
        <h2>Project command room</h2>
        <p>Start project to invite people, attach agents, suggest work, and grow through accepted proof.</p>
        <div className="decision-row">
          <button className="secondary-action">Invite</button>
          <button className="secondary-action">Attach Agent</button>
          <button className="secondary-action">Suggest Work</button>
          <button className="primary-action" onClick={onQueue}>
            Open Work Queue
          </button>
        </div>
      </div>
      <div className="panel">
        <h2>Mission lanes</h2>
        <div className="tag-row">
          {demoProject.lanes.map((lane) => (
            <span className="status-pill safe" key={lane}>
              {lane}
            </span>
          ))}
        </div>
      </div>
      <div className="panel">
        <h2>Backlog</h2>
        {demoProject.backlog.map((item) => (
          <div className="artifact-row" key={item.title}>
            <span>{item.title}</span>
            <small>{item.status}</small>
          </div>
        ))}
      </div>
      <div className="panel">
        <h2>Project proof ledger</h2>
        <StatusRow label="Accepted packets" value={demoProject.proofLedger.acceptedPackets} tone="good" />
        <StatusRow label="Pending packets" value={demoProject.proofLedger.pendingPackets} tone="good" />
        <StatusRow label="Earned payouts" value={demoProject.proofLedger.earnedPayouts} tone="good" />
        <StatusRow label="Latest proof" value={demoProject.proofLedger.latestProof} tone="good" />
        <p className="quiet-copy">Top contributors: {demoProject.proofLedger.topContributors.join(", ")}</p>
      </div>
      <div className="panel wide">
        <div className="section-heading">
          <div>
            <h2>Agent delegations</h2>
            <p className="quiet-copy">Delegate capability, not control. Project agents can help, but blocked actions stay blocked.</p>
          </div>
          <button className="secondary-action">Attach Agent</button>
        </div>
        <div className="agent-card-grid">
          {demoProject.agentDelegations.map((agent) => (
            <div className="agent-card" key={agent.name}>
              <div className="section-heading">
                <strong>{agent.name}</strong>
                <span className="status-pill safe">{agent.status}</span>
              </div>
              <StatusRow label="Allowed" value={agent.allowed} tone="good" />
              <StatusRow label="Blocked" value={agent.blocked} tone="bad" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkQueueScreen({ onRun }: { onRun: () => void }) {
  return (
    <section className="page-grid work-queue-grid">
      <header className="page-header">
        <span>Work Queue</span>
        <code>npm run import:github -- --url https://github.com/owner/repo/issues/123</code>
      </header>
      <div className="panel wide">
        <div className="section-heading">
          <div>
            <p className="small-label">Ready missions, not raw work</p>
            <h2>Import existing work, then triage it before agents run.</h2>
          </div>
          <button className="secondary-action">Import external task</button>
        </div>
        <div className="pipeline-strip" aria-label="Work intake pipeline">
          {demoSourcePipeline.map((item) => (
            <div className="pipeline-step" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="source-grid" aria-label="Work source categories">
          {demoSourceTypes.map((source) => (
            <div className="source-card" key={source.name}>
              <div className="section-heading">
                <strong>{source.name}</strong>
                <span className="status-pill safe">{source.status}</span>
              </div>
              <small>{source.detail}</small>
            </div>
          ))}
        </div>
        <div className="import-command">
          <span>
            <strong>{demoImportExample.source}</strong>
            <small>{demoImportExample.result}</small>
          </span>
          <code>{demoImportExample.command}</code>
        </div>
      </div>
      <div className="panel wide work-lead-card">
        <div>
          <p className="small-label">Work Lead</p>
          <h2>{demoWorkLead.title}</h2>
          <p>{demoWorkLead.rawRequest}</p>
          <div className="tag-row">
            {demoWorkLead.categories.map((category) => (
              <span className="status-pill safe" key={category}>
                {category}
              </span>
            ))}
          </div>
        </div>
        <div className="proof-score">
          <span>Proofability</span>
          <strong>{demoWorkLead.proofability}</strong>
          <small>Good, but not mission-ready.</small>
        </div>
        <div className="triage-grid">
          <StatusBlock label="Risk" value={demoWorkLead.risk} />
          <StatusBlock label="Reward" value={demoWorkLead.reward} />
          <StatusBlock label="Accepts proof" value={demoWorkLead.acceptsProof} />
          <StatusBlock label="Missing" value={demoWorkLead.missing} />
          <StatusBlock label="Can convert?" value={demoWorkLead.canConvert} />
          <StatusBlock label="Reason" value={demoWorkLead.conversionReason} />
        </div>
        <div className="recommendation-box">
          <strong>Recommendation</strong>
          <p>{demoWorkLead.recommendation}</p>
          <div className="clarification-box">
            <span>Next clarification question</span>
            <strong>{demoWorkLead.nextQuestion}</strong>
          </div>
          <div className="decision-row">
            <button className="primary-action">Ask clarification</button>
            <button className="secondary-action" disabled title="Missing browser versions must be clarified first">
              Convert when ready
            </button>
            <button className="danger-action">Reject</button>
          </div>
        </div>
      </div>
      <div className="panel">
        <h2>Scoped starter mission</h2>
        <p>Validate installation docs in a clean fixture. This is safe, local, and evidence-only.</p>
        <button className="primary-action full" onClick={onRun}>
          Run safest mission
        </button>
      </div>
      <div className="panel">
        <h2>Source categories</h2>
        <ul className="check-list">
          <li>GitHub issues and PRs</li>
          <li>Foundation backlogs</li>
          <li>Marketplace QA tasks</li>
          <li>Community project requests</li>
        </ul>
      </div>
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
        <h2>Packet output preview</h2>
        <p className="quiet-copy">If approved, this run becomes a reviewable evidence packet. Private files stay local until submission.</p>
        {demoArtifacts.slice(0, 4).map((artifact) => (
          <div className="artifact-row rich-artifact-row" key={artifact.name}>
            <span>
              <strong>{artifact.name}</strong>
              <small>{artifact.purpose}</small>
            </span>
            <small>{artifact.visibility}</small>
          </div>
        ))}
      </div>
      <div className="panel">
        <h2>Runner security</h2>
        <StatusRow label="Sandbox" value="Required" tone="good" />
        <StatusRow label="Write access" value="Blocked" tone="bad" />
        <StatusRow label="Secrets" value="None" tone="good" />
        <StatusRow label="External" value="Locked" tone="bad" />
        <div className="approval-box">
          <strong>Approval checkpoint</strong>
          <p>This run created a proof packet draft. Nothing leaves your workspace unless you approve.</p>
          <StatusRow label="Public action" value="Requires approval" tone="bad" />
          <StatusRow label="Submission" value="Locked until approved" tone="bad" />
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
        <p className="small-label">Maintainer summary</p>
        <h2>Validated install docs in a clean fixture.</h2>
        <div className="case-summary-grid">
          <div className="case-summary-block">
            <span>What was tested</span>
            <strong>{demoPacket.objective}</strong>
          </div>
          <div className="case-summary-block">
            <span>Result</span>
            <strong>{demoPacket.result}</strong>
          </div>
          <div className="case-summary-block">
            <span>Evidence summary</span>
            <strong>{demoPacket.summary}</strong>
          </div>
          <div className="case-summary-block">
            <span>Recommended next action</span>
            <strong>{demoPacket.recommendedAction}</strong>
          </div>
        </div>
        <div className="review-grid">
          <div>
            <h2>Privacy review</h2>
            <ul className="check-list">
              {demoPacket.privacyReview.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Security review</h2>
            <ul className="check-list">
              {demoPacket.securityReview.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="panel">
        <h2>Proof artifacts</h2>
        <p className="quiet-copy">Generated by `npm run demo:packet`. Private artifacts stay inside the workspace unless approved.</p>
        {demoArtifacts.map((artifact) => (
          <div className="artifact-row rich-artifact-row" key={artifact.name}>
            <span>
              <strong>{artifact.name}</strong>
              <small>{artifact.purpose}</small>
            </span>
            <small>{artifact.visibility}</small>
          </div>
        ))}
      </div>
      <div className="decision-panel">
        <p className="small-label">Submit decision</p>
        <h2>Evidence first. Code later.</h2>
        <p>If accepted: $8 earned, +12 reputation, +2 credits.</p>
        <div className="share-split">
          <div>
            <strong>Shared with maintainer</strong>
            <ul className="check-list">
              {demoPacket.sharedWithMaintainer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Kept private</strong>
            <ul className="check-list">
              {demoPacket.keptPrivate.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
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
        <div className="maintainer-decision-grid">
          <div className="decision-summary">
            <h3>What was proven</h3>
            <p>Docs install flow fails because `docs-ready.flag` is missing in the clean fixture.</p>
            <div className="triage-grid">
              <StatusBlock label="Confidence" value="86%" />
              <StatusBlock label="Risk" value="Low" />
              <StatusBlock label="Artifacts" value="6 files" />
              <StatusBlock label="Privacy" value="Passed" />
              <StatusBlock label="Payout if accepted" value="$8 earned" />
            </div>
          </div>
          <div className="decision-summary">
            <h3>Decision support</h3>
            <StatusRow label="Policy" value="Evidence-only" tone="good" />
            <StatusRow label="Public action" value="None yet" tone="good" />
            <StatusRow label="Missing info" value="None" tone="good" />
            <StatusRow label="Recommended action" value="Accept" tone="good" />
          </div>
        </div>
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

function ScoreboardScreen({
  accepted,
  released,
  onRelease,
  onNext,
  onPublicProof
}: {
  accepted: boolean;
  released: boolean;
  onRelease: () => void;
  onNext: () => void;
  onPublicProof: () => void;
}) {
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
        <Metric label="Paid out" value={released ? "$8" : "$0"} />
        <Metric label="Reputation" value={accepted ? "176" : "164"} />
      </div>
      <div className="panel scoreboard-action-card">
        <p className="small-label">Next best action</p>
        <h2>
          {!accepted && "Get the packet accepted."}
          {accepted && !released && "Release the earned payout."}
          {accepted && released && "Start the next proof mission."}
        </h2>
        <p className="quiet-copy">
          {!accepted && "Ask the maintainer to accept the submitted packet."}
          {accepted && !released && "Release the earned payout as a separate accounting step."}
          {accepted && released && "Public proof, project credit, and payout records are ready for the demo."}
        </p>
        <button className="primary-action full" onClick={accepted && !released ? onRelease : onNext}>
          {accepted && !released ? "Release payout" : "Generate proof packet"}
        </button>
        <button className="secondary-action full" onClick={onPublicProof}>View public proof</button>
      </div>
      <div className="panel">
        <h2>Payout state</h2>
        <StatusRow label="Earned payout" value={accepted ? "$8 earned" : "Waiting"} tone={accepted ? "good" : "bad"} />
        <StatusRow label="Released payout" value={released ? "$8 released" : "Not released"} tone={released ? "good" : "bad"} />
        <StatusRow label="Method" value="Manual accounting" tone="good" />
        <p className="quiet-copy">Release is manual in the MVP. No money moves automatically.</p>
        <button className="primary-action full" disabled={!accepted || released} onClick={onRelease}>
          {released ? "Payout released" : "Release payout"}
        </button>
      </div>
      <div className="panel">
        <h2>Reputation unlock</h2>
        <StatusRow label="Current tier" value={demoUnlockProgress.currentTier} tone="good" />
        <StatusRow label="Next unlock" value={demoUnlockProgress.nextTier} tone="good" />
        <div className="unlock-progress" aria-label="Accepted packet progress">
          <span style={{ width: `${demoUnlockProgress.percent}%` }} />
        </div>
        <p className="quiet-copy">
          {demoUnlockProgress.acceptedPackets} / {demoUnlockProgress.neededPackets} accepted packets. {demoUnlockProgress.nextReward}
        </p>
      </div>
      <div className="panel">
        <h2>Recent activity</h2>
        {[...demoActivity, accepted ? "Earned payout created" : "", released ? "Released payout marked paid" : ""]
          .filter(Boolean)
          .map((item) => (
            <div className="activity-row" key={item}>
              {item}
            </div>
          ))}
      </div>
    </section>
  );
}

function PublicProofScreen({ onBack }: { onBack: () => void }) {
  return (
    <section className="page-grid case-grid">
      <header className="page-header">
        <span>Public Proof / {demoPacket.id}</span>
        <button className="secondary-action" onClick={onBack}>
          Back to Scoreboard
        </button>
      </header>
      <div className="hero-card public-proof-card">
        <p className="small-label">Accepted Proof Packet</p>
        <h1>Validate installation docs</h1>
        <p className="public-summary">
          Installation docs were tested in a clean environment. The accepted packet includes a safe summary,
          generated artifacts, verifier status, project credit, and payout outcome.
        </p>
        <div className="decision-row">
          <span className="status-pill safe">Accepted</span>
          <span className="status-pill safe">Public-safe</span>
          <span className="status-pill safe">Maintainer reviewed</span>
        </div>
      </div>
      <div className="panel">
        <h2>What was proven</h2>
        <ul className="check-list">
          <li>Commands executed in a clean fixture</li>
          <li>Logs captured for review</li>
          <li>Verifier checks passed</li>
          <li>No secrets or local paths exposed</li>
        </ul>
      </div>
      <div className="panel">
        <h2>Public artifacts</h2>
        <p className="quiet-copy">This view only exposes the public-safe subset. Raw logs, local paths, and payout internals stay private.</p>
        {demoPublicArtifacts.map((artifact) => (
          <div className="artifact-row rich-artifact-row" key={artifact.name}>
            <span>
              <strong>{artifact.name}</strong>
              <small>{artifact.purpose}</small>
            </span>
            <small>Safe to share</small>
          </div>
        ))}
        <div className="artifact-row rich-artifact-row">
          <span>
            <strong>summary.md</strong>
            <small>Maintainer-ready summary derived from the accepted case file.</small>
          </span>
          <small>Safe to share</small>
        </div>
      </div>
      <div className="decision-panel">
        <p className="small-label">Credit and payout</p>
        <StatusRow label="Project" value={demoProject.name} tone="good" />
        <StatusRow label="Contributor" value="alex" tone="good" />
        <StatusRow label="Earned payout" value="$8" tone="good" />
        <StatusRow label="Reputation" value="+12" tone="good" />
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

function StatusBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="status-block">
      <span>{label}</span>
      <strong>{value}</strong>
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
