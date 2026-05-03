import { describe, expect, it } from "vitest";
import {
  primaryNavScreens,
  routeLabels,
  screens,
  secondaryNavScreens
} from "../src/routes";

describe("web routes", () => {
  it("keeps the judge demo routes registered in product order", () => {
    expect(screens).toEqual([
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
    ]);
  });

  it("has a navigation label for every route", () => {
    expect(Object.keys(routeLabels).sort()).toEqual([...screens].sort());
    expect(routeLabels.opportunity).toBe("Home");
    expect(routeLabels["agent-setup"]).toBe("Agent Setup");
    expect(routeLabels["first-run"]).toBe("First Run");
    expect(routeLabels["work-queue"]).toBe("Opportunities");
    expect(routeLabels["my-work"]).toBe("My Work");
    expect(routeLabels["builder-passport"]).toBe("Passport");
    expect(routeLabels["mission-detail"]).toBe("Mission Detail");
    expect(routeLabels["case-file"]).toBe("Case File");
    expect(routeLabels.scoreboard).toBe("Home");
    expect(routeLabels["public-proof"]).toBe("Public Proof");
    expect(routeLabels.settings).toBe("Settings");
    expect(routeLabels.help).toBe("Help");
  });

  it("keeps the public navigation focused on user intent", () => {
    expect(primaryNavScreens).toEqual([
      "opportunity",
      "projects",
      "work-queue",
      "my-work",
      "builder-passport"
    ]);
    expect(secondaryNavScreens).toEqual(["settings", "help"]);
  });
});
