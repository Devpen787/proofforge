import { describe, expect, it } from "vitest";
import {
  defaultSavedState,
  normalizeSavedState
} from "../src/app/workspaceState";

describe("web privacy model", () => {
  it("keeps public proof unpublished by default", () => {
    expect(defaultSavedState.publicProofPublished).toBe(false);
    expect(normalizeSavedState({ accepted: true }).publicProofPublished).toBe(
      false
    );
  });

  it("preserves explicit publication state from imported workspace data", () => {
    expect(
      normalizeSavedState({
        accepted: true,
        publicProofPublished: true
      }).publicProofPublished
    ).toBe(true);
  });
});
