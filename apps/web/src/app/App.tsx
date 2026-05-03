import React from "react";
import type { Screen } from "../routes";
import { AppShell } from "./AppShell";
import { useProofForgeApp } from "./useProofForgeApp";
import { OpportunityScreen } from "../screens/OpportunityScreen";
import { FirstRunScreen } from "../screens/FirstRunScreen";
import { ProjectsScreen } from "../screens/ProjectsScreen";
import { WorkQueueScreen } from "../screens/WorkQueueScreen";
import { MyWorkScreen } from "../screens/MyWorkScreen";
import { MissionDetailScreen } from "../screens/MissionDetailScreen";
import { RunnerScreen } from "../screens/RunnerScreen";
import { CaseFileScreen } from "../screens/CaseFileScreen";
import { MaintainerScreen } from "../screens/MaintainerScreen";
import { PublicProofScreen } from "../screens/PublicProofScreen";
import { AgentSetupScreen } from "../screens/AgentSetupScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { HelpScreen } from "../screens/HelpScreen";
import { BuilderPassportScreen } from "../screens/BuilderPassportScreen";
import { extractShareState } from "./shareRecords";

function renderScreen(
  screen: Screen,
  state: ReturnType<typeof useProofForgeApp>["state"],
  actions: ReturnType<typeof useProofForgeApp>["actions"]
) {
  switch (screen) {
    case "agent-setup":
      return (
        <AgentSetupScreen
          registered={state.agentRegistered}
          onRegister={actions.registerAgent}
          onStart={actions.openOpportunities}
        />
      );
    case "opportunity":
    case "scoreboard":
      return (
        <OpportunityScreen
          agentRegistered={state.agentRegistered}
          accepted={state.accepted}
          released={state.released}
          revisionRequested={state.revisionRequested}
          rejected={state.rejected}
          activeMission={state.activeMission}
          onRelease={actions.releasePayout}
          onResolveRevision={actions.resolveRevision}
          onStart={actions.startProofJourney}
          onAgentSetup={() => actions.setScreen("agent-setup")}
          onPublicProof={actions.openPublicProof}
          onViewOpportunities={actions.openOpportunities}
        />
      );
    case "first-run":
      return (
        <FirstRunScreen
          onRun={actions.runStarterMission}
          onQueue={actions.openOpportunities}
        />
      );
    case "projects":
      return (
        <ProjectsScreen
          projectStarted={state.projectStarted}
          inviteSent={state.projectInviteSent}
          agentAttached={state.projectAgentAttached}
          workSuggested={state.projectWorkSuggested}
          onStartProject={actions.startProject}
          onInvite={actions.inviteContributor}
          onAttachAgent={actions.attachAgent}
          onSuggestWork={actions.suggestWork}
          onQueue={actions.openOpportunities}
        />
      );
    case "work-queue":
      return (
        <WorkQueueScreen
          importedLead={state.importedLead}
          projectWorkSuggested={state.projectWorkSuggested}
          workLeadClarified={state.workLeadClarified}
          workLeadConverted={state.workLeadConverted}
          onImport={actions.importExternalTask}
          onViewInventory={actions.viewOpportunityInventory}
          onClarifyLead={actions.clarifyLead}
          onConvertLead={actions.convertLead}
          onRejectLead={actions.rejectLead}
          onRun={actions.runMission}
        />
      );
    case "my-work":
      return (
        <MyWorkScreen
          agentRegistered={state.agentRegistered}
          submitted={state.submitted}
          accepted={state.accepted}
          released={state.released}
          revisionRequested={state.revisionRequested}
          rejected={state.rejected}
          onMission={actions.runStarterMission}
          onClarify={actions.openOpportunities}
          onCaseFile={actions.openCaseFile}
          onAgentSetup={() => actions.setScreen("agent-setup")}
          onRelease={actions.releasePayout}
          onPublicProof={actions.openPublicProof}
        />
      );
    case "builder-passport":
      return (
        <BuilderPassportScreen
          onWork={() => actions.setScreen("my-work")}
          onProjects={() => actions.setScreen("projects")}
        />
      );
    case "mission-detail":
      return (
        <MissionDetailScreen
          activeMission={state.activeMission}
          onBack={actions.openOpportunities}
          onAccept={() => actions.setScreen("run")}
        />
      );
    case "run":
      return (
        <RunnerScreen
          activeMission={state.activeMission}
          onCancel={actions.cancelRun}
          onPacket={actions.approvePacket}
        />
      );
    case "case-file":
      return (
        <CaseFileScreen
          submitted={state.submitted}
          revisionRequested={state.revisionRequested}
          rejected={state.rejected}
          activeMission={state.activeMission}
          shareState={extractShareState(state)}
          onSubmit={actions.submitPacket}
        />
      );
    case "maintainer":
      return (
        <MaintainerScreen
          submitted={state.submitted}
          accepted={state.accepted}
          activeMission={state.activeMission}
          onAccept={actions.acceptPacket}
          onReview={actions.openCaseFile}
          onRevision={actions.requestRevision}
          onReject={actions.rejectPacket}
        />
      );
    case "public-proof":
      return (
        <PublicProofScreen
          activeMission={state.activeMission}
          shareState={extractShareState(state)}
          onBack={() => actions.setScreen("opportunity")}
        />
      );
    case "settings":
      return (
        <SettingsScreen
          agentRegistered={state.agentRegistered}
          onExportWorkspace={actions.exportWorkspace}
          onExportNetworkRecord={actions.exportNetworkRecord}
          onAgentSetup={() => actions.setScreen("agent-setup")}
          onHelp={() => actions.setScreen("help")}
        />
      );
    case "help":
      return (
        <HelpScreen
          onStart={actions.startProofJourney}
          onSettings={() => actions.setScreen("settings")}
        />
      );
    default:
      return null;
  }
}

export function App() {
  const { state, actions } = useProofForgeApp();

  return (
    <AppShell state={state} onNavigate={actions.setScreen}>
      {renderScreen(state.screen, state, actions)}
    </AppShell>
  );
}
