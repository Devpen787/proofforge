import { describe, expect, it } from "vitest";
import {
  buildEnsIdentityRef,
  normalizeEnsName,
  parseEnsIdentityArgs
} from "../src/checkEnsIdentity";

describe("parseEnsIdentityArgs", () => {
  it("accepts a supplied ENS name and output path", () => {
    expect(
      parseEnsIdentityArgs([
        "--name",
        "ProofRunner.eth",
        "--address",
        "0x0000000000000000000000000000000000000001",
        "--out",
        "tmp/ens.json"
      ])
    ).toEqual({
      name: "proofrunner.eth",
      expectedAddress: "0x0000000000000000000000000000000000000001",
      rpcUrl: "https://ethereum.publicnode.com",
      outputPath: "tmp/ens.json"
    });
  });
});

describe("normalizeEnsName", () => {
  it("normalizes .eth names", () => {
    expect(normalizeEnsName(" Agent.ProofForge.eth ")).toBe(
      "agent.proofforge.eth"
    );
  });

  it("rejects non-ENS names for this demo check", () => {
    expect(() => normalizeEnsName("agent.example")).toThrow(
      "ENS name must end in .eth"
    );
  });
});

describe("buildEnsIdentityRef", () => {
  it("creates the identity reference used by proof packets", () => {
    expect(
      buildEnsIdentityRef({
        name: "ProofRunner.eth",
        address: "0x0000000000000000000000000000000000000001",
        reverseName: "ProofRunner.eth"
      })
    ).toBe(
      "ens:proofrunner.eth;addr:0x0000000000000000000000000000000000000001;reverse:proofrunner.eth"
    );
  });
});
