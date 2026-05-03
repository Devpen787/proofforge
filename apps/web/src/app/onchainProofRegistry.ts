import {
  encodeDeployData,
  encodeFunctionData,
  isAddress,
  keccak256,
  stringToBytes,
  type Address,
  type Hex
} from "viem";
import { generatedProofSummary } from "../demo";
import {
  proofRegistryAbi,
  proofRegistryBytecode
} from "../contracts/proofRegistryArtifact";

export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export interface ProofAnchorInput {
  reviewerAddress: string;
  contributorAddress?: string;
  payoutReceiptRef?: string;
}

export interface ProofAnchorPayload {
  contributor: Address;
  projectId: string;
  packetId: string;
  packetHash: Hex;
  packetUri: string;
  payoutRef: string;
}

export interface ProofAnchorResult {
  registryAddress: string;
  transactionHash: string;
  packetHash: Hex;
}

export interface ProofRegistryDeployment {
  transactionHash: string;
  registryAddress?: string;
}

const configuredRegistryAddress = import.meta.env
  .VITE_PROOF_REGISTRY_ADDRESS as string | undefined;

const configuredContributorAddress = import.meta.env
  .VITE_PROOF_CONTRIBUTOR_ADDRESS as string | undefined;

export function getConfiguredProofRegistryAddress() {
  return configuredRegistryAddress?.trim() ?? "";
}

export function canUseConfiguredProofRegistry() {
  const address = getConfiguredProofRegistryAddress();
  return Boolean(address && isAddress(address));
}

function requireAddress(value: string, label: string): Address {
  if (!isAddress(value)) {
    throw new Error(`${label} must be a valid wallet address.`);
  }
  return value;
}

export function buildAcceptedProofAnchor(
  input: ProofAnchorInput
): ProofAnchorPayload {
  const contributor = requireAddress(
    configuredContributorAddress?.trim() || input.contributorAddress || "",
    "Contributor"
  );
  const packetUri =
    generatedProofSummary.protocolRefs.storageUri ??
    generatedProofSummary.publicPacketId;
  const payoutRef =
    input.payoutReceiptRef?.trim() ||
    `${generatedProofSummary.payout.amount} ${generatedProofSummary.payout.status}`;
  const packetHash = keccak256(
    stringToBytes(
      JSON.stringify({
        project: generatedProofSummary.project,
        mission: generatedProofSummary.mission,
        packetId: generatedProofSummary.publicPacketId,
        packetUri,
        verifierStatus: generatedProofSummary.verifierStatus,
        acceptedBy: generatedProofSummary.acceptedBy,
        payoutRef
      })
    )
  );

  return {
    contributor,
    projectId: "docs-onboarding-sprint",
    packetId: generatedProofSummary.publicPacketId,
    packetHash,
    packetUri,
    payoutRef
  };
}

export function encodeAcceptedProofCall(payload: ProofAnchorPayload) {
  return encodeFunctionData({
    abi: proofRegistryAbi,
    functionName: "recordAcceptedProof",
    args: [
      payload.contributor,
      payload.projectId,
      payload.packetId,
      payload.packetHash,
      payload.packetUri,
      payload.payoutRef
    ]
  });
}

export function encodeProofRegistryDeployData() {
  return encodeDeployData({
    abi: proofRegistryAbi,
    bytecode: proofRegistryBytecode
  });
}

export async function deployProofRegistry(input: {
  ethereum: EthereumProvider;
  from: string;
}): Promise<ProofRegistryDeployment> {
  const from = requireAddress(input.from, "Reviewer");
  const transactionHash = await input.ethereum.request({
    method: "eth_sendTransaction",
    params: [{ from, data: encodeProofRegistryDeployData() }]
  });
  const hash = String(transactionHash);
  return {
    transactionHash: hash,
    registryAddress: await waitForContractAddress(input.ethereum, hash)
  };
}

async function waitForContractAddress(
  ethereum: EthereumProvider,
  transactionHash: string
) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const receipt = await ethereum
      .request({
        method: "eth_getTransactionReceipt",
        params: [transactionHash]
      })
      .catch(() => undefined);
    const contractAddress =
      receipt &&
      typeof receipt === "object" &&
      "contractAddress" in receipt &&
      typeof receipt.contractAddress === "string"
        ? receipt.contractAddress
        : "";
    if (contractAddress && isAddress(contractAddress)) {
      return contractAddress;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 2000));
  }
  return undefined;
}

export async function anchorAcceptedProof(input: {
  ethereum: EthereumProvider;
  from: string;
  registryAddress: string;
  payoutReceiptRef?: string;
}): Promise<ProofAnchorResult> {
  const from = requireAddress(input.from, "Reviewer");
  const registryAddress = requireAddress(
    input.registryAddress,
    "Proof registry"
  );
  const payload = buildAcceptedProofAnchor({
    reviewerAddress: from,
    contributorAddress: from,
    payoutReceiptRef: input.payoutReceiptRef
  });
  const transactionHash = await input.ethereum.request({
    method: "eth_sendTransaction",
    params: [
      {
        from,
        to: registryAddress,
        data: encodeAcceptedProofCall(payload)
      }
    ]
  });

  return {
    registryAddress,
    transactionHash: String(transactionHash),
    packetHash: payload.packetHash
  };
}
