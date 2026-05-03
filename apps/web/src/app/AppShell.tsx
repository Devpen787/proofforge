import React from "react";
import { primaryNavScreens, routeLabels, secondaryNavScreens } from "../routes";
import { activeNavScreen } from "./helpers";
import type { AppState } from "./types";
import { NavButton } from "../components/ui";

export function AppShell({
  state,
  onNavigate,
  children
}: {
  state: AppState;
  onNavigate: (screen: AppState["screen"]) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img
            className="brand-logo"
            src="/brand/proofforge-logo.png"
            alt=""
            aria-hidden="true"
          />
          <strong>ProofForge</strong>
        </div>
        <nav className="nav-list" aria-label="Primary">
          {primaryNavScreens.map((route) => (
            <NavButton
              key={route}
              label={routeLabels[route]}
              active={activeNavScreen(state.screen) === route}
              onClick={() => onNavigate(route)}
            />
          ))}
        </nav>
        <div className="sidebar-lower">
          <nav className="nav-list secondary-nav-list" aria-label="Secondary">
            {secondaryNavScreens.map((route) => (
              <NavButton
                key={route}
                label={routeLabels[route]}
                active={activeNavScreen(state.screen) === route}
                onClick={() => onNavigate(route)}
              />
            ))}
          </nav>
          <button
            className="node-status node-status-button"
            onClick={() => onNavigate("agent-setup")}
          >
            <span className="avatar">A</span>
            <div>
              <strong>Alex</strong>
              <span>
                {state.agentRegistered ? "docs-runner-01 ready" : "Set up node"}
              </span>
            </div>
          </button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
