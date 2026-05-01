import { describe, expect, it } from "vitest";
import { parseImportArgs } from "../src/importGitHubIssue";

describe("parseImportArgs", () => {
  it("accepts the explicit --url form", () => {
    expect(parseImportArgs(["--url", "https://github.com/oss/docsync/issues/17"])).toEqual({
      url: "https://github.com/oss/docsync/issues/17",
      outputDir: "demo-output/imports"
    });
  });

  it("accepts an optional output directory", () => {
    expect(
      parseImportArgs(["--url", "https://github.com/oss/docsync/issues/17", "--out", "tmp/imports"])
    ).toEqual({
      url: "https://github.com/oss/docsync/issues/17",
      outputDir: "tmp/imports"
    });
  });
});
