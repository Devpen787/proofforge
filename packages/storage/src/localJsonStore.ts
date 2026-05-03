import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { JsonStore } from "./types";

export function createLocalJsonStore<T>(path: string): JsonStore<T> {
  const resolved = resolve(path);

  return {
    async read() {
      try {
        return JSON.parse(await readFile(resolved, "utf8")) as T;
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "ENOENT"
        ) {
          return undefined;
        }
        throw error;
      }
    },
    async write(value) {
      await mkdir(dirname(resolved), { recursive: true });
      await writeFile(resolved, JSON.stringify(value, null, 2), "utf8");

      return {
        provider: "local",
        uri: `file://${resolved}`
      };
    }
  };
}
