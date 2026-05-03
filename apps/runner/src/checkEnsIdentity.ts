import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { ethers } from "ethers";
import { loadLocalEnv } from "./loadLocalEnv";

export interface EnsIdentityArgs {
  name: string;
  expectedAddress?: string;
  rpcUrl: string;
  outputPath: string;
}

export interface EnsIdentityReceipt {
  provider: "ENS";
  status: "resolved" | "mismatch";
  name: string;
  resolvedAddress: string;
  expectedAddress?: string;
  reverseName?: string;
  textRecords: Record<string, string>;
  identityRef: string;
  checkedAt: string;
}

const defaultRpcUrl = "https://ethereum.publicnode.com";
const defaultOutputPath = "demo-output/identity/ens-agent-identity.json";
const textRecordKeys = ["avatar", "description", "url", "com.proofforge.agent"];

export function parseEnsIdentityArgs(argv: string[]): EnsIdentityArgs {
  const name = readFlag(argv, "--name") ?? process.env.ENS_AGENT_NAME;
  if (!name) {
    throw new Error(
      "Missing ENS name. Use: npm run ens:check -- --name agent.eth"
    );
  }

  return {
    name: normalizeEnsName(name),
    expectedAddress:
      readFlag(argv, "--address") ?? process.env.ENS_AGENT_ADDRESS,
    rpcUrl: readFlag(argv, "--rpc") ?? process.env.ENS_RPC_URL ?? defaultRpcUrl,
    outputPath: readFlag(argv, "--out") ?? defaultOutputPath
  };
}

export async function checkEnsIdentity(
  args: EnsIdentityArgs,
  now = new Date()
): Promise<EnsIdentityReceipt> {
  const provider = new ethers.JsonRpcProvider(args.rpcUrl);
  const resolvedAddress = await provider.resolveName(args.name);
  if (!resolvedAddress) {
    throw new Error(`ENS name did not resolve: ${args.name}`);
  }

  const expectedAddress = args.expectedAddress
    ? ethers.getAddress(args.expectedAddress)
    : undefined;
  const normalizedResolvedAddress = ethers.getAddress(resolvedAddress);
  const reverseName = await provider.lookupAddress(normalizedResolvedAddress);
  const resolver = await provider.getResolver(args.name);
  const textRecords: Record<string, string> = {};

  if (resolver) {
    for (const key of textRecordKeys) {
      const value = await resolver.getText(key);
      if (value) textRecords[key] = value;
    }
  }

  return {
    provider: "ENS",
    status:
      expectedAddress && expectedAddress !== normalizedResolvedAddress
        ? "mismatch"
        : "resolved",
    name: args.name,
    resolvedAddress: normalizedResolvedAddress,
    expectedAddress,
    reverseName: reverseName ?? undefined,
    textRecords,
    identityRef: buildEnsIdentityRef({
      name: args.name,
      address: normalizedResolvedAddress,
      reverseName: reverseName ?? undefined
    }),
    checkedAt: now.toISOString()
  };
}

export async function writeEnsIdentityReceipt(
  receipt: EnsIdentityReceipt,
  outputPath: string
): Promise<string> {
  const target = resolve(outputPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(receipt, null, 2), "utf8");
  return target;
}

export function buildEnsIdentityRef(input: {
  name: string;
  address: string;
  reverseName?: string;
}): string {
  const parts = [
    `ens:${normalizeEnsName(input.name)}`,
    `addr:${input.address}`
  ];
  if (input.reverseName) {
    parts.push(`reverse:${normalizeEnsName(input.reverseName)}`);
  }
  return parts.join(";");
}

export function normalizeEnsName(name: string): string {
  const normalized = name.trim().toLowerCase();
  if (!normalized.endsWith(".eth")) {
    throw new Error("ENS name must end in .eth for this demo check.");
  }
  return normalized;
}

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  if (index === -1) return undefined;
  return argv[index + 1];
}

async function main(): Promise<void> {
  await loadLocalEnv();
  const args = parseEnsIdentityArgs(process.argv.slice(2));
  const receipt = await checkEnsIdentity(args);
  const outputPath = await writeEnsIdentityReceipt(receipt, args.outputPath);

  console.log("ProofForge ENS identity checked.");
  console.log(`ENS name: ${receipt.name}`);
  console.log(`Resolved address: ${receipt.resolvedAddress}`);
  if (receipt.reverseName) console.log(`Reverse name: ${receipt.reverseName}`);
  console.log(`Status: ${receipt.status}`);
  console.log(`Identity ref: ${receipt.identityRef}`);
  console.log(`Output: ${outputPath}`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
