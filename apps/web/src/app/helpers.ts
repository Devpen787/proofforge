import {
  primaryNavScreens,
  screens,
  secondaryNavScreens,
  type Screen
} from "../routes";

export function activeNavScreen(
  screen: Screen
): (typeof primaryNavScreens)[number] | (typeof secondaryNavScreens)[number] {
  if (screen === "first-run" || screen === "mission-detail" || screen === "run")
    return "work-queue";
  if (
    screen === "case-file" ||
    screen === "maintainer" ||
    screen === "public-proof"
  )
    return "my-work";
  if (screen === "builder-passport") return "builder-passport";
  if (screen === "agent-setup") return "opportunity";
  if (
    secondaryNavScreens.includes(screen as (typeof secondaryNavScreens)[number])
  )
    return screen as (typeof secondaryNavScreens)[number];
  return primaryNavScreens.includes(
    screen as (typeof primaryNavScreens)[number]
  )
    ? (screen as (typeof primaryNavScreens)[number])
    : "opportunity";
}

export function screenFromHash(): Screen {
  const candidate = window.location.hash.replace("#", "");
  return screens.includes(candidate as Screen)
    ? (candidate as Screen)
    : "opportunity";
}

export function submittedLabel(accepted: boolean, released: boolean) {
  if (released) return "Released record exists";
  if (accepted) return "Accepted packet";
  return "In maintainer review";
}

export function humanizePrivateBoundary(item: string): string {
  const labels: Record<string, string> = {
    "raw logs": "Detailed logs",
    "raw browser traces": "Browser traces",
    "local paths": "Local machine paths",
    "payout record": "Payout accounting",
    "internal runner notes": "Runner notes"
  };
  return labels[item] || item;
}

export function projectAgentCount(baseCount: string, attached: boolean) {
  return String(Number(baseCount) + (attached ? 1 : 0));
}
