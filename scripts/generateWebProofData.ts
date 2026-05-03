import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { format } from "prettier";

interface PublicArtifact {
  label: string;
  mediaType: string;
  sha256: string;
}

interface PublicPacket {
  id: string;
  packetId: string;
  status: string;
  project: string;
  mission: string;
  acceptedBy: string;
  acceptedAt: string;
  whatWasProven: string;
  evidenceSummary: string;
  publicArtifacts: PublicArtifact[];
}

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  notes: string[];
}

interface SettlementReceipt {
  provider: string;
  status: string;
  txHash: string;
  amount: string;
  currency: string;
  to: string;
}

interface GitHubMaintainerComment {
  status: "draft" | "posted";
  issueUrl: string;
  commentUrl?: string;
}

interface Policy {
  status: string;
  humanApprovalRequired: boolean;
  allowedActions: string[];
  blockedActions: string[];
}

interface EvidencePacket {
  protocolRefs?: {
    storageUri?: string;
    identityRef?: string;
    messageTraceId?: string;
  };
  verifierResult: {
    status: string;
  };
  humanApproval: {
    status: string;
  };
  requirementsSatisfied: Array<{
    label: string;
    status: string;
    evidence: string;
  }>;
}

interface ProjectState {
  rewardPool: number;
  acceptedPacketIds: string[];
  creditLedger: Array<{
    contributor: string;
    points: number;
    reason: string;
  }>;
}

interface SubmissionEvidence {
  claims: Array<{
    partner: string;
    status: string;
    output: string;
  }>;
}

const sourceDir = resolve("demo-output/docs-install/packet");
const importsDir = resolve("demo-output/imports");
const outPath = resolve("apps/web/src/demo/proofSummary.ts");

async function readJson<T>(fileName: string): Promise<T> {
  return JSON.parse(await readFile(resolve(sourceDir, fileName), "utf8")) as T;
}

async function readOptionalJson<T>(path: string): Promise<T | undefined> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

interface GeneratedSourceLead {
  source: string;
  title: string;
  sourceUrl: string;
  repo: string;
  acceptanceOwner: string;
  status: string;
  proofability: string;
  valuePath: string;
  mode: string;
}

async function readGeneratedSourceLeads(): Promise<GeneratedSourceLead[]> {
  const files = await readdir(importsDir).catch(() => []);
  const leads: GeneratedSourceLead[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const input = await readOptionalJson<{
      source?: string;
      lead?: {
        title: string;
        sourceUrl: string;
        repo: string;
        acceptanceOwner: string;
        status: string;
        proofability: number;
        reward: { amount: number; currency: string; type: string };
      };
      leads?: Array<{
        title: string;
        sourceUrl: string;
        repo: string;
        acceptanceOwner: string;
        status: string;
        proofability: number;
        reward: { amount: number; currency: string; type: string };
      }>;
    }>(resolve(importsDir, file));

    const importedLeads = input?.lead ? [input.lead] : (input?.leads ?? []);
    for (const lead of importedLeads.slice(
      0,
      input?.source === "ethglobal" ? 2 : 1
    )) {
      leads.push({
        source: input?.source ?? "import",
        title: lead.title,
        sourceUrl: lead.sourceUrl,
        repo: lead.repo,
        acceptanceOwner: lead.acceptanceOwner,
        status: lead.status,
        proofability: `${lead.proofability}%`,
        valuePath:
          lead.reward.amount > 0
            ? `${lead.reward.amount} ${lead.reward.currency}`
            : lead.reward.type,
        mode:
          input?.source === "ethglobal"
            ? "submission context, not user inventory"
            : "live local import"
      });
    }
  }

  return leads;
}

async function main(): Promise<void> {
  const publicPacket = await readJson<PublicPacket>("public-packet.json");
  const payout = await readJson<Payout>("payout.json");
  const releasedPayout =
    (await readOptionalJson<Payout>(
      resolve(sourceDir, "released-payout.json")
    )) ?? payout;
  const policy = await readJson<Policy>("policy.json");
  const evidencePacket = await readJson<EvidencePacket>("evidence-packet.json");
  const project = await readJson<ProjectState>("project.json");
  const submissionEvidence = await readOptionalJson<SubmissionEvidence>(
    resolve(sourceDir, "submission-evidence.json")
  );
  const settlementReceipt = await readOptionalJson<SettlementReceipt>(
    resolve(sourceDir, "settlement-receipt.json")
  );
  const githubComment = await readOptionalJson<GitHubMaintainerComment>(
    resolve(sourceDir, "github-maintainer-comment.json")
  );
  const credit = project.creditLedger[0];
  const generatedWorkSources = await readGeneratedSourceLeads();
  const zeroGClaim = submissionEvidence?.claims.find(
    (claim) => claim.partner === "0G Storage"
  );
  const storageUri = evidencePacket.protocolRefs?.storageUri;
  const storageTxHash = zeroGClaim?.output;
  const identityRef = evidencePacket.protocolRefs?.identityRef;

  const generatedProofSummary = {
    generatedFrom: "demo-output/docs-install/packet",
    packetId: publicPacket.packetId,
    publicPacketId: publicPacket.id,
    status: publicPacket.status,
    project: publicPacket.project,
    mission: publicPacket.mission,
    acceptedBy: publicPacket.acceptedBy,
    acceptedAt: publicPacket.acceptedAt,
    acceptedDate: new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(publicPacket.acceptedAt)),
    whatWasProven: publicPacket.whatWasProven,
    evidenceSummary: publicPacket.evidenceSummary,
    verifierStatus: evidencePacket.verifierResult.status,
    humanApprovalStatus: evidencePacket.humanApproval.status,
    requirementsSatisfied: evidencePacket.requirementsSatisfied.map(
      (requirement) => ({
        label: requirement.label,
        status: requirement.status,
        evidence: requirement.evidence
      })
    ),
    policyStatus: policy.status,
    humanApprovalRequired: policy.humanApprovalRequired,
    allowedActionCount: policy.allowedActions.length,
    blockedActionCount: policy.blockedActions.length,
    protocolRefs: {
      storageProvider: zeroGClaim ? "0G Storage" : "local",
      storageStatus: zeroGClaim?.status ?? "local evidence",
      storageUri,
      storageRootShort: storageUri?.replace("0g://", "").slice(0, 14),
      storageTxHash,
      storageTxShort: storageTxHash
        ? `${storageTxHash.slice(0, 10)}...${storageTxHash.slice(-6)}`
        : undefined,
      identityRef,
      identityLabel: formatIdentityRef(identityRef),
      messageTraceId: evidencePacket.protocolRefs?.messageTraceId
    },
    payout: {
      id: payout.id,
      amount: `$${payout.amount}`,
      currency: payout.currency,
      status: releasedPayout.status,
      method: payout.method,
      note: payout.notes[0],
      settlement: settlementReceipt
        ? {
            provider: settlementReceipt.provider,
            status: settlementReceipt.status,
            amount: `${settlementReceipt.amount} ${settlementReceipt.currency}`,
            txHash: settlementReceipt.txHash,
            txShort: `${settlementReceipt.txHash.slice(
              0,
              10
            )}...${settlementReceipt.txHash.slice(-6)}`,
            recipientShort: `${settlementReceipt.to.slice(
              0,
              6
            )}...${settlementReceipt.to.slice(-4)}`
          }
        : {
            provider: null,
            status: null,
            amount: null,
            txHash: null,
            txShort: null,
            recipientShort: null
          }
    },
    maintainerSubmission: {
      provider: "GitHub",
      status: githubComment?.status ?? "packet-ready",
      issueUrl:
        githubComment?.issueUrl ??
        "https://github.com/Devpen787/proofforge/issues/1",
      commentUrl: githubComment?.commentUrl
    },
    projectCredit: {
      rewardPool: `$${project.rewardPool}`,
      acceptedPackets: project.acceptedPacketIds.length,
      contributor: credit?.contributor ?? "unknown",
      points: credit?.points ?? 0,
      reason: credit?.reason ?? "Accepted proof packet"
    },
    publicArtifacts: publicPacket.publicArtifacts.map((artifact) => ({
      label: artifact.label,
      mediaType: artifact.mediaType,
      sha256Short: artifact.sha256.slice(0, 12)
    })),
    generatedWorkSources
  };

  const source = await format(
    [
      "/* This file is generated by `npm run sync:web-proof` from sanitized demo packet artifacts. */",
      "export const generatedProofSummary = " +
        JSON.stringify(generatedProofSummary, null, 2) +
        " as const;",
      ""
    ].join("\n"),
    { parser: "typescript", trailingComma: "none" }
  );

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, source, "utf8");
  console.log(`Generated web proof data: ${outPath}`);
}

function formatIdentityRef(identityRef: string | undefined): string {
  if (!identityRef) return "docs-runner-01";

  const ensPart = identityRef
    .split(";")
    .find((part) => part.startsWith("ens:"));
  if (ensPart) return ensPart.replace("ens:", "");

  const localPart = identityRef
    .split(";")
    .find((part) => part.startsWith("local:"));
  return localPart?.replace("local:", "") ?? identityRef.split(";")[0];
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
