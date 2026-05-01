import { mkdir, copyFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import type { StorageAdapter } from "./types";

export function createLocalStorageAdapter(baseDir: string): StorageAdapter {
  return {
    async putFile(input) {
      await mkdir(baseDir, { recursive: true });
      const destination = join(baseDir, basename(input.path));
      await copyFile(input.path, destination);

      return {
        provider: "local",
        uri: `file://${resolve(destination)}`
      };
    }
  };
}
