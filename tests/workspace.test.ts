import { describe, expect, it } from "vitest";
import { proofForgeDoctrine } from "../packages/shared/src/index";

describe("workspace", () => {
  it("keeps the top-level doctrine available to implementation code", () => {
    expect(proofForgeDoctrine).toContain("work economy already exists");
  });
});
