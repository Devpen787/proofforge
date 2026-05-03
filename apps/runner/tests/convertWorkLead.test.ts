import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { convertWorkLeadFile, parseConvertArgs } from "../src/convertWorkLead";

describe("parseConvertArgs", () => {
  it("accepts an input path and optional output directory", () => {
    expect(
      parseConvertArgs(["--in", "lead.json", "--out", "tmp/missions"])
    ).toEqual({
      inputPath: "lead.json",
      outputDir: "tmp/missions"
    });
  });
});

describe("convertWorkLeadFile", () => {
  it("converts a mission-ready Work Lead JSON file into a mission contract", async () => {
    const dir = resolve("demo-output/test-convert-lead");
    await mkdir(dir, { recursive: true });
    const inputPath = resolve(dir, "ready.work-lead.json");
    await writeFile(
      inputPath,
      JSON.stringify({
        lead: {
          id: "lead_docs_ready",
          sourceType: "docs_url",
          sourceUrl: "https://github.com/oss/docsync/issues/17",
          title: "Validate install docs",
          rawRequest: "Run docs install and capture evidence.",
          repo: "oss/docsync",
          acceptanceOwner: "@maintainer",
          desiredEvidence: ["runner logs", "environment manifest"],
          riskLevel: "low",
          proofability: 91,
          status: "mission_ready",
          reward: {
            amount: 8,
            currency: "USD",
            type: "external"
          },
          missing: [],
          blockedActions: ["post public comments"]
        }
      }),
      "utf8"
    );

    const outputPath = await convertWorkLeadFile({
      inputPath,
      outputDir: resolve(dir, "missions")
    });
    const mission = JSON.parse(await readFile(outputPath, "utf8"));

    expect(mission.id).toBe("mission_lead_docs_ready");
    expect(mission.type).toBe("docs_validation");
    expect(mission.humanApprovalRequired).toBe(true);
  });

  it("rejects vague Work Leads before they become missions", async () => {
    const dir = resolve("demo-output/test-convert-lead");
    await mkdir(dir, { recursive: true });
    const inputPath = resolve(dir, "vague.work-lead.json");
    await writeFile(
      inputPath,
      JSON.stringify({
        id: "lead_vague",
        sourceType: "github_issue",
        sourceUrl: "https://github.com/acme/widget/issues/1",
        title: "Broken",
        rawRequest: "It broke.",
        repo: "acme/widget",
        acceptanceOwner: "@maintainer",
        desiredEvidence: ["runner logs"],
        riskLevel: "low",
        proofability: 40,
        status: "needs_triage",
        missing: ["reproduction steps"],
        blockedActions: []
      }),
      "utf8"
    );

    await expect(
      convertWorkLeadFile({ inputPath, outputDir: resolve(dir, "missions") })
    ).rejects.toThrow("not mission-ready");
  });
});
