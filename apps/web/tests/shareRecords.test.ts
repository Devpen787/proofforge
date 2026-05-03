import { afterEach, describe, expect, it, vi } from "vitest";
import { screenFromHash } from "../src/app/helpers";
import {
  buildShareUrl,
  readSharedStateFromHash
} from "../src/app/shareRecords";

describe("share records", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses shared routes without losing the product screen", () => {
    vi.stubGlobal("window", {
      location: {
        hash: "#maintainer?share=abc",
        href: "https://proofforge.test/#maintainer?share=abc"
      }
    });

    expect(screenFromHash()).toBe("maintainer");
  });

  it("round-trips app state through a reviewer URL", () => {
    vi.stubGlobal("window", {
      atob: globalThis.atob,
      btoa: globalThis.btoa,
      location: {
        hash: "#case-file",
        href: "https://proofforge.test/#case-file"
      }
    });

    const url = buildShareUrl("maintainer", {
      accepted: true,
      activeMission: "checkout",
      agentRegistered: true
    });
    const parsed = new URL(url);

    vi.stubGlobal("window", {
      atob: globalThis.atob,
      btoa: globalThis.btoa,
      location: {
        hash: parsed.hash,
        href: url
      }
    });

    expect(readSharedStateFromHash()).toMatchObject({
      accepted: true,
      activeMission: "checkout",
      agentRegistered: true
    });
  });
});
