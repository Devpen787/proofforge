import { describe, expect, it } from "vitest";
import { parseUploadNetworkRecordArgs } from "../src/uploadNetworkRecordToZeroG";

describe("uploadNetworkRecordToZeroG", () => {
  it("parses upload input and default receipt output", () => {
    const parsed = parseUploadNetworkRecordArgs([
      "--in",
      "demo-output/proof-network-record.json"
    ]);

    expect(parsed.inputPath).toContain("proof-network-record.json");
    expect(parsed.outputPath).toContain("proof-network-record.0g-receipt.json");
  });

  it("requires a proof network record input", () => {
    expect(() => parseUploadNetworkRecordArgs([])).toThrow(
      "npm run 0g:upload-record"
    );
  });
});
