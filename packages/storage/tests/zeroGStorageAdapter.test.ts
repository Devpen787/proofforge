import { describe, expect, it } from "vitest";
import { parseZeroGUploadReceipt } from "../src/zeroGStorageAdapter";

describe("parseZeroGUploadReceipt", () => {
  it("keeps the 0G root hash and tx hash from object SDK results", () => {
    const receipt = parseZeroGUploadReceipt(
      {
        rootHash: "0xroot-from-sdk",
        txHash: "0xtx"
      },
      "0xroot-from-merkle-tree"
    );

    expect(receipt.provider).toBe("0g");
    expect(receipt.uri).toBe("0g://0xroot-from-merkle-tree");
    expect(receipt.rootHash).toBe("0xroot-from-merkle-tree");
    expect(receipt.txHash).toBe("0xtx");
  });

  it("handles fragmented upload tx hashes", () => {
    const receipt = parseZeroGUploadReceipt(
      {
        rootHashes: ["0xroot"],
        txHashes: ["0xtx-fragment"]
      },
      "0xroot"
    );

    expect(receipt.txHash).toBe("0xtx-fragment");
  });
});
