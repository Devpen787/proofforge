import { chmod, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const envPath = ".env.local";

async function promptHidden(prompt: string): Promise<string> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("Run this command in an interactive terminal.");
  }

  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  return new Promise((resolve, reject) => {
    let value = "";

    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.off("data", onData);
      process.stdout.write("\n");
    };

    const onData = (chunk: string) => {
      if (chunk === "\u0003") {
        cleanup();
        reject(new Error("Cancelled."));
        return;
      }

      if (chunk === "\r" || chunk === "\n") {
        cleanup();
        resolve(value.trim());
        return;
      }

      if (chunk === "\u007f") {
        value = value.slice(0, -1);
        return;
      }

      value += chunk;
    };

    process.stdin.on("data", onData);
  });
}

export async function setZeroGPrivateKey(): Promise<void> {
  const privateKey = await promptHidden("Paste 0G Galileo private key: ");

  if (!/^0x[a-fA-F0-9]{64}$/.test(privateKey)) {
    throw new Error(
      "Invalid private key. Expected 0x followed by 64 hexadecimal characters."
    );
  }

  const body = [
    "ZERO_G_EVM_RPC=https://evmrpc-testnet.0g.ai",
    "ZERO_G_INDEXER_RPC=https://indexer-storage-testnet-turbo.0g.ai",
    `ZERO_G_PRIVATE_KEY=${privateKey}`,
    ""
  ].join("\n");

  await writeFile(envPath, body, "utf8");
  await chmod(envPath, 0o600);
  console.log("Saved .env.local with 0G Galileo endpoints and private key.");
  console.log("Run `npm run 0g:check` to verify without printing the key.");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  setZeroGPrivateKey().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
