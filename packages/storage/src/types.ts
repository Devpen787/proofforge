export interface StorageReceipt {
  provider: "local" | "0g";
  uri: string;
  rootHash?: string;
  txHash?: string;
}

export interface StorageAdapter {
  putFile(input: {
    path: string;
    contentType: string;
  }): Promise<StorageReceipt>;
}
