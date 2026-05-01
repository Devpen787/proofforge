import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  demoActivity,
  demoArtifacts,
  demoConvertedMission,
  demoConvertedPacket,
  demoFirstRunSteps,
  demoMission,
  demoPacket,
  demoProject,
  demoProofLoop,
  demoPublicArtifacts,
  demoImportExample,
  demoMaintainerPackets,
  demoProjectWorkLead,
  demoSafetyDefaults,
  demoSourcePipeline,
  demoSourceTypes,
  demoUnlockProgress,
  demoWork,
  demoWorkLead,
  demoWorkLeadDiagnosis
} from "./demoData";
import { routeLabels, screens, type Screen } from "./routes";

type ActiveMission = "docs" | "checkout";

function screenFromHash(): Screen {
  const candidate = window.location.hash.replace("#", "");
  return screens.includes(candidate as Screen) ? (candidate as Screen) : "opportunity";
}

function App() {
  const [screen, setScreenState] = React.useState<Screen>(screenFromHash);
  const [packetReady, setPacketReady] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [accepted, setAccepted] = React.useState(false);
  const [released, setReleased] = React.useState(false);
  const [revisionRequested, setRevisionRequested] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);
  const [importedLead, setImportedLead] = React.useState(false);
  const [projectStarted, setProjectStarted] = React.useState(false);
  const [projectInviteSent, setProjectInviteSent] = React.useState(false);
  const [projectAgentAttached, setProjectAgentAttached] = React.useState(false);
  const [projectWorkSuggested, setProjectWorkSuggested] = React.useState(false);
  const [workLeadClarified, setWorkLeadClarified] = React.useState(false);
  const [workLeadConverted, setWorkLeadConverted] = React.useState(false);
  const [activeMission, setActiveMission] = React.useState<ActiveMission>("docs");
  const setScreen = React.useCallback((nextScreen: Screen) => {
    window.location.hash = nextScreen;
    setScreenState(nextScreen);
  }, []);
  const resetProof = React.useCallback(() => {
    setPacketReady(false);
    setSubmitted(false);
    setAccepted(false);
    setReleased(false);
    setRevisionRequested(false);
    setRejected(false);
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
        <ProofProgressBand screen={screen} packetReady={packetReady} submitted={submitted} accepted={accepted} released={released} />
        {screen === "opportunity" && (
          <OpportunityScreen
            onStart={() => {
              resetProof();
              setScreen("first-run");
            }}
          />
        )}
        {screen === "first-run" && <FirstRunScreen onRun={() => {
          setActiveMission("docs");
          setScreen("mission-detail");
        }} onQueue={() => setScreen("work-queue")} />}
        {screen === "projects" && (
          <ProjectsScreen
            projectStarted={projectStarted}
            inviteSent={projectInviteSent}
            agentAttached={projectAgentAttached}
            workSuggested={projectWorkSuggested}
            onStartProject={() => setProjectStarted(true)}
            onInvite={() => setProjectInviteSent(true)}
            onAttachAgent={() => setProjectAgentAttached(true)}
            onSuggestWork={() => {
              setProjectWorkSuggested(true);
              setScreen("work-queue");
            }}
            onQueue={() => setScreen("work-queue")}
          />
        )}
        {screen === "work-queue" && (
          <WorkQueueScreen
            importedLead={importedLead}
            projectWorkSuggested={projectWorkSuggested}
            workLeadClarified={workLeadClarified}
            workLeadConverted={workLeadConverted}
            onImport={() => setImportedLead(true)}
            onClarifyLead={() => setWorkLeadClarified(true)}
            onConvertLead={() => setWorkLeadConverted(true)}
            onRun={(mission) => {
              setActiveMission(mission);
              setScreen("mission-detail");
            }}
          />
        )}
        {screen === "mission-detail" && (
          <MissionDetailScreen
            activeMission={activeMission}
            onBack={() => setScreen("work-queue")}
            onAccept={() => setScreen("run")}
          />
        )}
        {screen === "run" && (
          <RunnerScreen
            activeMission={activeMission}
            onPacket={() => {
              setPacketReady(true);
              setScreen("case-file");
            }}
          />
        )}
        {screen === "case-file" && (
          <CaseFileScreen
            submitted={submitted}
            revisionRequested={revisionRequested}
            rejected={rejected}
            activeMission={activeMission}
            onSubmit={() => {
              setSubmitted(true);
              setRevisionRequested(false);
              setRejected(false);
              setScreen("maintainer");
            }}
          />
        )}
        {screen === "maintainer" && (
          <MaintainerScreen
            submitted={submitted}
            accepted={accepted}
            activeMission={activeMission}
            onAccept={() => {
              setSubmitted(true);
              setRevisionRequested(false);
              setRejected(false);
              setAccepted(true);
              setReleased(false);
              setScreen("scoreboard");
            }}
            onRevision={() => {
              setSubmitted(false);
              setRevisionRequested(true);
              setRejected(false);
              setScreen("case-file");
            }}
            onReject={() => {
              setSubmitted(false);
              setAccepted(false);
              setReleased(false);
              setRevisionRequested(false);
              setRejected(true);
              setScreen("scoreboard");
            }}
          />
        )}
        {screen === "scoreboard" && (
          <ScoreboardScreen
            accepted={accepted}
            released={released}
            revisionRequested={revisionRequested}
            rejected={rejected}
            activeMission={activeMission}
            onRelease={() => setReleased(true)}
            onResolveRevision={() => setScreen("case-file")}
            onNext={() => {
              resetProof();
              setScreen("first-run");
            }}
            onPublicProof={() => setScreen("public-proof")}
          />
        )}
        {screen === "public-proof" && <PublicProofScreen activeMission={activeMission} onBack={() => setScreen("scoreboard")} />}
      </main>
    </div>
  );
}

function ProofProgressBand({
  screen,
  packetReady,
  submitted,
  accepted,
  released
}: {
  screen: Screen;
  packetReady: boolean;
  submitted: boolean;
  accepted: boolean;
  released: boolean;
}) {
  const routeStage: Record<Screen, number> = {
    opportunity: 0,
    "first-run": 1,
    projects: 1,
    "work-queue": 1,
    "mission-detail": 1,
    run: 2,
    "case-file": 3,
    maintainer: 4,
    scoreboard: accepted || released ? 5 : 4,
    "public-proof": released ? 6 : 5
  };
  const stages = [
    { label: "Work Lead", detail: "Existing work", done: true },
    { label: "Mission", detail: "Scoped and safe", done: false },
    { label: "Safe Run", detail: "Local evidence", done: packetReady || submitted || accepted || released },
    { label: "Packet", detail: "Case file ready", done: packetReady || submitted || accepted || released },
    { label: "Review", detail: "Maintainer decision", done: submitted || accepted || released },
    { label: "Earned", detail: "Accepted proof", done: accepted || released },
    { label: "Released", detail: "Manual payout", done: released }
  ];
  const stateStage = released ? 6 : accepted ? 5 : submitted ? 4 : packetReady ? 3 : 0;
  const activeIndex = Math.max(routeStage[screen], stateStage);

  return (
    <section className="proof-progress-band" aria-label="Proof progress">
      <div>
        <p className="small-label">Current proof loop</p>
        <strong>{stages[activeIndex].label}</strong>
        <span>{stages[activeIndex].detail}</span>
      </div>
      <ol>
        {stages.map((stage, index) => (
          <li className={index < activeIndex || stage.done ? "done" : index === activeIndex ? "active" : ""} key={stage.label}>
            <span>{index + 1}</span>
            <b>{stage.label}</b>
          </li>
        ))}
      </ol>
    </section>
  );
}

function OpportunityScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="page-grid page-grid-hero">
      <div className="hero-card">
        <p className="small-label">Proof before payout</p>
        <h1>Find useful work. Let your agents prove it. Earn when it holds up.</h1>
        <div className="safety-list">
          <span>Real work sources, not made-up tasks.</span>
          <span>No public posts, PRs, or payments until approval.</span>
          <span>Your agent runs safely and produces evidence.</span>
          <span>Accepted proof creates payout, credit, or reputation.</span>
        </div>
        <button className="primary-action" onClick={onStart}>
          Earn your first proof packet
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
      <Metric label="Proof accepted this week" value="128" />
      <Metric label="Active nodes" value="42" />
      <Metric label="Your earnable fit" value="$63" />
    </div>
  );
}

function ProofLoopCard() {
  return (
    <section className="proof-loop-card" aria-label="ProofForge proof loop">
      <p className="small-label">How earning works</p>
      <h2>Your agent helps. Proof decides. Value follows.</h2>
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
      <p className="quiet-copy">This is not passive income. Raw work never skips the gate. Accepted evidence is what creates earned value.</p>
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
        <h2>Earn your first accepted proof in six steps.</h2>
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
        <p className="quiet-copy">Start with a safe docs validation mission. Your agent runs locally, captures evidence, and stops for approval before anything is submitted or earned.</p>
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
        <button className="primary-action full" onClick={onRun}>Run safest earning mission</button>
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

function MissionDetailScreen({
  activeMission,
  onBack,
  onAccept
}: {
  activeMission: ActiveMission;
  onBack: () => void;
  onAccept: () => void;
}) {
  const mission = activeMission === "checkout" ? demoConvertedMission : demoMission;
  const packet = activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const owner = activeMission === "checkout" ? demoWorkLead.acceptsProof : "Commons reviewer";
  const proofShape = activeMission === "checkout" ? "Browser logs, screenshots, environment, and verifier notes." : "Install transcript, environment, runner output, and verifier notes.";
  const successCriteria =
    activeMission === "checkout"
      ? ["Chrome checkout completes with expected confirmation", "Safari result is captured with logs", "No payment credentials or customer data are exposed"]
      : ["Documented command is run in a clean fixture", "Failure or success is captured with logs", "Maintainer can understand the next fix"];
  const blockedActions = ["Open PRs", "Post public comments", "Spend funds", "Access private repos"];

  return (
    <section className="page-grid mission-detail-grid">
      <header className="page-header">
        <span>Mission Detail / {mission.title}</span>
        <button className="secondary-action" onClick={onBack}>Back to Work Queue</button>
      </header>

      <div className="mission-brief">
        <div>
          <p className="small-label">Accept mission before agents run</p>
          <h2>{mission.title}</h2>
          <p>{activeMission === "checkout" ? "This Work Lead was clarified and converted into a proofable browser QA mission." : "This starter mission is safe, local, and designed to create the first accepted proof packet."}</p>
        </div>
        <div className="mission-reward-card">
          <span>Earn if accepted</span>
          <strong>{mission.reward}</strong>
          <small>+12 reputation, +2 credits</small>
        </div>
      </div>

      <div className="panel mission-detail-main">
        <p className="small-label">What must be proven</p>
        <h2>{packet.objective}</h2>
        <div className="mission-detail-facts">
          <StatusBlock label="Accepts proof" value={owner} />
          <StatusBlock label="Risk" value={mission.risk} />
          <StatusBlock label="Runtime" value={mission.runtime} />
          <StatusBlock label="Repo / source" value={mission.repo} />
        </div>
        <div className="mission-section-grid">
          <div>
            <h3>Success criteria</h3>
            <ul className="check-list">
              {successCriteria.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Required proof</h3>
            <p className="quiet-copy">{proofShape}</p>
            <div className="tag-row">
              {packet.artifacts.slice(0, 4).map((artifact) => (
                <span className="status-pill safe" key={artifact}>{artifact}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <p className="small-label">Agent permissions</p>
        <h2>Useful, but boxed in.</h2>
        <StatusRow label="Clone/load repo" value="Allowed" tone="good" />
        <StatusRow label="Run commands" value="Allowed" tone="good" />
        <StatusRow label="Capture logs" value="Allowed" tone="good" />
        {blockedActions.map((action) => (
          <StatusRow key={action} label={action} value="Blocked" tone="bad" />
        ))}
      </div>

      <div className="decision-panel mission-accept-panel">
        <p className="small-label">Mission terms</p>
        <h2>Proof earns value only after acceptance.</h2>
        <p>Run the agent locally, review the packet, then submit only if the evidence is safe and useful.</p>
        <StatusRow label="Public action" value="None before approval" tone="good" />
        <StatusRow label="Payout" value="Earned only if accepted" tone="good" />
        <StatusRow label="Release" value="Manual accounting" tone="good" />
        <button className="primary-action full" onClick={onAccept}>Accept mission and run agent</button>
      </div>
    </section>
  );
}

function ProjectsScreen({
  projectStarted,
  inviteSent,
  agentAttached,
  workSuggested,
  onStartProject,
  onInvite,
  onAttachAgent,
  onSuggestWork,
  onQueue
}: {
  projectStarted: boolean;
  inviteSent: boolean;
  agentAttached: boolean;
  workSuggested: boolean;
  onStartProject: () => void;
  onInvite: () => void;
  onAttachAgent: () => void;
  onSuggestWork: () => void;
  onQueue: () => void;
}) {
  const capacityRows = [
    { label: "People", value: demoProject.people, detail: "contributors and reviewers" },
    { label: "Agents", value: projectAgentCount(agentAttached), detail: "constrained project helpers" },
    { label: "Accepted proof", value: demoProject.acceptedProof, detail: "shared project assets" },
    { label: "Reward pool", value: demoProject.pool, detail: "funds useful work" }
  ];
  const sharedMissionSteps = [
    { label: "Open work", value: "Docs friction", tone: "good" as const },
    { label: "Next mission", value: "Clean install proof", tone: "good" as const },
    { label: "Who accepts", value: "Commons reviewer", tone: "good" as const },
    { label: "Credit path", value: "Accepted packet", tone: "good" as const }
  ];
  return (
    <section className="page-grid projects-grid">
      <header className="page-header">
        <span>Projects / Commons</span>
        <button className="primary-action" onClick={onStartProject}>
          {projectStarted ? "Project Started" : "Start Project"}
        </button>
      </header>
      {projectStarted && (
        <div className="project-action-banner wide" role="status">
          <div>
            <strong>New project shell created</strong>
            <span>Purpose, lanes, first steward, and reward pool are now visible. Next: invite one contributor or attach one constrained agent.</span>
          </div>
          <span className="status-pill safe">Launch draft</span>
        </div>
      )}
      <div className="project-commons-hero wide">
        <div>
          <p className="small-label">Build together, prove together, receive credit together</p>
          <h2>{demoProject.name}</h2>
          <p>{demoProject.purpose} People bring judgment, agents do constrained work, and accepted packets become shared proof, payout records, and project credit.</p>
          <div className="project-action-strip" aria-label="Project actions">
            <button className="secondary-action" onClick={onInvite}>{inviteSent ? "Invite pending" : "Invite contributor"}</button>
            <button className="secondary-action" onClick={onAttachAgent}>{agentAttached ? "Agent attached" : "Attach agent"}</button>
            <button className="secondary-action" onClick={onSuggestWork}>{workSuggested ? "Work lead created" : "Suggest work"}</button>
            <button className="primary-action" onClick={onQueue}>Open Work Queue</button>
          </div>
        </div>
        <div className="shared-mission-card">
          <span className="status-pill safe">{demoProject.status}</span>
          <strong>Current shared mission</strong>
          <p>Make the first install path easier by converting docs problems into accepted evidence packets.</p>
          {sharedMissionSteps.map((item) => (
            <StatusRow key={item.label} label={item.label} value={item.value} tone={item.tone} />
          ))}
        </div>
      </div>
      <div className="project-capacity-strip wide">
        {capacityRows.map((item) => (
          <div className="project-capacity-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            <small>{item.detail}</small>
          </div>
        ))}
      </div>
      <div className="panel command-room project-next-panel">
        <p className="small-label">Next coordination move</p>
        <h2>{workSuggested ? "Turn the new Work Lead into a scoped Mission." : inviteSent || agentAttached ? "Add one proofable Work Lead." : "Bring in one person and one constrained agent."}</h2>
        <p>Projects are not folders. They are shared work agreements: people, nodes, and agents coordinate around proofable missions and receive credit only when packets are accepted.</p>
        <div className="command-state-grid">
          <StatusRow label="Project shell" value={projectStarted ? "Created" : "Ready"} tone="good" />
          <StatusRow label="Invite" value={inviteSent ? "Pending" : "Not sent"} tone={inviteSent ? "good" : "bad"} />
          <StatusRow label="Agent" value={agentAttached ? "Attached" : "Not attached"} tone={agentAttached ? "good" : "bad"} />
          <StatusRow label="Work lead" value={workSuggested ? "Created" : "Not suggested"} tone={workSuggested ? "good" : "bad"} />
        </div>
      </div>
      <div className="panel project-lanes-panel">
        <p className="small-label">Open mission lanes</p>
        <h2>Mission lanes</h2>
        <div className="tag-row">
          {demoProject.lanes.map((lane) => (
            <span className="status-pill safe" key={lane}>
              {lane}
            </span>
          ))}
        </div>
        <p className="quiet-copy">Each lane must produce a maintainer-ready Evidence Packet before any payout or project credit.</p>
      </div>
      <div className="panel project-backlog-panel">
        <p className="small-label">Work becoming missions</p>
        <h2>Backlog</h2>
        {workSuggested && (
          <div className="artifact-row">
            <span>{demoProjectWorkLead.title}</span>
            <small>work lead</small>
          </div>
        )}
        {demoProject.backlog.map((item) => (
          <div className="artifact-row" key={item.title}>
            <span>{item.title}</span>
            <small>{item.status}</small>
          </div>
        ))}
      </div>
      <div className="project-ledger-panel wide">
        <div className="project-ledger-summary">
          <div>
            <p className="small-label">Shared proof ledger</p>
            <h2>Accepted packets are the project asset.</h2>
            <p>Commercial work can fund the commons, but the project only counts work after accepted evidence. That keeps rewards tied to useful proof instead of noise.</p>
          </div>
          <div className="ledger-mini-grid">
            <StatusBlock label="Accepted packets" value={demoProject.proofLedger.acceptedPackets} />
            <StatusBlock label="Pending packets" value={demoProject.proofLedger.pendingPackets} />
            <StatusBlock label="Earned payouts" value={demoProject.proofLedger.earnedPayouts} />
            <StatusBlock label="Latest proof" value={demoProject.proofLedger.latestProof} />
          </div>
        </div>
        <div className="project-proof-history">
          {demoProject.proofLedger.history.map((item) => (
            <div className="project-proof-row" key={item.label}>
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
              <b>{item.value}</b>
            </div>
          ))}
        </div>
        <p className="quiet-copy">Top contributors: {demoProject.proofLedger.topContributors.join(", ")}</p>
      </div>
      <div className="panel">
        <p className="small-label">People capacity</p>
        <h2>People</h2>
        {inviteSent && (
          <div className="compact-row">
            <span>
              <strong>sam@builder.dev</strong>
              <small>Contributor invite</small>
            </span>
            <span className="status-pill warning">Pending</span>
          </div>
        )}
        {demoProject.peopleRoster.map((person) => (
          <div className="compact-row" key={person.name}>
            <span>
              <strong>{person.name}</strong>
              <small>{person.role}</small>
            </span>
            <span className="status-pill safe">{person.status}</span>
          </div>
        ))}
      </div>
      <div className="panel wide">
        <div className="section-heading">
          <div>
            <h2>Agent delegations</h2>
            <p className="quiet-copy">Delegate capability, not control. Agents help with project lanes, but blocked actions stay blocked.</p>
          </div>
          <button className="secondary-action" onClick={onAttachAgent}>{agentAttached ? "Agent Attached" : "Attach Agent"}</button>
        </div>
        <div className="agent-card-grid">
          {agentAttached && (
            <div className="agent-card">
              <div className="section-heading">
                <strong>browser-qa-02</strong>
                <span className="status-pill warning">Pending review</span>
              </div>
              <StatusRow label="Allowed" value="Browser checks, screenshots" tone="good" />
              <StatusRow label="Blocked" value="PRs, posts, payments" tone="bad" />
            </div>
          )}
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

function projectAgentCount(agentAttached: boolean) {
  return String(Number(demoProject.agents) + (agentAttached ? 1 : 0));
}

function WorkQueueScreen({
  importedLead,
  projectWorkSuggested,
  workLeadClarified,
  workLeadConverted,
  onImport,
  onClarifyLead,
  onConvertLead,
  onRun
}: {
  importedLead: boolean;
  projectWorkSuggested: boolean;
  workLeadClarified: boolean;
  workLeadConverted: boolean;
  onImport: () => void;
  onClarifyLead: () => void;
  onConvertLead: () => void;
  onRun: (mission: ActiveMission) => void;
}) {
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
          <button className="secondary-action" onClick={onImport}>{importedLead ? "Imported" : "Import external task"}</button>
        </div>
        <div className="pipeline-strip" aria-label="Work intake pipeline">
          {demoSourcePipeline.map((item) => (
            <div className="pipeline-step" key={item.label}>
              <strong>{importedLead && item.label === "Imported" ? "9" : item.value}</strong>
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
        {importedLead && (
          <div className="import-result-card" role="status">
            <div>
              <p className="small-label">Imported Work Lead ready for triage</p>
              <h3>GitHub issue imported locally.</h3>
              <p>No comments, PRs, payments, or maintainer outreach happened. The imported work is now a Work Lead and still needs proofability checks before it can become a Mission.</p>
            </div>
            <div className="diagnosis-grid">
              <StatusRow label="Source" value="GitHub issue" tone="good" />
              <StatusRow label="External action" value="None" tone="good" />
              <StatusRow label="Mission status" value="Needs triage" tone="bad" />
            </div>
          </div>
        )}
        {projectWorkSuggested && (
          <div className="project-work-lead-card" role="status">
            <div>
              <p className="small-label">Project Work Lead created</p>
              <h3>{demoProjectWorkLead.title}</h3>
              <p>{demoProjectWorkLead.rawRequest}</p>
            </div>
            <div className="diagnosis-grid">
              <StatusRow label="Source" value={demoProjectWorkLead.source} tone="good" />
              <StatusRow label="Proofability" value={demoProjectWorkLead.proofability} tone="good" />
              <StatusRow label="Missing" value={demoProjectWorkLead.missing} tone="bad" />
              <StatusRow label="Recommendation" value="Clarify before Mission" tone="bad" />
            </div>
          </div>
        )}
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
          <strong>{workLeadClarified ? "88%" : demoWorkLead.proofability}</strong>
          <small>{workLeadConverted ? "Converted to Mission." : workLeadClarified ? "Mission-ready after clarification." : "Good, but not mission-ready."}</small>
        </div>
        <div className="triage-grid">
          <StatusBlock label="Risk" value={demoWorkLead.risk} />
          <StatusBlock label="Reward" value={demoWorkLead.reward} />
          <StatusBlock label="Accepts proof" value={demoWorkLead.acceptsProof} />
          <StatusBlock label="Missing" value={workLeadClarified ? "None" : demoWorkLead.missing} />
          <StatusBlock label="Can convert?" value={workLeadClarified ? "Yes" : demoWorkLead.canConvert} />
          <StatusBlock label="Reason" value={workLeadClarified ? "Browser targets confirmed by owner." : demoWorkLead.conversionReason} />
        </div>
        <div className="recommendation-box">
          <strong>Recommendation</strong>
          <p>{workLeadConverted ? "Mission created. The work is now scoped and safe to run." : workLeadClarified ? "Convert this clarified Work Lead into a scoped Mission." : demoWorkLead.recommendation}</p>
          {workLeadClarified && (
            <div className="mission-ready-card" role="status">
              <span className="status-pill safe">{workLeadConverted ? "Mission created" : "Mission-ready"}</span>
              <strong>Checkout QA verification has defined browser targets and an acceptance owner.</strong>
              <small>Required evidence: Chrome and Safari screenshots, console logs, environment summary, and maintainer-safe packet.</small>
            </div>
          )}
          <div className="diagnosis-grid">
            {demoWorkLeadDiagnosis.map((item) => (
              <StatusRow
                key={item.label}
                label={item.label}
                value={workLeadClarified && item.label === "Missing detail" ? "Browser versions confirmed" : workLeadClarified && item.label === "Conversion gate" ? "Mission-ready" : item.value}
                tone={workLeadClarified && (item.label === "Missing detail" || item.label === "Conversion gate") ? "good" : item.tone}
              />
            ))}
          </div>
          {!workLeadClarified && <div className="clarification-box">
            <span>Next clarification question</span>
            <strong>{demoWorkLead.nextQuestion}</strong>
          </div>}
          <div className="decision-row">
            <button className="primary-action" onClick={onClarifyLead} disabled={workLeadClarified}>{workLeadClarified ? "Clarification received" : "Ask clarification"}</button>
            <button className="secondary-action" disabled={!workLeadClarified || workLeadConverted} title={workLeadClarified ? "Work Lead is ready to convert" : "Missing browser versions must be clarified first"} onClick={onConvertLead}>
              {workLeadConverted ? "Converted to Mission" : workLeadClarified ? "Convert to Mission" : "Convert when ready"}
            </button>
            <button className="danger-action">Reject</button>
          </div>
        </div>
      </div>
      {workLeadConverted && (
        <div className="panel mission-created-panel">
          <h2>Converted mission</h2>
          <p>Checkout QA verification is now a scoped Mission with owner, artifacts, risk, and approval rules.</p>
          <StatusRow label="Owner" value="External buyer" tone="good" />
          <StatusRow label="Risk" value="Medium" tone="bad" />
          <StatusRow label="Approval" value="Evidence-only before submit" tone="good" />
          <button className="primary-action full" onClick={() => onRun("checkout")}>Run converted mission</button>
        </div>
      )}
      <div className="panel">
        <h2>Scoped starter mission</h2>
        <p>Validate installation docs in a clean fixture. This is safe, local, and evidence-only.</p>
        <button className="primary-action full" onClick={() => onRun("docs")}>
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
      <div className="panel">
        <h2>Mission readiness</h2>
        <StatusRow label="Objective" value="Clear" tone="good" />
        <StatusRow label="Reward path" value="External" tone="good" />
        <StatusRow label="Acceptance owner" value="Known" tone="good" />
        <StatusRow label="Missing data" value={workLeadClarified ? "None" : "Browser versions"} tone={workLeadClarified ? "good" : "bad"} />
        <p className="quiet-copy">
          {workLeadConverted
            ? "This Work Lead has been converted into a scoped Mission and can now be run with human approval gates."
            : workLeadClarified
              ? "The missing target was clarified. This Work Lead can become a Mission."
              : "ProofForge can import the work now, but will not run the mission until the missing test target is clarified."}
        </p>
      </div>
    </section>
  );
}

function RunnerScreen({ activeMission, onPacket }: { activeMission: ActiveMission; onPacket: () => void }) {
  const mission = activeMission === "checkout" ? demoConvertedMission : demoMission;
  const runSteps =
    activeMission === "checkout"
      ? [
          { label: "Sandbox created", detail: "Browser test profile isolated", status: "complete", artifact: "policy.json" },
          { label: "Source prepared", detail: "Checkout target loaded from Work Lead", status: "complete", artifact: "environment.json" },
          { label: "Commands executed", detail: "Chrome and Safari checks completed", status: "complete", artifact: "browser-report.json" },
          { label: "Logs captured", detail: "Console and screenshot evidence saved", status: "complete", artifact: "chrome.png, safari.png" },
          { label: "Verifier checked", detail: "Artifacts and policy reviewed independently", status: "complete", artifact: "verifier.json" },
          { label: "Packet draft ready", detail: "Human approval required before submission", status: "approval", artifact: "evidence-packet.json" }
        ]
      : [
          { label: "Sandbox created", detail: "Clean fixture workspace prepared", status: "complete", artifact: "policy.json" },
          { label: "Source prepared", detail: "Docs validation fixture loaded", status: "complete", artifact: "environment.json" },
          { label: "Command executed", detail: "Install check produced a reproducible failure", status: "complete", artifact: "runner-result.json" },
          { label: "Logs captured", detail: "stdout and stderr saved for review", status: "complete", artifact: "stdout.log, stderr.log" },
          { label: "Verifier checked", detail: "Independent checks confirmed packet evidence", status: "complete", artifact: "verifier.json" },
          { label: "Packet draft ready", detail: "Human approval required before submission", status: "approval", artifact: "evidence-packet.json" }
        ];
  const agentRows = [
    { name: "Runner", work: activeMission === "checkout" ? "Runs browser QA checks" : "Runs install proof command", status: "Passed" },
    { name: "Verifier", work: "Checks artifacts independently", status: "Passed" },
    { name: "Skeptic", work: "Looks for false positives", status: "Passed" },
    { name: "Packager", work: "Builds maintainer case file", status: "Ready" }
  ];
  const output =
    activeMission === "checkout"
      ? `$ npm run proof:browser

Checking checkout flow in Chrome and Safari...
Chrome checkout completed with expected confirmation.
Safari confirmation logs are incomplete.

Artifacts written:
browser-report.json
chrome.png
safari.png
environment.json`
      : `$ npm run proof:check

Checking documented install flow...
Missing docs-ready.flag. The documented setup is incomplete.

Artifacts written:
runner-result.json
stdout.log
stderr.log
environment.json`;

  return (
    <section className="page-grid runner-grid">
      <header className="page-header">
        <span>Runner / {mission.title}</span>
        <button className="danger-action">Cancel Run</button>
      </header>
      <div className="runner-hero">
        <div>
          <p className="small-label">Agent run, still local</p>
          <h2>Agents did the work. You decide what leaves.</h2>
          <p>No public action has been taken. This run created evidence only inside the workspace.</p>
        </div>
        <div className="runner-hero-stats">
          <StatusRow label="Earn if accepted" value={mission.reward} tone="good" />
          <StatusRow label="External actions" value="Locked" tone="bad" />
          <StatusRow label="Packet state" value="Draft ready" tone="good" />
        </div>
      </div>
      <div className="panel runner-timeline-panel">
        <div className="section-heading">
          <div>
            <p className="small-label">Mission lifecycle</p>
            <h2>Evidence packet draft ready</h2>
          </div>
          <span className="status-pill warning">Approval needed</span>
        </div>
        <RunnerTimeline steps={runSteps} />
      </div>
      <div className="terminal-card">
        <h2>Live output</h2>
        <pre>{output}</pre>
      </div>
      <div className="panel">
        <p className="small-label">Agent work stack</p>
        <h2>Specialized agents, bounded jobs.</h2>
        <div className="agent-run-list">
          {agentRows.map((agent) => (
            <div className="agent-run-row" key={agent.name}>
              <span>
                <strong>{agent.name}</strong>
                <small>{agent.work}</small>
              </span>
              <span className="status-pill safe">{agent.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <p className="small-label">Output preview</p>
        <h2>Packet files produced</h2>
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
        <p className="small-label">Runner security</p>
        <h2>Useful work, locked boundaries.</h2>
        <StatusRow label="Sandbox" value="Required" tone="good" />
        <StatusRow label="Write access" value="Blocked" tone="bad" />
        <StatusRow label="Secrets" value="None" tone="good" />
        <StatusRow label="External" value="Locked" tone="bad" />
        <div className="approval-box">
          <strong>Human approval checkpoint</strong>
          <p>This run created a proof packet draft. Nothing leaves your workspace and nothing is earned unless a human approves and a maintainer accepts.</p>
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

function CaseFileScreen({
  submitted,
  revisionRequested,
  rejected,
  activeMission,
  onSubmit
}: {
  submitted: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  activeMission: ActiveMission;
  onSubmit: () => void;
}) {
  const packet = activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const mission = activeMission === "checkout" ? demoConvertedMission : demoMission;
  const caseTitle = activeMission === "checkout" ? "Verified checkout QA with clarified browser targets." : "Validated install docs in a clean fixture.";
  const artifactPurpose = activeMission === "checkout" ? "Browser QA proof artifact for maintainer review." : "Generated proof artifact for maintainer review.";
  return (
    <section className="page-grid case-grid case-dossier-grid">
      <header className="page-header">
        <span>Case File / {packet.id}</span>
        <button className="primary-action" onClick={onSubmit} disabled={submitted}>{submitted ? "Submitted" : "Submit Packet"}</button>
      </header>
      <div className="case-dossier">
        <div className="case-dossier-hero">
          <div>
            <p className="small-label">Evidence packet preview</p>
            <h2>{caseTitle}</h2>
            <p>{packet.summary}</p>
          </div>
          <div className="case-dossier-meta" aria-label="Packet status">
            <span className="status-pill safe">Verifier passed</span>
            <span className="status-pill safe">Evidence-only</span>
            <span className="status-pill safe">No public action</span>
          </div>
        </div>
        {revisionRequested && (
          <div className="revision-banner" role="status">
            <strong>Revision requested</strong>
            <span>Maintainer asked for clearer environment notes and the full command transcript before acceptance.</span>
          </div>
        )}
        {rejected && (
          <div className="rejection-banner" role="status">
            <strong>Packet rejected</strong>
            <span>The evidence was closed without payout. Start a new mission or rebuild the packet with stronger proof.</span>
          </div>
        )}

        <div className="case-dossier-body">
          <aside className="case-file-rail" aria-label="Case file sections">
            {["Summary", "Artifacts", "Verifier", "Privacy", "Submit"].map((item, index) => (
              <span className={index === 0 ? "active" : ""} key={item}>{item}</span>
            ))}
          </aside>

          <div className="case-file-document">
            <section className="case-document-section">
              <p className="small-label">Maintainer summary</p>
              <div className="case-summary-grid compact-case-grid">
                <div className="case-summary-block">
                  <span>What was tested</span>
                  <strong>{packet.objective}</strong>
                </div>
                <div className="case-summary-block result-block">
                  <span>Observed result</span>
                  <strong>{packet.result}</strong>
                </div>
                <div className="case-summary-block">
                  <span>Recommended next action</span>
                  <strong>{packet.recommendedAction}</strong>
                </div>
              </div>
            </section>

            <section className="case-document-section">
              <div className="section-heading">
                <div>
                  <p className="small-label">Proof artifacts</p>
                  <h2>Maintainer-ready evidence bundle</h2>
                </div>
                <span className="status-pill safe">{packet.artifacts.length} files</span>
              </div>
              <div className="artifact-manifest">
                {packet.artifacts.map((artifact) => (
                  <div className="artifact-manifest-row" key={artifact}>
                    <span>
                      <strong>{artifact}</strong>
                      <small>{artifactPurpose}</small>
                    </span>
                    <small>{artifact.includes("payout") ? "Private" : "Maintainer"}</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="case-document-section verification-section">
              <div>
                <p className="small-label">Verifier result</p>
                <h2>Builder does not grade its own work.</h2>
                <div className="packet-facts">
                  <StatusRow label="Packet status" value="Draft, approved locally" tone="good" />
                  <StatusRow label="Verifier" value="Passed" tone="good" />
                  <StatusRow label="Policy" value="Evidence-only" tone="good" />
                  <StatusRow label="Public action" value="None taken" tone="good" />
                </div>
              </div>
              <div>
                <p className="small-label">Safety reviews</p>
                <div className="review-grid">
                  <div>
                    <h2>Privacy</h2>
                    <ul className="check-list">
                      {packet.privacyReview.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2>Security</h2>
                    <ul className="check-list">
                      {packet.securityReview.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div className="decision-panel">
        <p className="small-label">Submit decision</p>
        <h2>Evidence first. Code later.</h2>
        <p>If accepted: {mission.reward} earned, +12 reputation, +2 credits.</p>
        <code>Download JSON via npm run demo:packet</code>
        <div className="share-split">
          <div>
            <strong>Shared with maintainer</strong>
            <ul className="check-list">
              {packet.sharedWithMaintainer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Kept private</strong>
            <ul className="check-list">
              {packet.keptPrivate.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <button className="primary-action full" onClick={onSubmit} disabled={submitted}>
          {submitted ? "Submitted to Maintainer Inbox" : "Submit to Maintainer Inbox"}
        </button>
      </div>
    </section>
  );
}

function MaintainerScreen({
  submitted,
  accepted,
  activeMission,
  onAccept,
  onRevision,
  onReject
}: {
  submitted: boolean;
  accepted: boolean;
  activeMission: ActiveMission;
  onAccept: () => void;
  onRevision: () => void;
  onReject: () => void;
}) {
  const packet = activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const mission = activeMission === "checkout" ? demoConvertedMission : demoMission;
  const hasReviewPacket = submitted || !accepted;
  const evidenceChecks = [
    { label: "Proof summary", value: "Readable in under 60 seconds", tone: "good" as const },
    { label: "Artifacts", value: `${packet.artifacts.length} attached`, tone: "good" as const },
    { label: "Verifier", value: "Independent check passed", tone: "good" as const },
    { label: "Privacy", value: "Secrets and local paths safe", tone: "good" as const },
    { label: "Risk", value: mission.risk, tone: mission.risk === "Medium" ? "bad" as const : "good" as const }
  ];
  const revisionReasons = activeMission === "checkout"
    ? ["Ask for Safari confirmation logs", "Request exact browser build numbers", "Require screenshot annotation"]
    : ["Ask for full command transcript", "Request environment details", "Clarify missing docs-ready.flag step"];
  return (
    <section className="page-grid maintainer-grid">
      <header className="page-header">
        <span>Maintainer Workspace</span>
        <button className="primary-action" onClick={onAccept} disabled={accepted}>
          {accepted ? "Accepted" : "Accept & Mark Earned"}
        </button>
      </header>
      <div className="maintainer-hero">
        <div>
          <p className="small-label">Decision queue</p>
          <h2>Review clean proof, not agent noise.</h2>
          <p>One submitted packet is ready. Acceptance creates earned value, revision sends structured feedback, rejection closes the packet without payout.</p>
        </div>
        <div className="maintainer-hero-state">
          <StatusRow label="Queue" value={accepted ? "Closed" : hasReviewPacket ? "1 submitted" : "No packet"} tone={hasReviewPacket || accepted ? "good" : "bad"} />
          <StatusRow label="Decision needed" value={accepted ? "No" : "Yes"} tone={accepted ? "good" : "bad"} />
          <StatusRow label="Economic action" value="Earned only on accept" tone="good" />
        </div>
      </div>
      <div className="metric-strip compact">
        <Metric label="Submitted" value={accepted ? "0" : hasReviewPacket ? "1" : "0"} />
        <Metric label="Unresolved" value={accepted ? "0" : "1"} />
        <Metric label="Accepted" value={accepted ? "1" : "0"} />
        <Metric label="Revision" value="0" />
      </div>
      <div className="panel maintainer-side-panel">
        <h2>Recent packets</h2>
        {demoMaintainerPackets.map((packet) => (
          <div className="compact-row" key={packet.title}>
            <span>
              <strong>{packet.title}</strong>
              <small>{packet.detail}</small>
            </span>
            <span className={packet.status === "Revision" ? "status-pill warning" : "status-pill safe"}>{packet.status}</span>
          </div>
        ))}
      </div>
      <div className="panel maintainer-side-panel">
        <h2>Review standard</h2>
        {evidenceChecks.map((check) => (
          <StatusRow key={check.label} label={check.label} value={check.value} tone={check.tone} />
        ))}
        <p className="quiet-copy">Maintainers decide from evidence, not raw agent logs.</p>
      </div>
      <div className="maintainer-decision-card wide">
        <div className="maintainer-card-header">
          <div>
            <p className="small-label">Submitted evidence packet</p>
            <h2>{mission.title}</h2>
            <p>{packet.summary}</p>
          </div>
          <span className={accepted ? "status-pill safe" : "status-pill warning"}>{accepted ? "Accepted" : "Needs decision"}</span>
        </div>
        <div className="maintainer-decision-grid">
          <div className="decision-summary">
            <h3>What was proven</h3>
            <p>{packet.result}</p>
            <div className="triage-grid">
              <StatusBlock label="Confidence" value="86%" />
              <StatusBlock label="Risk" value={mission.risk} />
              <StatusBlock label="Artifacts" value={`${packet.artifacts.length} files`} />
              <StatusBlock label="Privacy" value="Passed" />
              <StatusBlock label="Payout if accepted" value={`${mission.reward} earned`} />
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
        <div className="maintainer-evidence-grid">
          <div>
            <h3>Evidence bundle</h3>
            {packet.artifacts.slice(0, 5).map((artifact) => (
              <div className="compact-row" key={artifact}>
                <span>
                  <strong>{artifact}</strong>
                  <small>{artifact.includes("payout") ? "Private accounting" : "Maintainer evidence"}</small>
                </span>
                <span className="status-pill safe">Ready</span>
              </div>
            ))}
          </div>
          <div>
            <h3>Decision consequences</h3>
            <StatusRow label="Accept" value={`${mission.reward} earned + reputation`} tone="good" />
            <StatusRow label="Revision" value="No payout yet" tone="bad" />
            <StatusRow label="Reject" value="No payout or public proof" tone="bad" />
            <div className="revision-reasons">
              <strong>Structured revision options</strong>
              {revisionReasons.map((reason) => (
                <span key={reason}>{reason}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="decision-row">
          <button className="secondary-action">Review Packet</button>
          <button className="primary-action" onClick={onAccept} disabled={accepted}>
            {accepted ? "Accepted" : "Accept & Mark Earned"}
          </button>
          <button className="warning-action" onClick={onRevision}>Request Revision</button>
          <button className="danger-action" onClick={onReject}>Reject Packet</button>
        </div>
      </div>
    </section>
  );
}

function ScoreboardScreen({
  accepted,
  released,
  revisionRequested,
  rejected,
  activeMission,
  onRelease,
  onResolveRevision,
  onNext,
  onPublicProof
}: {
  accepted: boolean;
  released: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  activeMission: ActiveMission;
  onRelease: () => void;
  onResolveRevision: () => void;
  onNext: () => void;
  onPublicProof: () => void;
}) {
  const mission = activeMission === "checkout" ? demoConvertedMission : demoMission;
  const packet = activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const payoutAmount = mission.reward;
  const packetState = rejected ? "Rejected" : released ? "Released" : accepted ? "Earned" : revisionRequested ? "Revision requested" : "Pending review";
  const packetStateTone = rejected || revisionRequested ? "bad" as const : accepted || released ? "good" as const : "good" as const;
  const ledgerSteps = [
    { label: "Packet submitted", value: rejected ? "Closed without acceptance" : submittedLabel(accepted, released), tone: rejected ? "bad" as const : "good" as const },
    { label: "Maintainer decision", value: rejected ? "Rejected" : accepted ? "Accepted" : revisionRequested ? "Revision requested" : "Waiting", tone: rejected || revisionRequested ? "bad" as const : accepted ? "good" as const : "good" as const },
    { label: "Earned payout", value: accepted ? `${payoutAmount} earned` : rejected ? "Cancelled" : "Not earned yet", tone: accepted ? "good" as const : "bad" as const },
    { label: "Released payout", value: released ? `${payoutAmount} released` : "Manual release pending", tone: released ? "good" as const : "bad" as const },
    { label: "Project credit", value: accepted && !rejected ? `+${demoProject.credit.points} points` : "Not issued", tone: accepted && !rejected ? "good" as const : "bad" as const }
  ];
  const proofHistory = [
    { title: packet.id, detail: accepted ? "Accepted proof created an earned payout record." : rejected ? "Closed without payout. Feedback remains useful." : "Submitted packet waiting for decision.", value: packetState },
    { title: "project-credit.json", detail: "Credits the contributor and project only after acceptance.", value: accepted && !rejected ? "Ready" : "Blocked" },
    { title: "public-packet.json", detail: "Public-safe proof appears only after accepted proof.", value: accepted && !rejected ? "Shareable" : "Hidden" }
  ];
  return (
    <section className="page-grid scoreboard-grid">
      <header className="page-header">
        <span>Contribution Ledger</span>
        <button className="primary-action" onClick={onNext}>
          Generate Proof Packet
        </button>
      </header>
      <div className="ledger-hero wide">
        <div>
          <p className="small-label">Proof before payout</p>
          <h2>Accepted proof is what earns value.</h2>
          <p>
            This is the consequence layer: a useful packet becomes accepted proof, accepted proof creates earned payout and reputation,
            and released payout stays a separate manual accounting step.
          </p>
        </div>
        <div className="ledger-current-packet">
          <span className={packetStateTone === "good" ? "status-pill safe" : "status-pill warning"}>{packetState}</span>
          <strong>{mission.title}</strong>
          <small>{packet.summary}</small>
          <StatusRow label="Agent work" value="Credited only if accepted" tone="good" />
          <StatusRow label="Public proof" value={accepted && !rejected ? "Allowed" : "Hidden until accepted"} tone={accepted && !rejected ? "good" : "bad"} />
        </div>
      </div>
      <div className="metric-strip wide">
        <Metric label="Available" value="$63" />
        <Metric label="Pending" value={accepted || rejected ? "$0" : payoutAmount} />
        <Metric label="Earned" value={accepted ? payoutAmount : "$0"} />
        <Metric label="Paid out" value={released ? payoutAmount : "$0"} />
        <Metric label="Reputation" value={accepted ? "176" : "164"} />
      </div>
      <div className="panel scoreboard-action-card">
        <p className="small-label">Next best action</p>
        <h2>
          {revisionRequested && "Resolve the requested revision."}
          {rejected && "Packet rejected. Start again with stronger proof."}
          {!revisionRequested && !rejected && !accepted && "Get the packet accepted."}
          {accepted && !released && "Release the earned payout."}
          {accepted && released && "Start the next proof mission."}
        </h2>
        <p className="quiet-copy">
          {revisionRequested && "Update the Case File with the missing environment notes, then resubmit."}
          {rejected && "No payout is earned for this packet. Use the feedback to run or package better proof."}
          {!revisionRequested && !rejected && !accepted && "Ask the maintainer to accept the submitted packet."}
          {accepted && !released && "Release the earned payout as a separate accounting step."}
          {accepted && released && "Public proof, project credit, and payout records are ready for the demo."}
        </p>
        <button className="primary-action full" onClick={revisionRequested ? onResolveRevision : accepted && !released ? onRelease : onNext}>
          {revisionRequested && "Open Case File"}
          {rejected && "Start new mission"}
          {!revisionRequested && accepted && !released && "Release payout"}
          {!revisionRequested && !rejected && (!accepted || released) && "Generate proof packet"}
        </button>
        {(accepted || released) && <button className="secondary-action full" onClick={onPublicProof}>View public proof</button>}
      </div>
      <div className="panel ledger-value-card">
        <p className="small-label">Payout state</p>
        <h2>Earned is not released.</h2>
        <StatusRow label="Earned payout" value={accepted ? `${payoutAmount} earned` : rejected ? "Cancelled" : "Waiting"} tone={accepted ? "good" : "bad"} />
        <StatusRow label="Released payout" value={released ? `${payoutAmount} released` : "Not released"} tone={released ? "good" : "bad"} />
        <StatusRow label="Method" value="Manual accounting" tone="good" />
        <p className="quiet-copy">Release is manual in the MVP. No money moves automatically.</p>
        <button className="primary-action full" disabled={!accepted || released} onClick={onRelease}>
          {rejected && "No payout to release"}
          {!rejected && released && "Payout released"}
          {!rejected && !released && "Release payout"}
        </button>
      </div>
      <div className="panel ledger-timeline-card">
        <p className="small-label">Ledger path</p>
        <h2>Work becomes credit in stages.</h2>
        <div className="ledger-step-list">
          {ledgerSteps.map((item, index) => (
            <div className="ledger-step" key={item.label}>
              <span>{index + 1}</span>
              <div>
                <strong>{item.label}</strong>
                <small>{item.value}</small>
              </div>
              <i className={item.tone === "good" ? "status-dot good" : "status-dot bad"} />
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <p className="small-label">Reputation</p>
        <h2>Proof history unlocks better missions.</h2>
        <StatusRow label="Current tier" value={demoUnlockProgress.currentTier} tone="good" />
        <StatusRow label="Next unlock" value={demoUnlockProgress.nextTier} tone="good" />
        <div className="unlock-progress" aria-label="Accepted packet progress">
          <span style={{ width: `${demoUnlockProgress.percent}%` }} />
        </div>
        <p className="quiet-copy">
          {demoUnlockProgress.acceptedPackets} / {demoUnlockProgress.neededPackets} accepted packets. {demoUnlockProgress.nextReward}
        </p>
      </div>
      <div className="panel ledger-proof-history">
        <p className="small-label">Proof history</p>
        <h2>What changed because of this packet.</h2>
        {proofHistory.map((item) => (
          <div className="ledger-proof-row" key={item.title}>
            <span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </span>
            <b>{item.value}</b>
          </div>
        ))}
      </div>
      <div className="panel">
        <p className="small-label">Recent activity</p>
        <h2>Human-readable audit trail.</h2>
        {[...demoActivity, accepted ? "Earned payout created" : "", released ? "Released payout marked paid" : ""]
          .concat(rejected ? ["Packet rejected without payout"] : [])
          .filter(Boolean)
          .map((item) => (
            <div className="activity-row" key={item}>
              {item}
            </div>
          ))}
      </div>
      <div className="panel">
        <p className="small-label">Shared project credit</p>
        <h2>The project grows when proof holds up.</h2>
        <StatusRow label="Project" value={demoProject.name} tone="good" />
        <StatusRow label="Contributor" value={demoProject.credit.contributor} tone="good" />
        <StatusRow label="Packet" value={demoProject.credit.packet} tone="good" />
        <StatusRow label="Credit points" value={rejected ? "0 - not accepted" : demoProject.credit.points} tone={rejected ? "bad" : "good"} />
      </div>
    </section>
  );
}

function submittedLabel(accepted: boolean, released: boolean) {
  if (released) return "Released record exists";
  if (accepted) return "Accepted packet";
  return "In maintainer review";
}

function PublicProofScreen({ activeMission, onBack }: { activeMission: ActiveMission; onBack: () => void }) {
  const [copied, setCopied] = React.useState(false);
  const packet = activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const mission = activeMission === "checkout" ? demoConvertedMission : demoMission;
  const proofFacts = [
    { label: "Status", value: "Accepted", tone: "good" as const },
    { label: "Project", value: demoProject.name, tone: "good" as const },
    { label: "Accepted by", value: activeMission === "checkout" ? "External buyer" : "Commons reviewer", tone: "good" as const },
    { label: "Reward outcome", value: `${mission.reward} earned`, tone: "good" as const }
  ];
  const publicBoundary = [
    { label: "Shared", value: "Summary, public packet, safe artifact refs", tone: "good" as const },
    { label: "Hidden", value: "Raw logs, local paths, payout internals", tone: "bad" as const },
    { label: "Agent notes", value: "Not public", tone: "bad" as const },
    { label: "Private data", value: "Not exposed", tone: "good" as const }
  ];
  return (
    <section className="page-grid public-proof-grid">
      <header className="page-header">
        <span>Public Proof / {packet.id}</span>
        <button className="secondary-action" onClick={onBack}>
          Back to Earnings
        </button>
      </header>
      <div className="public-share-hero wide">
        <div>
          <p className="small-label">Accepted Proof Packet</p>
          <h1>{mission.title}</h1>
          <p>
            {packet.summary} This public page shows the proof someone can inspect without exposing raw logs,
            local paths, private payout records, or internal agent notes.
          </p>
          <div className="public-badge-row">
            <span className="status-pill safe">Accepted</span>
            <span className="status-pill safe">Public-safe</span>
            <span className="status-pill safe">Maintainer reviewed</span>
          </div>
        </div>
        <aside className="public-proof-id-card" aria-label="Public proof reference">
          <span className="status-pill safe">Shareable proof</span>
          <strong>{packet.id}</strong>
          <small>proof://proofforge/{packet.id}</small>
          <button className="primary-action full" onClick={() => setCopied(true)}>{copied ? "Public link copied" : "Copy public link"}</button>
          <button className="secondary-action full" onClick={onBack}>View ledger</button>
        </aside>
      </div>
      <div className="public-proof-dossier">
        <div className="public-proof-summary">
          <p className="small-label">What was proven</p>
          <h2>{packet.result}</h2>
          <p>{packet.recommendedAction}</p>
          <div className="public-fact-grid">
            {proofFacts.map((fact) => (
              <StatusBlock key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </div>
        </div>
      </div>
      <div className="panel public-safe-panel">
        <p className="small-label">Public-safe evidence</p>
        <h2>Only the shareable subset leaves the workspace.</h2>
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
      <div className="panel public-boundary-panel">
        <p className="small-label">Privacy boundary</p>
        <h2>Public proof is not raw agent output.</h2>
        {publicBoundary.map((item) => (
          <StatusRow key={item.label} label={item.label} value={item.value} tone={item.tone} />
        ))}
      </div>
      <div className="decision-panel public-credit-panel">
        <p className="small-label">Credit and payout</p>
        <h2>Credit is portable because the packet was accepted.</h2>
        <StatusRow label="Project" value={demoProject.name} tone="good" />
        <StatusRow label="Contributor" value="alex" tone="good" />
        <StatusRow label="Earned payout" value={mission.reward} tone="good" />
        <StatusRow label="Reputation" value="+12" tone="good" />
        <p className="quiet-copy">This is the public proof someone can show. Released payout remains a separate accounting record.</p>
      </div>
    </section>
  );
}

function RunnerTimeline({
  steps
}: {
  steps: Array<{ label: string; detail: string; status: string; artifact: string }>;
}) {
  return (
    <ol className="runner-timeline">
      {steps.map((step, index) => (
        <li className={step.status === "approval" ? "approval" : "complete"} key={step.label}>
          <span>{index + 1}</span>
          <div>
            <strong>{step.label}</strong>
            <small>{step.detail}</small>
            <code>{step.artifact}</code>
          </div>
        </li>
      ))}
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
