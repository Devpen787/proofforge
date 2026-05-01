import { describe, expect, it } from "vitest";
import { routeLabels, screens } from "../src/routes";

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
      "public-proof"
    ]);
  });

  it("has a navigation label for every route", () => {
    expect(Object.keys(routeLabels).sort()).toEqual([...screens].sort());
    expect(routeLabels["first-run"]).toBe("First Run");
    expect(routeLabels["work-queue"]).toBe("Work Queue");
    expect(routeLabels["mission-detail"]).toBe("Mission Detail");
    expect(routeLabels["public-proof"]).toBe("Public Proof");
  });
});
