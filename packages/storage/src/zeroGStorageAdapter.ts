import { ethers } from "ethers";
import { Indexer, ZgFile } from "@0gfoundation/0g-storage-ts-sdk";
import type { StorageAdapter } from "./types";

export interface ZeroGStorageConfig {
  evmRpc: string;
  indexerRpc: string;
  privateKey: string;
}

export function createZeroGStorageAdapter(config: ZeroGStorageConfig): StorageAdapter {
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
        const [tx, uploadError] = await indexer.upload(file, config.evmRpc, signer);

        if (uploadError !== null) {
          throw uploadError;
        }

        const rootHash = tree.rootHash();
        if (rootHash === null) {
          throw new Error("0G merkle tree did not return a root hash.");
        }

        return {
          provider: "0g",
          uri: `0g://${rootHash}`,
          rootHash,
          txHash: String(tx)
        };
      } finally {
        await file.close();
      }
    }
  };
}
