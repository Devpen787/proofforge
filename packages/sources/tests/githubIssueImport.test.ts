import { describe, expect, it } from "vitest";
import {
  buildHackathonReadinessChecklist,
  classifyHackathonPrizeRequirement,
  importEthGlobalPrizeLeads,
  importGitHubContributionHistory,
  importGitHubIssueLead,
  parseGitHubIssueUrl
} from "../src/index";

describe("parseGitHubIssueUrl", () => {
  it("parses a public issue URL into API coordinates", () => {
    expect(
      parseGitHubIssueUrl("https://github.com/polkadot-js/api/issues/4821")
    ).toEqual({
      owner: "polkadot-js",
      repo: "api",
      issueNumber: 4821,
      apiUrl: "https://api.github.com/repos/polkadot-js/api/issues/4821",
      htmlUrl: "https://github.com/polkadot-js/api/issues/4821"
    });
  });

  it("rejects non-issue GitHub URLs", () => {
    expect(() =>
      parseGitHubIssueUrl("https://github.com/polkadot-js/api/pulls/4821")
    ).toThrow("Expected a GitHub issue URL");
  });
});

describe("importGitHubContributionHistory", () => {
  it("imports GitHub account history as observed contributions only", async () => {
    const requestedUrls: string[] = [];
    const result = await importGitHubContributionHistory({
      login: "alex-dev",
      now: new Date("2026-05-03T12:00:00.000Z"),
      fetch: async (url) => {
        requestedUrls.push(url);
        const isPrSearch = url.includes("type%3Apr");
        return {
          ok: true,
          status: 200,
          json: async () => ({
            items: isPrSearch
              ? [
                  {
                    html_url: "https://github.com/oss/docsync/pull/42",
                    title: "Improve install docs",
                    state: "closed",
                    repository_url: "https://api.github.com/repos/oss/docsync",
                    created_at: "2026-04-20T10:00:00.000Z",
                    closed_at: "2026-04-21T10:00:00.000Z",
                    pull_request: {
                      merged_at: "2026-04-21T10:00:00.000Z"
                    }
                  }
                ]
              : [
                  {
                    html_url: "https://github.com/oss/docsync/issues/17",
                    title: "Docs install flow fails on Ubuntu",
                    state: "open",
                    repository_url: "https://api.github.com/repos/oss/docsync",
                    created_at: "2026-04-19T10:00:00.000Z"
                  }
                ]
          })
        };
      }
    });

    expect(requestedUrls).toHaveLength(2);
    expect(result).toMatchObject({
      source: "github",
      login: "alex-dev",
      claimBoundary: "observed_history_is_not_accepted_credit"
    });
    expect(result.observed).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "issue",
          sourceUrl: "https://github.com/oss/docsync/issues/17",
          acceptanceSignal: "open",
          proofStatus: "observed_not_accepted_credit"
        }),
        expect.objectContaining({
          kind: "pull_request",
          sourceUrl: "https://github.com/oss/docsync/pull/42",
          acceptanceSignal: "merged",
          proofStatus: "observed_not_accepted_credit"
        })
      ])
    );
  });

  it("rejects unsafe GitHub login input", async () => {
    await expect(
      importGitHubContributionHistory({
        login: "alex/dev",
        fetch: async () => ({
          ok: true,
          status: 200,
          json: async () => ({ items: [] })
        })
      })
    ).rejects.toThrow("GitHub login");
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
          labels: [
            { name: "bug" },
            { name: "needs reproduction" },
            { name: "docs" }
          ],
          user: { login: "maintainer" }
        })
      })
    });

    expect(result.lead.status).toBe("mission_ready");
    expect(result.lead.repo).toBe("oss/docsync");
    expect(result.lead.proofability).toBeGreaterThanOrEqual(80);
    expect(result.lead.missing).toEqual([]);
    expect(result.lead.desiredEvidence).toContain("broken documentation step");
    expect(result.lead.submissionRequirements[0].label).toBe(
      "Canonical public issue"
    );
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

describe("importEthGlobalPrizeLeads", () => {
  it("turns sponsor prize requirements into source-backed work leads", async () => {
    const result = await importEthGlobalPrizeLeads({
      event: "Open Agents",
      now: new Date("2026-05-01T12:00:00.000Z"),
      fetch: async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          results: [
            {
              name: "Uniswap Foundation",
              prizes: [
                {
                  title: "Best Uniswap API integration",
                  description:
                    "Build an agent that uses the Uniswap API with transparent execution.",
                  qualifications:
                    "Every submission must include a FEEDBACK.md file in the repo root."
                }
              ]
            }
          ]
        })
      })
    });

    expect(result.source).toBe("ethglobal");
    expect(result.prizeCount).toBe(1);
    expect(result.leads[0].sourceType).toBe("ethglobal_prize");
    expect(result.leads[0].sponsor).toBe("Uniswap Foundation");
    expect(result.leads[0].submissionRequirements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Feedback file" }),
        expect.objectContaining({ label: "Agent framework proof" }),
        expect.objectContaining({ label: "Protocol-use proof" }),
        expect.objectContaining({ label: "Sponsor qualification" })
      ])
    );
    expect(buildHackathonReadinessChecklist(result.leads[0])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "feedback_file",
          evidenceField: "feedbackArtifact"
        }),
        expect.objectContaining({
          category: "sponsor_acceptance",
          status: "blocked"
        })
      ])
    );
    expect(result.leads[0].blockedActions).toContain(
      "sign transactions or spend funds"
    );
  });

  it("classifies hackathon bounty wording into proof artifacts", () => {
    expect(
      classifyHackathonPrizeRequirement(
        "Deploy the contract on testnet, add an architecture diagram, and submit a demo video."
      )
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: "deployment" }),
        expect.objectContaining({ category: "architecture" }),
        expect.objectContaining({ category: "demo" })
      ])
    );
  });
});
