import { describe, expect, it } from "vitest";
import { importGitHubIssueLead, parseGitHubIssueUrl } from "../src/index";

describe("parseGitHubIssueUrl", () => {
  it("parses a public issue URL into API coordinates", () => {
    expect(parseGitHubIssueUrl("https://github.com/polkadot-js/api/issues/4821")).toEqual({
      owner: "polkadot-js",
      repo: "api",
      issueNumber: 4821,
      apiUrl: "https://api.github.com/repos/polkadot-js/api/issues/4821",
      htmlUrl: "https://github.com/polkadot-js/api/issues/4821"
    });
  });

  it("rejects non-issue GitHub URLs", () => {
    expect(() => parseGitHubIssueUrl("https://github.com/polkadot-js/api/pulls/4821")).toThrow(
      "Expected a GitHub issue URL"
    );
  });
});

describe("importGitHubIssueLead", () => {
  it("turns a structured GitHub issue into a mission-ready work lead", async () => {
    const result = await importGitHubIssueLead({
      url: "https://github.com/oss/docsync/issues/17",
      now: new Date("2026-05-01T12:00:00.000Z"),
      fetch: async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          html_url: "https://github.com/oss/docsync/issues/17",
          number: 17,
          title: "Docs install flow fails on Ubuntu",
          body: [
            "Steps to reproduce:",
            "```sh",
            "npm run docs:install",
            "```",
            "Expected: install completes.",
            "Actual: command fails with missing package.",
            "OS: Ubuntu 24.04, Node 22."
          ].join("\n"),
          state: "open",
          labels: [{ name: "bug" }, { name: "needs reproduction" }, { name: "docs" }],
          user: { login: "maintainer" }
        })
      })
    });

    expect(result.lead.status).toBe("mission_ready");
    expect(result.lead.repo).toBe("oss/docsync");
    expect(result.lead.proofability).toBeGreaterThanOrEqual(80);
    expect(result.lead.missing).toEqual([]);
    expect(result.lead.desiredEvidence).toContain("broken documentation step");
    expect(result.diagnosis.recommendation).toContain("Convert to a mission");
  });

  it("keeps vague issues in triage with missing info", async () => {
    const result = await importGitHubIssueLead({
      url: "https://github.com/acme/widget/issues/3",
      fetch: async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          html_url: "https://github.com/acme/widget/issues/3",
          number: 3,
          title: "Thing broken",
          body: "It does not work.",
          state: "open",
          labels: [],
          user: { login: "alice" }
        })
      })
    });

    expect(result.lead.status).toBe("needs_triage");
    expect(result.lead.missing).toContain("reproduction steps");
    expect(result.diagnosis.recommendation).toContain("Ask for");
  });
});
