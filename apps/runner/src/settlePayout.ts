import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { ethers } from "ethers";
import { parsePayout, releasePayout } from "@proofforge/payments";
import { loadLocalEnv } from "./loadLocalEnv";

interface SettleArgs {
  inputPath: string;
  receiptPath: string;
  releasedPath: string;
  recipient?: string;
  amount: string;
}

export async function settlePayoutOnZeroG(
  args: SettleArgs,
  now = new Date()
): Promise<{ receiptPath: string; releasedPath: string; txHash: string }> {
  await loadLocalEnv();

  const rpc = process.env.ZERO_G_EVM_RPC;
  const privateKey = process.env.ZERO_G_PRIVATE_KEY;
  if (!rpc || !privateKey) {
    throw new Error("ZERO_G_EVM_RPC and ZERO_G_PRIVATE_KEY are required.");
  }

  const payout = parsePayout(
    JSON.parse(await readFile(args.inputPath, "utf8"))
  );
  if (payout.status !== "earned") {
    throw new Error("Only earned payouts can be settled.");
  }

  const provider = new ethers.JsonRpcProvider(rpc);
  const signer = new ethers.Wallet(privateKey, provider);
  const recipient = args.recipient ?? (await signer.getAddress());
  const value = ethers.parseEther(args.amount);
  const memo = ethers.hexlify(
    ethers.toUtf8Bytes(`ProofForge payout ${payout.id}`)
  );

  const tx = await signer.sendTransaction({
    to: recipient,
    value,
    data: memo
  });
  const receipt = await tx.wait();
  if (!receipt) throw new Error("0G transaction did not return a receipt.");

  const released = releasePayout(payout, { now });
  const settlementReceipt = {
    provider: "0G Galileo Testnet",
    status: "settled",
    payoutId: payout.id,
    packetId: payout.packetId,
    from: await signer.getAddress(),
    to: recipient,
    amount: args.amount,
    currency: "0G",
    txHash: tx.hash,
    blockNumber: receipt.blockNumber,
    settledAt: now.toISOString(),
    note: "Testnet settlement receipt for the ProofForge payout release step."
  };

  await writeFile(
    args.receiptPath,
    JSON.stringify(settlementReceipt, null, 2),
    "utf8"
  );
  await writeFile(
    args.releasedPath,
    JSON.stringify(
      {
        ...released,
        notes: [
          ...released.notes,
          `0G testnet settlement tx: ${tx.hash}`,
          `Settlement receipt: ${args.receiptPath}`
        ]
      },
      null,
      2
    ),
    "utf8"
  );

  return {
    receiptPath: args.receiptPath,
    releasedPath: args.releasedPath,
    txHash: tx.hash
  };
}

function parseArgs(argv: string[]): SettleArgs {
  const inputPath = readFlag(argv, "--in");
  if (!inputPath) throw new Error("Missing --in <payout-json>.");

  const outputDir = dirname(resolve(inputPath));
  return {
    inputPath: resolve(inputPath),
    receiptPath: resolve(
      readFlag(argv, "--receipt") ?? `${outputDir}/settlement-receipt.json`
    ),
    releasedPath: resolve(
      readFlag(argv, "--out") ?? `${outputDir}/released-payout.json`
    ),
    recipient: readFlag(argv, "--recipient") ?? process.env.ZERO_G_PAYOUT_TO,
    amount:
      readFlag(argv, "--amount") ??
      process.env.ZERO_G_PAYOUT_AMOUNT ??
      "0.000001"
  };
}

function readFlag(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index === -1 ? undefined : argv[index + 1];
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  settlePayoutOnZeroG(parseArgs(process.argv.slice(2)))
    .then((result) => {
      console.log("ProofForge payout settled on 0G testnet.");
      console.log(`Receipt: ${result.receiptPath}`);
      console.log(`Released payout: ${result.releasedPath}`);
      console.log(`0G payout tx: ${result.txHash}`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
