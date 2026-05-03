import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { runLocalMission } from "./index";
import { loadLocalEnv } from "./loadLocalEnv";
import {
  buildEvidencePacket,
  createPublicPacketView,
  writeEvidencePacketFiles
} from "../../../packages/evidence/src/index";
import {
  convertWorkLeadToMission,
  workLeadSchema
} from "../../../packages/mission/src/index";
import { createEarnedPayout } from "../../../packages/payments/src/index";
import { evaluateMissionPolicy } from "../../../packages/policy/src/index";
import {
  addMissionToProject,
  addWorkLeadToProject,
  createProject,
  recordAcceptedProof
} from "../../../packages/projects/src/index";
import {
  createLocalStorageAdapter,
  createZeroGStorageAdapter
} from "../../../packages/storage/src/index";
import { verifyRunnerArtifacts } from "../../../packages/verifier/src/index";

export interface DemoPacketResult {
  evidencePacketPath: string;
  caseFilePath: string;
  publicPacketPath: string;
  payoutPath: string;
  projectPath: string;
  submissionEvidencePath: string;
  submissionEvidenceMarkdownPath: string;
  storageProvider: string;
  storageUri: string;
  storageTxHash?: string;
  policyPath: string;
  policyStatus: string;
  verifierStatus: string;
  humanApprovalStatus: string;
  payoutStatus: string;
  projectAcceptedPackets: number;
  technologyClaims: number;
}

const defaultOutputDir = resolve("demo-output/docs-install");

const lead = workLeadSchema.parse({
  id: "lead_docs_install_001",
  sourceType: "fixture",
  sourceUrl: "https://github.com/proofforge/fixture/issues/1",
  title: "Validate installation docs",
  rawRequest:
    "Run the documented install check and prove whether it works in a clean environment.",
  repo: "proofforge/fixture",
  acceptanceOwner: "fixture-maintainer",
  desiredEvidence: [
    "runner-result.json",
    "stdout.log",
    "stderr.log",
    "environment.json"
  ],
  submissionRequirements: [
    {
      label: "Public source issue",
      detail: "GitHub issue URL is attached to the mission and packet.",
      required: true
    },
    {
      label: "Clean-environment proof",
      detail: "Run the install command in the fixture and capture logs.",
      required: true
    },
    {
      label: "Maintainer-ready case file",
      detail:
        "Package runner output, verifier result, privacy review, and summary.",
      required: true
    }
  ],
  riskLevel: "low",
  proofability: 92,
  status: "mission_ready",
  reward: {
    amount: 8,
    currency: "USD",
    type: "external"
  },
  missing: [],
  blockedActions: [
    "open pull request",
    "post public comment",
    "access private repositories"
  ]
});

export async function runDemoPacket(
  outputDir = defaultOutputDir
): Promise<DemoPacketResult> {
  await loadLocalEnv();
  await rm(outputDir, { recursive: true, force: true });

  const mission = convertWorkLeadToMission(lead);
  const policyDecision = evaluateMissionPolicy(mission);
  if (policyDecision.status === "blocked") {
    throw new Error(
      `Mission blocked by policy: ${policyDecision.reasons.join(" ")}`
    );
  }

  const policyPath = resolve(outputDir, "packet", "policy.json");
  await mkdir(resolve(outputDir, "packet"), { recursive: true });
  await writeFile(policyPath, JSON.stringify(policyDecision, null, 2), "utf8");

  const project = addMissionToProject(
    addWorkLeadToProject(
      createProject({
        id: "project_docs_onboarding",
        name: "Docs Onboarding Sprint",
        handle: "docs-onboarding",
        purpose: "Turn install friction into accepted proof packets.",
        founder: "alex",
        lanes: ["Docs validation", "Bug reproduction"],
        rewardPool: 240
      }),
      lead
    ),
    mission
  );
  const runnerResult = await runLocalMission({
    fixtureDir: resolve("apps/runner/fixtures/docs-install"),
    outputDir,
    command: "npm run proof:check",
    runId: "run_docs_install_demo"
  });
  const verifierResult = await verifyRunnerArtifacts({
    runnerResult,
    expectedCommand: "npm run proof:check"
  });
  const packet = await buildEvidencePacket({
    id: "packet_docs_install_demo",
    mission,
    runnerResult,
    verifierResult,
    approvedBy: "alex"
  });
  let files = await writeEvidencePacketFiles(
    packet,
    resolve(outputDir, "packet")
  );
  const storageAdapter = createStorageAdapter(outputDir);
  const storageReceipt = await storageAdapter.putFile({
    path: files.jsonPath,
    contentType: "application/json"
  });

  const packetWithStorageRef = {
    ...packet,
    status: "accepted" as const,
    protocolRefs: {
      ...packet.protocolRefs,
      storageUri: storageReceipt.uri,
      identityRef: "local:docs-runner-01;erc-8004-ready",
      messageTraceId: "trace:docs-runner-01:verifier-01:packager-01"
    }
  };

  files = await writeEvidencePacketFiles(
    packetWithStorageRef,
    resolve(outputDir, "packet")
  );
  const payout = createEarnedPayout({
    packet: packetWithStorageRef,
    mission,
    projectId: "project_docs_onboarding",
    recipient: "alex",
    approvedBy: "fixture-maintainer"
  });
  const payoutPath = resolve(outputDir, "packet", "payout.json");
  await writeFile(payoutPath, JSON.stringify(payout, null, 2), "utf8");

  const projectWithCredit = recordAcceptedProof(project, {
    packet: packetWithStorageRef,
    payout,
    contributor: "alex"
  });
  const projectPath = resolve(outputDir, "packet", "project.json");
  await writeFile(
    projectPath,
    JSON.stringify(projectWithCredit, null, 2),
    "utf8"
  );

  const publicPacket = createPublicPacketView({
    packet: packetWithStorageRef,
    project: "Docs Onboarding Sprint",
    acceptedBy: "fixture-maintainer",
    acceptedAt: payout.createdAt
  });
  const publicPacketPath = resolve(outputDir, "packet", "public-packet.json");
  await writeFile(
    publicPacketPath,
    JSON.stringify(publicPacket, null, 2),
    "utf8"
  );
  const submissionEvidence = buildSubmissionEvidence({
    evidencePacketPath: files.jsonPath,
    caseFilePath: files.markdownPath,
    publicPacketPath,
    payoutPath,
    projectPath,
    policyPath,
    storageReceipt
  });
  const submissionEvidencePath = resolve(
    outputDir,
    "packet",
    "submission-evidence.json"
  );
  const submissionEvidenceMarkdownPath = resolve(
    outputDir,
    "packet",
    "submission-evidence.md"
  );
  await writeFile(
    submissionEvidencePath,
    JSON.stringify(submissionEvidence, null, 2),
    "utf8"
  );
  await writeFile(
    submissionEvidenceMarkdownPath,
    renderSubmissionEvidenceMarkdown(submissionEvidence),
    "utf8"
  );

  return {
    evidencePacketPath: files.jsonPath,
    caseFilePath: files.markdownPath,
    publicPacketPath,
    payoutPath,
    projectPath,
    submissionEvidencePath,
    submissionEvidenceMarkdownPath,
    storageProvider: storageReceipt.provider,
    storageUri: storageReceipt.uri,
    storageTxHash: storageReceipt.txHash,
    policyPath,
    policyStatus: policyDecision.status,
    verifierStatus: packet.verifierResult.status,
    humanApprovalStatus: packet.humanApproval.status,
    payoutStatus: payout.status,
    projectAcceptedPackets: projectWithCredit.acceptedPacketIds.length,
    technologyClaims: submissionEvidence.claims.length
  };
}

function buildSubmissionEvidence(input: {
  evidencePacketPath: string;
  caseFilePath: string;
  publicPacketPath: string;
  payoutPath: string;
  projectPath: string;
  policyPath: string;
  storageReceipt: { provider: string; uri: string; txHash?: string };
}) {
  return {
    product: "ProofForge",
    claim:
      "Source-backed work becomes a bounded agent mission, verified proof packet, maintainer acceptance, and tracked value state.",
    generatedAt: new Date().toISOString(),
    demoPath:
      "Home -> Agent Setup -> Opportunities -> Mission Detail -> Runner -> Case File -> Maintainer Review -> My Work -> Public Proof",
    artifacts: {
      evidencePacket: input.evidencePacketPath,
      caseFile: input.caseFilePath,
      publicPacket: input.publicPacketPath,
      payout: input.payoutPath,
      project: input.projectPath,
      policy: input.policyPath
    },
    claims: [
      {
        partner: "GitHub",
        status: "live in demo",
        productUse: "Public issue URL becomes a Work Lead and mission source.",
        proofCommand:
          "npm run import:github -- --url https://github.com/microsoft/vscode/issues/1",
        output: "demo-output/imports/*.work-lead.json"
      },
      {
        partner: "ETHGlobal",
        status: "live import / submission context",
        productUse:
          "Sponsor prize requirements become source leads for judging context, not fake user work.",
        proofCommand: 'npm run import:ethglobal -- --event "Open Agents"',
        output: "demo-output/imports/ethglobal-open-agents.work-leads.json"
      },
      {
        partner: "0G Storage",
        status:
          input.storageReceipt.provider === "0g"
            ? "live in demo"
            : "implemented, credential-gated",
        productUse:
          "Evidence packet storage uses the 0G adapter when ZERO_G_* credentials are configured; otherwise local storage proves the same receipt boundary.",
        proofCommand: "npm run demo:packet",
        output: input.storageReceipt.txHash ?? input.storageReceipt.uri
      },
      {
        partner: "Agent identity / skills",
        status: "modeled locally, standards-ready",
        productUse:
          "docs-runner-01 is the bounded proof node; work rolls up to Alex and carries ERC-8004-ready identity plus ERC-8239-ready skill metadata.",
        proofCommand: "npm run demo:packet",
        output: "evidence-packet.json protocolRefs.identityRef"
      },
      {
        partner: "External bounty / payout rail",
        status: "tracked in V1, no custody",
        productUse:
          "Accepted proof creates earned payout state; release is a separate manual/external record.",
        proofCommand:
          "npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json",
        output: "payout.json and released-payout.json"
      }
    ],
    guardrails: [
      "No automatic GitHub comments or pull requests.",
      "No wallet signing or payment settlement in V1.",
      "No funds escrowed or custodied by ProofForge.",
      "No public proof before maintainer acceptance and redaction."
    ]
  };
}

function renderSubmissionEvidenceMarkdown(
  evidence: ReturnType<typeof buildSubmissionEvidence>
): string {
  const claims = evidence.claims
    .map(
      (claim) => `### ${claim.partner}

- Status: ${claim.status}
- Product use: ${claim.productUse}
- Proof command: \`${claim.proofCommand}\`
- Output: \`${claim.output}\``
    )
    .join("\n\n");
  const guardrails = evidence.guardrails.map((item) => `- ${item}`).join("\n");

  return `# ProofForge Submission Evidence

${evidence.claim}

Demo path: ${evidence.demoPath}

## Artifacts

- Evidence packet: \`${evidence.artifacts.evidencePacket}\`
- Case file: \`${evidence.artifacts.caseFile}\`
- Public packet: \`${evidence.artifacts.publicPacket}\`
- Payout: \`${evidence.artifacts.payout}\`
- Project ledger: \`${evidence.artifacts.project}\`
- Policy: \`${evidence.artifacts.policy}\`

## Technology Claims

${claims}

## Guardrails

${guardrails}
`;
}

function printDemoPacketResult(result: DemoPacketResult): void {
  console.log("ProofForge demo packet generated.");
  console.log(`Evidence packet: ${result.evidencePacketPath}`);
  console.log(`Case file: ${result.caseFilePath}`);
  console.log(`Public packet: ${result.publicPacketPath}`);
  console.log(`Earned payout: ${result.payoutPath}`);
  console.log(`Project state: ${result.projectPath}`);
  console.log(`Submission evidence: ${result.submissionEvidencePath}`);
  console.log(`Storage provider: ${result.storageProvider}`);
  console.log(`Storage URI: ${result.storageUri}`);
  console.log(`Policy decision: ${result.policyPath}`);
  console.log(`Policy status: ${result.policyStatus}`);
  if (result.storageTxHash) {
    console.log(`0G tx: ${result.storageTxHash}`);
  }
  console.log(`Verifier status: ${result.verifierStatus}`);
  console.log(`Human approval: ${result.humanApprovalStatus}`);
  console.log(`Payout status: ${result.payoutStatus}`);
  console.log(`Project accepted packets: ${result.projectAcceptedPackets}`);
  console.log(`Technology claims: ${result.technologyClaims}`);
}

function createStorageAdapter(outputDir: string) {
  const evmRpc = process.env.ZERO_G_EVM_RPC;
  const indexerRpc = process.env.ZERO_G_INDEXER_RPC;
  const privateKey = process.env.ZERO_G_PRIVATE_KEY;

  if (
    process.env.PROOFFORGE_STORAGE_PROVIDER !== "local" &&
    evmRpc &&
    indexerRpc &&
    privateKey
  ) {
    return createZeroGStorageAdapter({
      evmRpc,
      indexerRpc,
      privateKey
    });
  }

  return createLocalStorageAdapter(resolve(outputDir, "storage"));
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  runDemoPacket()
    .then(printDemoPacketResult)
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
