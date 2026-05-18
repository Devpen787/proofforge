import { describe, expect, it } from "vitest";
import { createWorkLeadFromSourceIntake } from "../src/index";

describe("createWorkLeadFromSourceIntake", () => {
  it("creates a ready-to-qualify GitHub work lead when owner, proof, and value are supplied", () => {
    const result = createWorkLeadFromSourceIntake({
      sourceUrl: "https://github.com/logos-co/nomos/issues/42",
      title: "Reproduce docs install failure",
      acceptanceOwner: "@logos-maintainer",
      proofRequirement: "clean reproduction log and environment manifest",
      valuePath: "project credit",
      now: new Date("2026-05-18T12:00:00.000Z")
    });

    expect(result.diagnosis.status).toBe("ready_to_qualify");
    expect(result.lead.sourceType).toBe("github_issue");
    expect(result.lead.repo).toBe("logos-co/nomos");
    expect(result.lead.status).toBe("proofable");
    expect(result.lead.reward?.type).toBe("credit");
  });

  it("blocks marketplace work without an acceptance owner", () => {
    const result = createWorkLeadFromSourceIntake({
      sourceUrl: "https://dealwork.ai/tasks/agent-research-100",
      proofRequirement: "buyer-ready report and source appendix",
      valuePath: "$25 external payout"
    });

    expect(result.diagnosis.status).toBe("blocked_missing_owner");
    expect(result.lead.sourceType).toBe("marketplace_task");
    expect(result.lead.missing).toContain("acceptance owner");
  });

  it("blocks work without a proof requirement before agents run", () => {
    const result = createWorkLeadFromSourceIntake({
      sourceUrl: "https://grants.gitcoin.co/round/123",
      acceptanceOwner: "Gitcoin reviewer",
      valuePath: "grant milestone decision"
    });

    expect(result.diagnosis.status).toBe("blocked_missing_proof");
    expect(result.lead.sourceType).toBe("foundation_backlog");
    expect(result.lead.missing).toContain("proof requirement");
  });

  it("blocks unsafe local or secret-bearing requests", () => {
    const result = createWorkLeadFromSourceIntake({
      sourceUrl: "http://localhost/private-task",
      acceptanceOwner: "Project steward",
      proofRequirement: "use private_key to run deployment",
      valuePath: "internal credit"
    });

    expect(result.diagnosis.status).toBe("blocked_unsafe");
    expect(result.diagnosis.unsafeReasons).toEqual(
      expect.arrayContaining([
        "source URL is not externally reviewable",
        "request appears to involve secrets"
      ])
    );
    expect(result.lead.riskLevel).toBe("high");
  });
});
