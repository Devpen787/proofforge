export const screens = [
  "opportunity",
  "agent-setup",
  "first-run",
  "projects",
  "work-queue",
  "my-work",
  "builder-passport",
  "mission-detail",
  "run",
  "case-file",
  "maintainer",
  "scoreboard",
  "public-proof",
  "settings",
  "help"
] as const;

export type Screen = (typeof screens)[number];

export const primaryNavScreens = [
  "opportunity",
  "projects",
  "work-queue",
  "my-work",
  "builder-passport"
] as const satisfies readonly Screen[];

export const secondaryNavScreens = [
  "settings",
  "help"
] as const satisfies readonly Screen[];

export const routeLabels: Record<Screen, string> = {
  opportunity: "Home",
  "agent-setup": "Agent Setup",
  "first-run": "First Run",
  projects: "Projects",
  "work-queue": "Opportunities",
  "my-work": "My Work",
  "builder-passport": "Passport",
  "mission-detail": "Mission Detail",
  run: "Runner",
  "case-file": "Case File",
  maintainer: "Maintainer Review",
  scoreboard: "Home",
  "public-proof": "Public Proof",
  settings: "Settings",
  help: "Help"
};
