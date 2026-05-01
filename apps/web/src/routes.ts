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
  "public-proof"
] as const;

export type Screen = (typeof screens)[number];

export const routeLabels: Record<Screen, string> = {
  opportunity: "Opportunity",
  "first-run": "First Run",
  projects: "Projects",
  "work-queue": "Work Queue",
  "mission-detail": "Mission Detail",
  run: "Runner",
  "case-file": "Case Files",
  maintainer: "Maintainer",
  scoreboard: "Earnings",
  "public-proof": "Public Proof"
};
