import { describe, expect, it } from "vitest";
import { parseImportHistoryArgs } from "../src/importGitHubHistory";

describe("parseImportHistoryArgs", () => {
  it("parses a GitHub login and output directory", () => {
    expect(
      parseImportHistoryArgs([
        "--login",
        "alex-dev",
        "--out",
        "demo-output/history",
        "--per-page",
        "5"
      ])
    ).toEqual({
      login: "alex-dev",
      outputDir: "demo-output/history",
      perPage: 5
    });
  });

  it("requires a GitHub login", () => {
    expect(() => parseImportHistoryArgs([])).toThrow("import:github-history");
  });

  it("rejects invalid per-page values", () => {
    expect(() =>
      parseImportHistoryArgs(["--login", "alex-dev", "--per-page", "zero"])
    ).toThrow("--per-page");
  });
});
