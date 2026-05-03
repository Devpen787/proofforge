import { ethers } from "ethers";
import { Indexer, ZgFile } from "@0gfoundation/0g-storage-ts-sdk";
import type { StorageAdapter } from "./types";

export interface ZeroGStorageConfig {
  evmRpc: string;
  indexerRpc: string;
  privateKey: string;
}

export function createZeroGStorageAdapter(
  config: ZeroGStorageConfig
): StorageAdapter {
  return {
    async putFile(input) {
      const file = await ZgFile.fromFilePath(input.path);

      try {
        const [tree, treeError] = await file.merkleTree();
        if (treeError !== null || tree === null) {
          throw treeError;
        }

        const provider = new ethers.JsonRpcProvider(config.evmRpc);
        const signer = new ethers.Wallet(config.privateKey, provider);
        const indexer = new Indexer(config.indexerRpc);
        const [tx, uploadError] = await indexer.upload(
          file,
          config.evmRpc,
          signer
        );

        if (uploadError !== null) {
          throw uploadError;
        }

        const rootHash = tree.rootHash();
        if (rootHash === null) {
          throw new Error("0G merkle tree did not return a root hash.");
        }

        return parseZeroGUploadReceipt(tx, rootHash);
      } finally {
        await file.close();
      }
    }
  };
}

export function parseZeroGUploadReceipt(
  tx: unknown,
  rootHash: string
): {
  provider: "0g";
  uri: string;
  rootHash: string;
  txHash?: string;
} {
  const txHash = extractTxHash(tx);

  return {
    provider: "0g",
    uri: `0g://${rootHash}`,
    rootHash,
    txHash
  };
}

function extractTxHash(tx: unknown): string | undefined {
  if (typeof tx === "string") return tx;
  if (!tx || typeof tx !== "object") return undefined;

  const candidate = tx as {
    txHash?: unknown;
    transactionHash?: unknown;
    hash?: unknown;
    txHashes?: unknown;
  };

  if (typeof candidate.txHash === "string") return candidate.txHash;
  if (typeof candidate.transactionHash === "string") {
    return candidate.transactionHash;
  }
  if (typeof candidate.hash === "string") return candidate.hash;
  if (
    Array.isArray(candidate.txHashes) &&
    typeof candidate.txHashes[0] === "string"
  ) {
    return candidate.txHashes[0];
  }

  return undefined;
}
