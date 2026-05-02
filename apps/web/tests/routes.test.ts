import { describe, expect, it } from "vitest";
import { primaryNavScreens, routeLabels, screens } from "../src/routes";

describe("web routes", () => {
  it("keeps the judge demo routes registered in product order", () => {
    expect(screens).toEqual([
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
    ]);
  });

  it("has a navigation label for every route", () => {
    expect(Object.keys(routeLabels).sort()).toEqual([...screens].sort());
    expect(routeLabels.opportunity).toBe("Home");
    expect(routeLabels["first-run"]).toBe("First Run");
    expect(routeLabels["work-queue"]).toBe("Opportunities");
    expect(routeLabels["mission-detail"]).toBe("Mission Detail");
    expect(routeLabels["case-file"]).toBe("Packets");
    expect(routeLabels.scoreboard).toBe("Home");
    expect(routeLabels["public-proof"]).toBe("Public Proof");
    expect(routeLabels["proof-demo"]).toBe("Proof Demo");
  });

  it("keeps the public navigation focused on user intent", () => {
    expect(primaryNavScreens).toEqual(["opportunity", "projects", "work-queue", "case-file"]);
  });
});
