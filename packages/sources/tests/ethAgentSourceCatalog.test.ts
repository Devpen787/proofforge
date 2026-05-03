import { describe, expect, it } from "vitest";
import {
  getEthAgentSourceCatalogEntry,
  listEthAgentSourceCatalog
} from "../src/index";

describe("ethAgentSourceCatalog", () => {
  it("keeps live import sources separate from manual and research sources", () => {
    const liveSources = listEthAgentSourceCatalog({ adapterStatus: "live" });

    expect(liveSources.map((source) => source.id)).toEqual([
      "github-issues",
      "ethglobal"
    ]);
  });

  it("identifies bounty and marketplace sources that can enrich work leads", () => {
    const taskMarketplaces = listEthAgentSourceCatalog({
      category: "task_marketplace"
    });

    expect(taskMarketplaces).toEqual([
      expect.objectContaining({
        id: "dework",
        sourceTypes: expect.arrayContaining(["marketplace_task"])
      })
    ]);
  });

  it("marks payment rails as metadata sources, not mission-ready work by default", () => {
    const x402 = getEthAgentSourceCatalogEntry("x402");

    expect(x402.category).toBe("agent_payment_rail");
    expect(x402.adapterStatus).toBe("research_only");
    expect(x402.blockedClaims).toContain(
      "do not imply ProofForge supports live settlement until implemented"
    );
  });
});
