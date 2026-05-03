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
          onSaveProject={actions.saveProjectProfile}
          onInvite={actions.inviteContributor}
          onAttachAgent={actions.attachAgent}
          onSuggestWork={actions.suggestWork}
          onQueue={actions.openOpportunities}
          projectRequest={state.projectRequest}
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
          onImportGitHubMission={actions.importGitHubMission}
          projectRequest={state.projectRequest}
          importedMission={state.importedMission}
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
          activeMission={state.activeMission}
          projectRequest={state.projectRequest}
          importedMission={state.importedMission}
          payoutReceipt={state.payoutReceipt}
          onMission={actions.runStarterMission}
          onClarify={actions.openOpportunities}
          onCaseFile={actions.openCaseFile}
          onAgentSetup={() => actions.setScreen("agent-setup")}
          onRelease={actions.releasePayout}
          onRecordPayout={actions.recordPayoutReceipt}
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
          projectRequest={state.projectRequest}
          importedMission={state.importedMission}
          onBack={actions.openOpportunities}
          onAccept={() =>
            state.agentRegistered
              ? actions.setScreen("run")
              : actions.setScreen("agent-setup")
          }
        />
      );
    case "run":
      return (
        <RunnerScreen
          activeMission={state.activeMission}
          projectRequest={state.projectRequest}
          importedMission={state.importedMission}
          agentRegistered={state.agentRegistered}
          onCancel={actions.cancelRun}
          onPacket={actions.approvePacket}
          onAgentSetup={() => actions.setScreen("agent-setup")}
        />
      );
    case "case-file":
      return (
        <CaseFileScreen
          submitted={state.submitted}
          revisionRequested={state.revisionRequested}
          rejected={state.rejected}
          activeMission={state.activeMission}
          projectRequest={state.projectRequest}
          importedMission={state.importedMission}
          payoutReceipt={state.payoutReceipt}
          onSubmit={actions.submitPacket}
          onExportPacket={actions.exportPacket}
        />
      );
    case "maintainer":
      return (
        <MaintainerScreen
          submitted={state.submitted}
          accepted={state.accepted}
          activeMission={state.activeMission}
          projectRequest={state.projectRequest}
          importedMission={state.importedMission}
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
          projectRequest={state.projectRequest}
          importedMission={state.importedMission}
          payoutReceipt={state.payoutReceipt}
          onBack={() => actions.setScreen("projects")}
        />
      );
    case "settings":
      return (
        <SettingsScreen
          agentRegistered={state.agentRegistered}
          onAgentSetup={() => actions.setScreen("agent-setup")}
          onHelp={() => actions.setScreen("help")}
          onExport={actions.exportWorkspace}
          onImport={actions.importWorkspace}
          onReset={actions.resetWorkspace}
          onConnectWallet={actions.connectWallet}
          onSaveEnsName={actions.saveEnsName}
          onSignLatestProofEvent={actions.signLatestProofEvent}
          onExportProofRecord={actions.exportProofRecord}
          proofEvents={state.proofEvents}
          walletIdentity={state.walletIdentity}
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
