import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  demoArtifacts,
  demoConvertedMission,
  demoConvertedPacket,
  demoFirstRunSteps,
  demoMission,
  demoPacket,
  demoProject,
  demoMaintainerPackets,
  demoProjectWorkLead,
  demoSafetyDefaults,
  demoWork,
  demoWorkLead
} from "./demoData";
import { generatedProofSummary } from "./generatedProof";
import { primaryNavScreens, routeLabels, screens, type Screen } from "./routes";

type ActiveMission = "docs" | "checkout";

function activeNavScreen(screen: Screen): (typeof primaryNavScreens)[number] {
  if (screen === "first-run" || screen === "mission-detail" || screen === "run") return "work-queue";
  if (screen === "maintainer" || screen === "public-proof" || screen === "proof-demo") return "case-file";
  return primaryNavScreens.includes(screen as (typeof primaryNavScreens)[number])
    ? (screen as (typeof primaryNavScreens)[number])
    : "opportunity";
}

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
          {primaryNavScreens.map((route) => (
            <NavButton key={route} label={routeLabels[route]} active={activeNavScreen(screen) === route} onClick={() => setScreen(route)} />
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
        {screen === "opportunity" && (
          <OpportunityScreen
            accepted={accepted}
            released={released}
            revisionRequested={revisionRequested}
            rejected={rejected}
            activeMission={activeMission}
            onRelease={() => setReleased(true)}
            onResolveRevision={() => setScreen("case-file")}
            onStart={() => {
              resetProof();
              setScreen("first-run");
            }}
            onPublicProof={() => setScreen("public-proof")}
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
              setScreen("opportunity");
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
              setScreen("opportunity");
            }}
          />
        )}
        {screen === "scoreboard" && (
          <OpportunityScreen
            accepted={accepted}
            released={released}
            revisionRequested={revisionRequested}
            rejected={rejected}
            activeMission={activeMission}
            onRelease={() => setReleased(true)}
            onResolveRevision={() => setScreen("case-file")}
            onStart={() => {
              resetProof();
              setScreen("first-run");
            }}
            onPublicProof={() => setScreen("public-proof")}
          />
        )}
        {screen === "public-proof" && <PublicProofScreen activeMission={activeMission} onBack={() => setScreen("opportunity")} />}
        {screen === "proof-demo" && <ProofDemoScreen onStart={() => setScreen("first-run")} onEvidence={() => setScreen("case-file")} />}
      </main>
    </div>
  );
}

function OpportunityScreen({
  accepted,
  released,
  revisionRequested,
  rejected,
  activeMission,
  onRelease,
  onResolveRevision,
  onStart,
  onPublicProof
}: {
  accepted: boolean;
  released: boolean;
  revisionRequested: boolean;
  rejected: boolean;
  activeMission: ActiveMission;
  onRelease: () => void;
  onResolveRevision: () => void;
  onStart: () => void;
  onPublicProof: () => void;
}) {
  const mission = activeMission === "checkout" ? demoConvertedMission : demoMission;
  const packet = activeMission === "checkout" ? demoConvertedPacket : demoPacket;
  const payoutAmount = mission.reward;
  const packetState = rejected ? "Rejected" : released ? "Released" : accepted ? "Earned" : revisionRequested ? "Revision requested" : "Ready to start";
  const heroTitle =
    revisionRequested ? "Fix the packet. Keep the credit path clear." :
    rejected ? "Packet rejected. Start again with stronger proof." :
    accepted || released ? "Accepted proof is what earns value." :
    "Find useful work. Prove it. Earn accepted credit.";
  const heroBody =
    revisionRequested ? "A maintainer asked for a cleaner packet. Update the case file, then resubmit." :
    rejected ? "No payout was earned. The feedback still helps you generate a stronger packet." :
    accepted && !released ? "Release the earned payout. Earned payout exists, release stays a separate manual accounting step." :
    released ? "Proof, public credit, and payout records are ready. Start the next useful mission." :
    "Start with safe work your agent can run locally. Proof creates credit only after human acceptance.";
  const primaryAction = revisionRequested ? "Open Case File" : accepted && !released ? "Release payout" : "Start safest proof";
  const handlePrimary = revisionRequested ? onResolveRevision : accepted && !released ? onRelease : onStart;
  const ledgerSteps = [
    { label: "Packet submitted", value: rejected ? "Closed without acceptance" : submittedLabel(accepted, released), tone: rejected ? "bad" as const : "good" as const },
    { label: "Maintainer decision", value: rejected ? "Rejected" : accepted ? "Accepted" : revisionRequested ? "Revision requested" : "Waiting", tone: rejected || revisionRequested ? "bad" as const : "good" as const },
    { label: "Earned payout", value: accepted ? `${payoutAmount} earned` : rejected ? "Cancelled" : "Not earned yet", tone: accepted ? "good" as const : "bad" as const },
    { label: "Released payout", value: released ? `${payoutAmount} released` : "Manual release pending", tone: released ? "good" as const : "bad" as const },
    { label: "Project credit", value: accepted && !rejected ? `+${demoProject.credit.points} points` : "Not issued", tone: accepted && !rejected ? "good" as const : "bad" as const }
  ];
  return (
    <section className="page-grid home-grid">
      <div className="home-hero wide">
        <div>
          <span className="status-pill safe">{packetState}</span>
          <h1>{heroTitle}</h1>
          <p>{heroBody}</p>
          <div className="home-actions">
            <button className="primary-action" onClick={handlePrimary}>{primaryAction}</button>
            {revisionRequested && <button className="secondary-action" onClick={onStart}>Start safest proof</button>}
            {(accepted || released) && <button className="secondary-action" onClick={onPublicProof}>View public proof</button>}
          </div>
        </div>
        <aside className="home-earning-card">
          <p className="small-label">Earning state</p>
          <StatusRow label="Available" value="$63" tone="good" />
          <StatusRow label="Earned payout" value={accepted ? `${payoutAmount} earned` : rejected ? "Cancelled" : "Waiting"} tone={accepted ? "good" : "bad"} />
          <StatusRow label="Released payout" value={released ? `${payoutAmount} released` : "Not released"} tone={released ? "good" : "bad"} />
          <StatusRow label="Public proof" value={accepted && !rejected ? "Allowed" : "Hidden until accepted"} tone={accepted && !rejected ? "good" : "bad"} />
          <p className="quiet-copy">Accepted proof creates the earned record. Release is a separate step.</p>
        </aside>
      </div>

      <div className="home-focus-panel wide">
        <OpportunityFitCard onStart={onStart} />

        <section className="home-ledger-panel">
          <p className="small-label">Ledger path</p>
          <h2>Work becomes credit in stages.</h2>
          <div className="ledger-step-list compact-ledger-list">
            {ledgerSteps.slice(0, 4).map((item, index) => (
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
          <div className="ledger-proof-row">
            <span>
              <strong>Public proof</strong>
              <small>Public-safe proof appears only after accepted proof.</small>
            </span>
            <b>{accepted && !rejected ? "Shareable" : "Hidden"}</b>
          </div>
        </section>
      </div>

      <WorkList onStart={onStart} />
    </section>
  );
}

function OpportunityFitCard({ onStart }: { onStart: () => void }) {
  return (
    <section className="opportunity-fit-card" aria-label="Best starting opportunity">
      <p className="small-label">Your fit today</p>
      <h2>$63 in proofable work</h2>
      <p className="quiet-copy">Start with one safe mission. Your agent prepares the evidence; a human accepts the packet.</p>
      <div className="fit-mission">
        <span className="opportunity-icon">▶</span>
        <div>
          <strong>Validate installation docs</strong>
          <small>Safe · 30 min · Commons reviewer</small>
        </div>
      </div>
      <div className="fit-facts">
        <StatusRow label="Reward" value="$8 + rep + credits" tone="good" />
        <StatusRow label="Safety" value="Evidence-only" tone="good" />
        <StatusRow label="Approval" value="Before submit" tone="good" />
      </div>
      <button className="primary-action full" onClick={onStart}>Start this mission</button>
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
  const allowedActions = ["Clone/load repo", "Run commands", "Capture logs"];
  const blockedActions = ["Open PRs", "Post public comments", "Spend funds", "Access private repos"];

  return (
    <section className="page-grid mission-detail-grid">
      <header className="page-header">
        <span>Mission Detail / {mission.title}</span>
        <button className="secondary-action" onClick={onBack}>Back to Opportunities</button>
      </header>

      <div className="mission-decision-hero wide">
        <div>
          <p className="small-label">Ready to run</p>
          <h2>{mission.title}</h2>
          <p>{packet.objective}</p>
          <div className="mission-detail-facts">
            <StatusBlock label="Accepts proof" value={owner} />
            <StatusBlock label="Risk" value={mission.risk} />
            <StatusBlock label="Runtime" value={mission.runtime} />
            <StatusBlock label="Source" value={mission.repo} />
          </div>
        </div>
        <aside className="mission-run-card">
          <span>Earn if accepted</span>
          <strong>{mission.reward}</strong>
          <small>+12 reputation, +2 credits</small>
          <button className="primary-action full" onClick={onAccept}>Accept and run</button>
        </aside>
      </div>

      <div className="panel mission-proof-panel">
        <p className="small-label">Proof package</p>
        <h2>What the maintainer gets.</h2>
        <div className="mission-proof-grid">
          <div>
            <h3>Success criteria</h3>
            <div className="mission-criteria-list">
              {successCriteria.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="mission-artifact-box">
            <h3>Artifacts</h3>
            <p>{proofShape}</p>
            <div className="tag-row">
              {packet.artifacts.slice(0, 4).map((artifact) => (
                <span className="status-pill safe" key={artifact}>{artifact}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel mission-boundary-panel">
        <p className="small-label">Agent boundary</p>
        <h2>Useful, but boxed in.</h2>
        <div className="mission-boundary-grid">
          <div>
            <h3>Allowed</h3>
            {allowedActions.map((action) => (
              <StatusRow key={action} label={action} value="Allowed" tone="good" />
            ))}
          </div>
          <div>
            <h3>Blocked</h3>
            {blockedActions.map((action) => (
              <StatusRow key={action} label={action} value="Blocked" tone="bad" />
            ))}
          </div>
        </div>
        <div className="mission-safety-note">No public action or payout before maintainer acceptance.</div>
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
  const primaryOpportunity = demoProject.opportunities[0];
  const activeRuns = demoProject.activeWork.find((lane) => lane.lane === "Running")?.cards || [];
  const reviewLane = demoProject.activeWork.find((lane) => lane.lane === "Needs review")?.cards || [];
  const acceptedLane = demoProject.activeWork.find((lane) => lane.lane === "Accepted")?.cards || [];
  return (
    <section className="page-grid project-room-grid">
      <header className="project-room-hero wide">
        <div>
          <span className="project-kicker">Projects / {demoProject.name}</span>
          <h1>{demoProject.name}</h1>
          <p>{demoProject.purpose}</p>
          <div className="tag-row">
            <span className="status-pill safe">Active</span>
            {demoProject.lanes.map((lane) => (
              <span className="status-pill" key={lane}>{lane}</span>
            ))}
            <span className="status-pill safe">Built on open rails</span>
          </div>
        </div>
        <aside className="project-next-move">
          <p className="small-label">Next project move</p>
          <h2>Bring in one useful piece of work.</h2>
          <p>Convert it into a proofable mission only after the owner, evidence shape, and reward path are clear.</p>
          <button className="primary-action full" onClick={onSuggestWork}>{workSuggested ? "Work Lead created" : "Suggest Work"}</button>
          <div className="project-secondary-actions">
            <button className="secondary-action" onClick={onInvite}>{inviteSent ? "Invite pending" : "Invite"}</button>
            <button className="secondary-action" onClick={onAttachAgent}>{agentAttached ? "Agent attached" : "Attach Agent"}</button>
            <button className="secondary-action" onClick={onStartProject}>{projectStarted ? "Project started" : "Start project"}</button>
          </div>
        </aside>
        <div className="project-room-stats">
          <ProjectStat label="Pool" value={demoProject.pool} detail={`${demoProject.availablePool} available`} />
          <ProjectStat label="Proofs" value={demoProject.acceptedProof} detail="accepted packets" />
          <ProjectStat label="People" value={demoProject.people} detail="contributors" />
          <ProjectStat label="Agents" value={projectAgentCount(agentAttached)} detail="active helpers" />
        </div>
      </header>

      {projectStarted && (
        <div className="project-action-banner wide" role="status">
          <div>
            <strong>New project shell created</strong>
            <span>Purpose, lanes, first steward, and reward pool are visible. Next: invite one contributor or attach one constrained agent.</span>
          </div>
          <span className="status-pill safe">Launch draft</span>
        </div>
      )}

      <div className="project-room-main wide">
        <section className="project-focus-card">
          <p className="small-label">Best opportunity</p>
          <h2>{primaryOpportunity.title}</h2>
          <p>{primaryOpportunity.detail}</p>
          <div className="project-focus-meta">
            <StatusBlock label="Reward" value={primaryOpportunity.reward} />
            <StatusBlock label="Safety" value={primaryOpportunity.safety} />
            <StatusBlock label="Proofability" value={primaryOpportunity.proofability} />
          </div>
          <button className="primary-action full" onClick={onQueue}>Run this proof</button>
        </section>

        <section className="panel project-opportunities-panel">
          <div className="section-heading">
            <div>
              <p className="small-label">Open opportunities</p>
              <h2>Choose work with a clear proof path.</h2>
            </div>
            <button className="secondary-action" onClick={onQueue}>View all</button>
          </div>
          <div className="project-opportunity-list">
            {workSuggested && (
              <div className="project-opportunity-row project-opportunity-new">
                <span className="opportunity-icon">+</span>
                <div>
                  <strong>Project Work Lead created</strong>
                  <small>Clarify before Mission</small>
                </div>
                <button className="secondary-action" onClick={onQueue}>Triage</button>
              </div>
            )}
            {demoProject.opportunities.map((item) => (
              <div className="project-opportunity-row" key={item.title}>
                <span className="opportunity-icon">{item.action === "Run" ? "▶" : item.action === "Plan" ? "◇" : "✓"}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                  <span className="project-opportunity-meta">{item.reward} · {item.safety} · {item.proofability} proofable</span>
                </div>
                <button className={item.action === "Run" ? "primary-action" : "secondary-action"} onClick={item.action === "Run" ? onQueue : undefined}>{item.action}</button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel project-active-work-panel">
          <p className="small-label">Active work</p>
          <h2>Proof moving through the project.</h2>
          <div className="project-flow-columns">
            <div>
              <h3>Running</h3>
              {activeRuns.map((card) => (
                <div className="project-flow-card" key={card.title}>
                  <strong>{card.title}</strong>
                  <small>{card.meta}</small>
                </div>
              ))}
            </div>
            <div>
              <h3>Needs review</h3>
              {reviewLane.map((card) => (
                <div className="project-flow-card review" key={card.title}>
                  <strong>{card.title}</strong>
                  <small>{card.meta}</small>
                </div>
              ))}
            </div>
            <div>
              <h3>Accepted</h3>
              {acceptedLane.map((card) => (
                <div className="project-flow-card accepted" key={card.title}>
                  <strong>{card.title}</strong>
                  <small>{card.meta}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="project-people-card">
          <p className="small-label">People and agents</p>
          <h2>Capability, not control.</h2>
          <div className="project-people-list">
            {inviteSent && (
              <CompactPerson name="sam@builder.dev" role="Contributor invite" status="Pending" tone="warning" />
            )}
            {demoProject.peopleRoster.slice(0, 2).map((person) => (
              <CompactPerson key={person.name} name={person.name} role={person.role} status={person.status} tone={person.status === "Pending" ? "warning" : "safe"} />
            ))}
          </div>
          <div className="project-agent-list">
            {agentAttached && (
              <CompactAgent name="browser-qa-02" detail="Browser checks" status="Pending review" tone="warning" />
            )}
            {demoProject.agentDelegations.slice(0, 2).map((agent) => (
              <CompactAgent key={agent.name} name={agent.name} detail={agent.allowed} status={agent.status} tone={agent.status === "Review" ? "warning" : "safe"} />
            ))}
          </div>
        </aside>
      </div>

      <section className="project-credit-panel wide">
        <div className="project-ledger-summary">
          <div>
            <p className="small-label">Proof, credit, and benefits</p>
            <h2>Accepted proof becomes project credit.</h2>
            <p>Every accepted packet records who helped, what was proven, what was earned, and which benefit unlocked next.</p>
          </div>
        </div>
        <div className="project-credit-body">
          <div className="project-proof-history">
            {demoProject.proofLedger.history.slice(0, 2).map((item) => (
              <div className="project-proof-row" key={item.label}>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
                <b>{item.value}</b>
              </div>
            ))}
          </div>
          <div className="project-benefit-stack">
            {demoProject.benefits.slice(0, 3).map((benefit) => (
              <div className="benefit-row" key={benefit.label}>
                <div>
                  <strong>{benefit.threshold}</strong>
                  <small>{benefit.label}</small>
                </div>
                <span>{benefit.status}</span>
                <div className="benefit-progress" aria-hidden="true">
                  <i style={{ width: `${benefit.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <footer className="project-ledger-footer">
          <span>Top contributors: {demoProject.proofLedger.topContributors.join(", ")}</span>
          <span>
            <strong>Latest proof</strong>
            <small>{demoProject.proofLedger.latestProof}</small>
          </span>
          <button className="secondary-action" onClick={onQueue}>View opportunities</button>
        </footer>
      </section>
    </section>
  );
}

function ProjectStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="project-stat">
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{detail}</small>
    </div>
  );
}

function CompactPerson({ name, role, status, tone }: { name: string; role: string; status: string; tone: "safe" | "warning" }) {
  return (
    <div className="compact-person-row">
      <span className="mini-avatar">{name.charAt(0).toUpperCase()}</span>
      <div>
        <strong>{name}</strong>
        <small>{role}</small>
      </div>
      <span className={tone === "safe" ? "status-pill safe" : "status-pill warning"}>{status}</span>
    </div>
  );
}

function CompactAgent({ name, detail, status, tone }: { name: string; detail: string; status: string; tone: "safe" | "warning" }) {
  return (
    <div className="compact-agent-row">
      <span className="mini-agent">PF</span>
      <div>
        <strong>{name}</strong>
        <small>{detail}</small>
      </div>
      <span className={tone === "safe" ? "status-pill safe" : "status-pill warning"}>{status}</span>
    </div>
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
  const selectedOpportunity = demoProject.opportunities[0];
  const proofability = workLeadClarified ? "88%" : demoWorkLead.proofability;
  const leadStatus = workLeadConverted ? "Converted to Mission." : workLeadClarified ? "Mission-ready after clarification." : "Needs one answer";
  const triageMode = importedLead || workLeadClarified || workLeadConverted;

  if (triageMode) {
    return (
      <section className="page-grid work-queue-flow">
        <header className="page-header">
          <span>Opportunities / Work Lead Triage</span>
          <button className="secondary-action" onClick={() => onRun("docs")}>Run safest mission</button>
        </header>

        <div className="triage-hero wide">
          <div>
            <p className="small-label">Triage mode</p>
            <h1>Turn raw work into one safe mission.</h1>
            <p>ProofForge imported the request locally. No comments, PRs, payments, or maintainer outreach happened.</p>
          </div>
          <div className="triage-hero-state">
            <StatusRow label="External action" value="None" tone="good" />
            <StatusRow label="Mission status" value={workLeadConverted ? "Converted" : workLeadClarified ? "Ready" : "Needs triage"} tone={workLeadConverted || workLeadClarified ? "good" : "bad"} />
            <StatusRow label="Next gate" value={workLeadConverted ? "Run mission" : workLeadClarified ? "Convert" : "Clarify"} tone={workLeadConverted || workLeadClarified ? "good" : "bad"} />
          </div>
        </div>

        <div className="work-lead-diagnosis-panel wide">
          <div className="work-lead-summary">
            <p className="small-label">{importedLead ? "Imported Work Lead ready for triage" : "Work Lead ready for triage"}</p>
            <h2>{demoWorkLead.title}</h2>
            <p>{demoWorkLead.rawRequest}</p>
            <div className="tag-row">
              {demoWorkLead.categories.map((category) => (
                <span className="status-pill safe" key={category}>{category}</span>
              ))}
            </div>
          </div>
          <div className="proof-score compact-proof-score">
            <span>Proofability</span>
            <strong>{proofability}</strong>
            <small>{leadStatus}</small>
          </div>
          <div className="triage-grid">
            <StatusBlock label="Risk" value={demoWorkLead.risk} />
            <StatusBlock label="Reward" value={demoWorkLead.reward} />
            <StatusBlock label="Accepts proof" value={demoWorkLead.acceptsProof} />
            <StatusBlock label="Missing" value={workLeadClarified ? "None" : demoWorkLead.missing} />
          </div>
          <div className="triage-decision-panel">
            <div>
              <strong>{workLeadConverted ? "Converted to a scoped mission." : workLeadClarified ? "Ready to become a mission." : "One detail blocks conversion."}</strong>
              <p>{workLeadConverted ? "Checkout QA verification is now a scoped Mission with owner, artifacts, risk, and approval rules." : workLeadClarified ? "Browser targets are confirmed. The lead can safely become a Mission." : demoWorkLead.nextQuestion}</p>
            </div>
            <div className="decision-row">
              <button className="primary-action" onClick={onClarifyLead} disabled={workLeadClarified}>{workLeadClarified ? "Clarified" : "Ask clarification"}</button>
              <button className="secondary-action" aria-label="Convert to Mission" disabled={!workLeadClarified || workLeadConverted} onClick={onConvertLead}>
                {workLeadConverted ? "Converted" : "Convert"}
              </button>
              <button className="danger-action">Reject</button>
            </div>
          </div>
        </div>

        {projectWorkSuggested && (
          <div className="project-work-lead-card wide" role="status">
            <div>
              <p className="small-label">Project Work Lead created</p>
              <h2>{demoProjectWorkLead.title}</h2>
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

        {workLeadConverted && (
          <div className="panel mission-created-panel wide">
            <h2>Converted mission</h2>
            <p>Checkout QA verification is now a scoped Mission with owner, artifacts, risk, and approval rules.</p>
            <div className="mission-created-grid">
              <StatusRow label="Owner" value="External buyer" tone="good" />
              <StatusRow label="Risk" value="Medium" tone="bad" />
              <StatusRow label="Approval" value="Evidence-only before submit" tone="good" />
            </div>
            <button className="primary-action full" onClick={() => onRun("checkout")}>Run converted mission</button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="page-grid work-queue-grid">
      <header className="page-header">
        <span>Opportunities</span>
        <button className="secondary-action" aria-label="Import external task" onClick={onImport}>Import external task</button>
      </header>

      <div className="opportunity-command-panel wide">
        <div className="opportunity-list-panel">
          <div className="section-heading">
            <div>
              <p className="small-label">Open opportunities</p>
              <h2>Useful work with proof, owner, and upside.</h2>
            </div>
            <button className="secondary-action" onClick={onImport}>Import work</button>
          </div>
          <div className="opportunity-filter-row" aria-label="Opportunity filters">
            {["Best fit", "Safe", "Docs", "Bounties"].map((filter, index) => (
              <span className={index === 0 ? "active" : ""} key={filter}>{filter}</span>
            ))}
          </div>
          <div className="opportunity-card-list">
            {demoProject.opportunities.map((opportunity, index) => (
              <article className={index === 0 ? "opportunity-card selected" : "opportunity-card"} key={opportunity.title}>
                <div className="opportunity-card-main">
                  <span className="opportunity-icon">{index + 1}</span>
                  <div>
                    <strong>{opportunity.title}</strong>
                    <small>{opportunity.detail}</small>
                    <div className="opportunity-card-meta">
                      <span>{opportunity.reward}</span>
                      <span>{opportunity.safety}</span>
                      <span>{opportunity.proofability} proofable</span>
                    </div>
                  </div>
                </div>
                <button className={opportunity.action === "Run" ? "primary-action" : "secondary-action"} onClick={() => opportunity.action === "Run" && onRun("docs")}>
                  {opportunity.action}
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="opportunity-detail-panel">
          <p className="small-label">Best fit today</p>
          <h2>{selectedOpportunity.title}</h2>
          <p>{selectedOpportunity.detail}</p>
          <div className="opportunity-detail-stats">
            <StatusBlock label="Reward" value={selectedOpportunity.reward} />
            <StatusBlock label="Safety" value={selectedOpportunity.safety} />
            <StatusBlock label="Proofability" value={selectedOpportunity.proofability} />
            <StatusBlock label="Accepted by" value="Commons reviewer" />
          </div>
          <div className="opportunity-proof-box">
            <strong>Proof required</strong>
            <span>Run install docs in a clean fixture, capture logs, package maintainer-ready evidence.</span>
          </div>
          <div className="decision-row">
            <button className="primary-action" onClick={() => onRun("docs")}>Run this mission</button>
            <button className="secondary-action" onClick={onImport}>Import work</button>
          </div>
        </aside>
      </div>
      {projectWorkSuggested && (
        <div className="project-work-lead-card wide" role="status">
          <div>
            <p className="small-label">Project Work Lead created</p>
            <h2>{demoProjectWorkLead.title}</h2>
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
  const packetStatus = rejected ? "Rejected" : revisionRequested ? "Revision requested" : submitted ? "Submitted" : "Maintainer-ready";
  const sharedLabels = ["Reviewer summary", "Evidence packet", "Policy result", "Environment summary"];
  return (
    <section className="page-grid packet-grid">
      <header className="page-header">
        <span>Packets / {packet.id}</span>
      </header>

      {revisionRequested && (
        <div className="revision-banner wide" role="status">
          <strong>Revision requested</strong>
          <span>Maintainer asked for clearer environment notes and the full command transcript before acceptance.</span>
        </div>
      )}
      {rejected && (
        <div className="rejection-banner wide" role="status">
          <strong>Packet rejected</strong>
          <span>The evidence was closed without payout. Start a new mission or rebuild the packet with stronger proof.</span>
        </div>
      )}

      <div className="packet-workspace wide">
        <article className="packet-document">
          <div className="packet-document-hero">
            <div>
              <p className="small-label">Evidence case file</p>
              <h1>{caseTitle}</h1>
              <p>{packet.summary}</p>
            </div>
            <div className="packet-document-status">
              <span className={rejected || revisionRequested ? "status-pill warning" : "status-pill safe"}>{packetStatus}</span>
              <StatusRow label="Confidence" value="86%" tone="good" />
              <StatusRow label="Public action" value="None" tone="good" />
            </div>
          </div>

          <div className="packet-brief-grid">
            <section>
              <span>What was tested</span>
              <strong>{packet.objective}</strong>
            </section>
            <section>
              <span>Observed result</span>
              <strong>{packet.result}</strong>
            </section>
            <section>
              <span>Recommended next action</span>
              <strong>{packet.recommendedAction}</strong>
            </section>
          </div>

          <div className="packet-readiness-strip" aria-label="Packet readiness">
            <div>
              <span>Verifier</span>
              <strong>Passed</strong>
            </div>
            <div>
              <span>Privacy</span>
              <strong>No secrets, paths masked</strong>
            </div>
            <div>
              <span>Security</span>
              <strong>Evidence-only, boxed in</strong>
            </div>
          </div>
        </article>

        <aside className="packet-side-gate">
          <section className="packet-submit-panel">
            <p className="small-label">Submit decision</p>
            <h2>Evidence first. Code later.</h2>
            <p>If accepted: {mission.reward} earned, +12 reputation, +2 credits.</p>
            <button className="primary-action full" onClick={onSubmit} disabled={submitted}>
              {submitted ? "Submitted to Maintainer Inbox" : "Submit Packet"}
            </button>
            <div className="packet-sharing-grid">
              <div>
                <strong>Shared</strong>
                {sharedLabels.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div>
                <strong>Private</strong>
                {packet.keptPrivate.map((item) => (
                  <span key={item}>{humanizePrivateBoundary(item)}</span>
                ))}
              </div>
            </div>
          </section>
        </aside>
      </div>

      <details className="packet-advanced wide">
        <summary>Open packet details and generated files</summary>
        <div className="packet-full-review">
          <div className="packet-artifacts-panel">
            <div className="section-heading">
              <div>
                <p className="small-label">Evidence bundle</p>
                <h2>{packet.artifacts.length} generated files</h2>
              </div>
            </div>
            <div className="artifact-manifest compact-artifact-manifest">
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
          </div>
          <div className="packet-check-card">
            <p className="small-label">Verifier</p>
            <h2>Builder does not grade its own work.</h2>
            <StatusRow label="Packet status" value="Draft, approved locally" tone="good" />
            <StatusRow label="Verifier" value="Passed" tone="good" />
            <StatusRow label="Policy" value="Evidence-only" tone="good" />
          </div>
          <div className="packet-check-card">
            <p className="small-label">Privacy</p>
            <h2>Safe to share.</h2>
            <ul className="check-list">
              {packet.privacyReview.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="packet-check-card">
            <p className="small-label">Security</p>
            <h2>Still boxed in.</h2>
            <ul className="check-list">
              {packet.securityReview.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
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
          </div>
        </div>
      </details>
    </section>
  );
}

function humanizePrivateBoundary(item: string): string {
  const labels: Record<string, string> = {
    "raw logs": "Detailed logs",
    "raw browser traces": "Browser traces",
    "local paths": "Local machine paths",
    "payout record": "Payout accounting",
    "internal runner notes": "Runner notes"
  };
  return labels[item] || item;
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
    <section className="page-grid maintainer-focus-grid">
      <header className="page-header">
        <span>Maintainer Workspace</span>
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
        <div className="decision-row">
          <button className="secondary-action">Review Packet</button>
          <button className="primary-action" onClick={onAccept} disabled={accepted}>
            {accepted ? "Accepted" : "Accept & Mark Earned"}
          </button>
          <button className="warning-action" onClick={onRevision}>Request Revision</button>
          <button className="danger-action" onClick={onReject}>Reject Packet</button>
        </div>
        <details className="maintainer-supporting-details">
          <summary>Open evidence, standards, and revision options</summary>
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
              <h3>Review standard</h3>
              {evidenceChecks.map((check) => (
                <StatusRow key={check.label} label={check.label} value={check.value} tone={check.tone} />
              ))}
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
        </details>
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
    { label: "Shared", value: "Accepted summary and safe proof refs", tone: "good" as const },
    { label: "Hidden", value: "Raw logs, local paths, private payout data", tone: "bad" as const },
    { label: "Agent notes", value: "Kept private", tone: "bad" as const },
    { label: "Private data", value: "Not exposed", tone: "good" as const }
  ];
  const publicEvidence = [
    {
      label: "Accepted proof summary",
      purpose: "What was proven, who accepted it, and why it matters.",
      status: "Public"
    },
    {
      label: "Safe artifact references",
      purpose: "Pointers to shareable evidence without raw local details.",
      status: "Public"
    }
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
            A maintainer accepted this proof. The public page shows what was proven, who accepted it,
            and what credit was earned without exposing raw logs or private workspace data.
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

function ProofDemoScreen({ onStart, onEvidence }: { onStart: () => void; onEvidence: () => void }) {
  const generated = generatedProofSummary;
  const proofCommands = [
    { label: "Run all tests", command: "npm test", result: "Validates schemas, conversion, verifier, payout, project, and route contracts." },
    { label: "Generate packet", command: "npm run demo:packet", result: "Writes evidence-packet.json, case-file.md, policy.json, public-packet.json, payout.json, and project.json." },
    { label: "Sync web proof", command: "npm run sync:web-proof", result: "Copies sanitized generated artifact fields into the browser demo without exposing local paths." },
    { label: "Release payout record", command: "npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json", result: "Marks payout released without pretending money moved automatically." },
    { label: "Import real work", command: "npm run import:github -- --url https://github.com/microsoft/vscode/issues/1", result: "Reads a public GitHub issue into a local Work Lead. No public action is taken." },
    { label: "Smoke the product", command: "npm run smoke:web", result: "Checks desktop and phone routes plus the end-to-end proof journey." }
  ];
  const proofClaims = [
    { label: "Existing work enters", value: "GitHub issue import creates Work Lead", tone: "good" as const },
    { label: "Raw work is gated", value: "Mission conversion blocks vague leads", tone: "good" as const },
    { label: "Runner produces artifacts", value: "Local fixture command writes logs and environment", tone: "good" as const },
    { label: "Builder does not self-grade", value: "Verifier checks runner output independently", tone: "good" as const },
    { label: "Payout is disciplined", value: "Earned after acceptance, released manually", tone: "good" as const },
    { label: "Public proof is safe", value: "Raw logs and private payout internals stay hidden", tone: "good" as const }
  ];
  return (
    <section className="page-grid proof-demo-grid">
      <header className="page-header">
        <span>Working Proof</span>
        <button className="primary-action" onClick={onStart}>Start proof journey</button>
      </header>
      <div className="proof-demo-hero wide">
        <div>
          <p className="small-label">Judge-run proof path</p>
          <h1>Working proof, not just a product sketch.</h1>
          <p>ProofForge has a local, reproducible loop: import work, scope it, run the fixture mission, verify artifacts, package evidence, accept it, create earned value, release the payout record, and expose a public-safe proof.</p>
          <div className="public-badge-row">
            <span className="status-pill safe">Local runner</span>
            <span className="status-pill safe">Independent verifier</span>
            <span className="status-pill safe">Evidence packet</span>
            <span className="status-pill safe">Manual payout release</span>
          </div>
        </div>
        <aside className="proof-demo-result-card">
          <strong>Synced generated output</strong>
          <small>{generated.generatedFrom}</small>
          <StatusRow label="Packet" value={generated.packetId} tone="good" />
          <StatusRow label="Policy" value={generated.policyStatus} tone="good" />
          <StatusRow label="Verifier" value={generated.verifierStatus} tone="good" />
          <StatusRow label="Payout" value={`${generated.payout.amount} ${generated.payout.status}`} tone="good" />
          <button className="secondary-action full" onClick={onEvidence}>Open Case File</button>
        </aside>
      </div>
      <div className="proof-demo-loop wide">
        {["Work Lead", "Mission", "Runner", "Verifier", "Packet", "Review", "Ledger", "Public Proof"].map((step, index) => (
          <div className="proof-demo-loop-step" key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      <div className="panel synced-proof-panel wide">
        <p className="small-label">Synced from generated artifacts</p>
        <h2>The web demo is reading sanitized proof output.</h2>
        <div className="synced-proof-layout">
          <div className="synced-proof-summary">
            <strong>{generated.publicPacketId}</strong>
            <p>{generated.evidenceSummary}</p>
            <StatusRow label="Accepted by" value={generated.acceptedBy} tone="good" />
            <StatusRow label="Human approval" value={generated.humanApprovalStatus} tone="good" />
            <StatusRow label="Project credit" value={`+${generated.projectCredit.points} points for ${generated.projectCredit.contributor}`} tone="good" />
            <StatusRow label="Reward pool" value={generated.projectCredit.rewardPool} tone="good" />
          </div>
          <div className="synced-proof-artifacts">
            {generated.publicArtifacts.map((artifact) => (
              <div className="artifact-row rich-artifact-row" key={artifact.label}>
                <span>
                  <strong>{artifact.label}</strong>
                  <small>{artifact.mediaType}</small>
                </span>
                <code>{artifact.sha256Short}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="panel proof-command-panel">
        <p className="small-label">Commands reviewers can run</p>
        <h2>Reproduce the proof locally.</h2>
        {proofCommands.map((item) => (
          <div className="proof-command-row" key={item.label}>
            <span>
              <strong>{item.label}</strong>
              <code>{item.command}</code>
              <small>{item.result}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="panel proof-claims-panel">
        <p className="small-label">What this proves</p>
        <h2>The MVP proves the narrow loop.</h2>
        {proofClaims.map((claim) => (
          <StatusRow key={claim.label} label={claim.label} value={claim.value} tone={claim.tone} />
        ))}
      </div>
      <div className="panel proof-artifact-panel wide">
        <p className="small-label">Generated proof objects</p>
        <h2>Artifacts judges and maintainers can inspect.</h2>
        <div className="proof-artifact-grid">
          {demoArtifacts.map((artifact) => (
            <div className="proof-artifact-card" key={artifact.name}>
              <strong>{artifact.name}</strong>
              <span>{artifact.visibility}</span>
              <small>{artifact.purpose}</small>
            </div>
          ))}
        </div>
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
