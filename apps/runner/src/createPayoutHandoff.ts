import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parsePayout } from "../../../packages/payments/src/index";

interface ProofNetworkRecordLike {
  id?: string;
  packet?: {
    id?: string;
    mission?: string;
    project?: string;
    storage?: string;
  };
  receipts?: {
    walletAddress?: string;
    payoutReceipt?: string;
    zeroGReceipt?: string;
  };
}

interface PayoutHandoffArgs {
  payoutPath: string;
  recordPath?: string;
  recipientAddress?: string;
  safeAddress?: string;
  outputDir: string;
}

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index === -1 ? undefined : argv[index + 1];
}

export function parsePayoutHandoffArgs(argv: string[]): PayoutHandoffArgs {
  const payoutPath = readFlag(argv, "--payout");
  if (!payoutPath) {
    throw new Error(
      "Usage: npm run payout:handoff -- --payout <payout.json> [--record <proof-network-record.json>] [--recipient 0x...]"
    );
  }

  return {
    payoutPath: resolve(payoutPath),
    recordPath: readFlag(argv, "--record")
      ? resolve(readFlag(argv, "--record") as string)
      : undefined,
    recipientAddress: readFlag(argv, "--recipient"),
    safeAddress: readFlag(argv, "--safe"),
    outputDir:
      readFlag(argv, "--out") ?? resolve(dirname(payoutPath), "payout-handoff")
  };
}

function assertAddressOrPlaceholder(value: string) {
  if (value.startsWith("0x") && value.length === 42) return value;
  return value || "external-recipient";
}

export async function createPayoutHandoff(
  args: PayoutHandoffArgs
): Promise<string> {
  const payout = parsePayout(
    JSON.parse(await readFile(args.payoutPath, "utf8"))
  );
  const record = args.recordPath
    ? (JSON.parse(
        await readFile(args.recordPath, "utf8")
      ) as ProofNetworkRecordLike)
    : undefined;
  const recipient = assertAddressOrPlaceholder(
    args.recipientAddress ??
      record?.receipts?.walletAddress ??
      payout.recipient ??
      "external-recipient"
  );
  const safeAddress = args.safeAddress ?? "set-safe-address-before-execution";
  const proofRef =
    record?.receipts?.zeroGReceipt ??
    record?.packet?.storage ??
    record?.id ??
    payout.packetId;

  const outputDir = resolve(args.outputDir);
  await mkdir(outputDir, { recursive: true });

  const safeTx = {
    version: "proof-safe-transaction/v1",
    chainId: 1,
    safeAddress,
    to: recipient,
    value: payout.currency === "ETH" ? payout.amount.toString() : "0",
    token: payout.currency === "ETH" ? "native" : payout.currency,
    data: "0x",
    operation: 0,
    metadata: {
      payoutId: payout.id,
      packetId: payout.packetId,
      projectId: payout.projectId,
      proofRef,
      note: "Prepared for Safe execution. ProofForge does not submit or sign this transaction."
    }
  };

  const splitsRecipients = {
    version: "proof-splits-config/v1",
    distribution: [
      {
        recipient,
        percentAllocation: 100,
        role: "accepted-proof-recipient"
      }
    ],
    metadata: {
      payoutId: payout.id,
      packetId: payout.packetId,
      proofRef,
      note: "Prepared recipient config only. Deploy or update a Splits contract externally."
    }
  };

  const dripsReference = {
    version: "proof-drips-reference/v1",
    project: {
      id: payout.projectId,
      source: record?.packet?.project ?? payout.projectId
    },
    receiver: recipient,
    amount: {
      value: payout.amount,
      currency: payout.currency
    },
    proofRef,
    note: "Prepared Drips funding reference only. Create or update Drips externally."
  };

  const manifest = {
    version: "proof-payout-handoff/v1",
    payout,
    proof: {
      recordId: record?.id,
      packetId: record?.packet?.id ?? payout.packetId,
      proofRef
    },
    rails: {
      safe: join(outputDir, "safe-transaction.json"),
      splits: join(outputDir, "splits-recipients.json"),
      drips: join(outputDir, "drips-reference.json")
    },
    boundaries: [
      "ProofForge prepares payout rail metadata; it does not custody or move funds.",
      "Safe, Splits, Drips, wallets, or external platforms execute settlement.",
      "Attach the resulting transaction or platform receipt back to ProofForge after release."
    ]
  };

  await writeFile(manifest.rails.safe, JSON.stringify(safeTx, null, 2), "utf8");
  await writeFile(
    manifest.rails.splits,
    JSON.stringify(splitsRecipients, null, 2),
    "utf8"
  );
  await writeFile(
    manifest.rails.drips,
    JSON.stringify(dripsReference, null, 2),
    "utf8"
  );
  const manifestPath = join(outputDir, "payout-handoff.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  return manifestPath;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  createPayoutHandoff(parsePayoutHandoffArgs(process.argv.slice(2)))
    .then((outputPath) => {
      console.log("ProofForge payout handoff written.");
      console.log(`Manifest: ${outputPath}`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
