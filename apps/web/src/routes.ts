export const screens = [
  "opportunity",
  "first-run",
  "projects",
  "work-queue",
  "mission-detail",
  "run",
  "case-file",
  "maintainer",
  "scoreboard",
  "public-proof",
  "proof-demo"
] as const;

export type Screen = (typeof screens)[number];

export const primaryNavScreens = [
  "opportunity",
  "projects",
  "work-queue",
  "case-file",
  "scoreboard"
] as const satisfies readonly Screen[];

export const routeLabels: Record<Screen, string> = {
  opportunity: "Home",
  "first-run": "First Run",
  projects: "Projects",
  "work-queue": "Opportunities",
  "mission-detail": "Mission Detail",
  run: "Runner",
  "case-file": "Packets",
  maintainer: "Maintainer",
  scoreboard: "Scoreboard",
  "public-proof": "Public Proof",
  "proof-demo": "Proof Demo"
};
