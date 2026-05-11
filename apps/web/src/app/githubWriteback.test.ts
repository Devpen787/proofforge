import { describe, expect, it } from "vitest";
import {
  buildMaintainerGitHubComment,
  proofSourceIssueUrl
} from "./githubWriteback";

describe("GitHub writeback", () => {
  it("creates a maintainer-ready comment without credential claims", () => {
    const comment = buildMaintainerGitHubComment({
      packetId: "packet_docs_install_demo",
      mission: "Validate installation docs",
      result: "Docs install flow fails in a clean fixture."
    });

    expect(proofSourceIssueUrl).toContain("github.com");
    expect(comment).toContain("ProofForge packet ready");
    expect(comment).toContain("Validate installation docs");
    expect(comment).toContain("evidence-only mode");
    expect(comment).not.toContain("OAuth");
  });
});
