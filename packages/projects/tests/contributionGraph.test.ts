import { describe, expect, it } from "vitest";
import {
  addAgentRunRecord,
  addGitHubHistoryToContributionGraph,
  addMarketplaceSyncRecord,
  addObservedContribution,
  addValueSignal,
  buildBuilderPassport,
  connectAccountReference,
  createContributionGraph,
  createProject,
  importOnchainReceiptReference,
  issueProofCredentialReference,
  linkObservedContributionToProof,
  parseContributionGraph,
  recommendContributionProjectIds,
  recordAcceptedProofInGraph,
  type AcceptedProofRecord,
  type ContributorIdentity,
  type ObservedContribution,
  type ValueSignal
} from "../src/index";
import type { GitHubContributionHistoryImport } from "@proofforge/sources";

const now = new Date("2026-05-03T00:00:00.000Z");

const identity: ContributorIdentity = {
  id: "contributor_alex",
  handle: "alex",
  displayName: "Alex",
  githubLogin: "alex-dev",
  walletAddress: "0x1111111111111111111111111111111111111111",
  agentIds: ["docs-runner-01"],
  createdAt: now.toISOString()
};

const project = createProject({
  id: "project_docs",
  name: "Docs Onboarding Sprint",
  handle: "docs-onboarding",
  purpose: "Turn install friction into accepted proof packets.",
  founder: "alex",
  lanes: ["Docs validation"],
  now
});

const observedContribution: ObservedContribution = {
  id: "observed_pr_42",
  contributorId: identity.id,
  projectId: project.id,
  source: "github",
  kind: "pull_request",
  title: "Improve docs install steps",
  sourceUrl: "https://github.com/proofforge/fixture/pull/42",
  repo: "proofforge/fixture",
  status: "observed",
  observedAt: now.toISOString(),
  notes: ["Imported from GitHub history; not accepted ProofForge credit yet."]
};

const acceptedProof: AcceptedProofRecord = {
  packetId: "packet_docs_install_demo",
  projectId: project.id,
  contributorId: identity.id,
  missionId: "mission_docs_install",
  acceptedBy: "fixture-maintainer",
  acceptedAt: now.toISOString(),
  payoutId: "payout_packet_docs_install_demo",
  publicProofId: "public_packet_docs_install_demo",
  points: 12
};

const linkedReceipt: ValueSignal = {
  id: "receipt_docs_install",
  contributorId: identity.id,
  projectId: project.id,
  type: "onchain_receipt",
  status: "linked_to_accepted_proof",
  chainId: 16601,
  txHash: "0x2222222222222222222222222222222222222222222222222222222222222222",
  amount: 0.000001,
  currency: "0G",
  linkedPacketId: acceptedProof.packetId,
  observedAt: now.toISOString()
};

const githubHistory: GitHubContributionHistoryImport = {
  source: "github",
  importedAt: now.toISOString(),
  login: "alex-dev",
  claimBoundary: "observed_history_is_not_accepted_credit",
  observed: [
    {
      id: "github_pull_request_oss_docsync_42",
      kind: "pull_request",
      title: "Improve docs install steps",
      sourceUrl: "https://github.com/oss/docsync/pull/42",
      repo: "oss/docsync",
      state: "closed",
      authoredAt: now.toISOString(),
      closedAt: now.toISOString(),
      acceptanceSignal: "merged",
      proofStatus: "observed_not_accepted_credit",
      notes: ["Imported from GitHub history."]
    },
    {
      id: "github_issue_oss_docsync_17",
      kind: "issue",
      title: "Docs install flow fails",
      sourceUrl: "https://github.com/oss/docsync/issues/17",
      repo: "oss/docsync",
      state: "open",
      authoredAt: now.toISOString(),
      acceptanceSignal: "open",
      proofStatus: "observed_not_accepted_credit",
      notes: ["Imported from GitHub history."]
    },
    {
      id: "github_issue_other_repo_1",
      kind: "issue",
      title: "Untracked repo issue",
      sourceUrl: "https://github.com/other/repo/issues/1",
      repo: "other/repo",
      state: "open",
      authoredAt: now.toISOString(),
      acceptanceSignal: "open",
      proofStatus: "observed_not_accepted_credit",
      notes: ["Imported from GitHub history."]
    }
  ]
};

describe("V2 contribution graph", () => {
  it("keeps observed GitHub history separate from accepted ProofForge credit", () => {
    const graph = addObservedContribution(
      createContributionGraph({
        id: "graph_alex",
        identities: [identity],
        projects: [project],
        now
      }),
      observedContribution
    );

    expect(graph.observedContributions).toHaveLength(1);
    expect(graph.acceptedProofs).toHaveLength(0);
    expect(buildBuilderPassport(graph, identity.id)).toMatchObject({
      observedCount: 1,
      acceptedProofCount: 0,
      proofPoints: 0
    });
  });

  it("links observed history to accepted proof without duplicating packet credit", () => {
    const graph = recordAcceptedProofInGraph(
      linkObservedContributionToProof(
        addObservedContribution(
          createContributionGraph({
            id: "graph_alex",
            identities: [identity],
            projects: [project],
            now
          }),
          observedContribution
        ),
        {
          contributionId: observedContribution.id,
          packetId: acceptedProof.packetId
        }
      ),
      acceptedProof
    );

    expect(graph.observedContributions[0]).toMatchObject({
      status: "accepted",
      acceptedPacketId: acceptedProof.packetId
    });
    expect(() => recordAcceptedProofInGraph(graph, acceptedProof)).toThrow(
      "Accepted proof is already recorded in graph."
    );
    expect(buildBuilderPassport(graph, identity.id)).toMatchObject({
      observedCount: 1,
      acceptedProofCount: 1,
      proofPoints: 12
    });
  });

  it("only links value signals to accepted proof records", () => {
    const graph = createContributionGraph({
      id: "graph_alex",
      identities: [identity],
      projects: [project],
      now
    });

    expect(() => addValueSignal(graph, linkedReceipt)).toThrow(
      "Value signal can only link to accepted proof."
    );

    const graphWithProof = recordAcceptedProofInGraph(graph, acceptedProof);
    const graphWithReceipt = addValueSignal(graphWithProof, linkedReceipt);

    expect(buildBuilderPassport(graphWithReceipt, identity.id)).toMatchObject({
      linkedValueSignalCount: 1
    });
  });

  it("summarizes agent history and next project recommendations", () => {
    const graph = addAgentRunRecord(
      addObservedContribution(
        recordAcceptedProofInGraph(
          createContributionGraph({
            id: "graph_alex",
            identities: [identity],
            projects: [project],
            now
          }),
          acceptedProof
        ),
        {
          ...observedContribution,
          status: "needs_proof"
        }
      ),
      {
        id: "run_docs_1",
        agentId: "docs-runner-01",
        ownerId: identity.id,
        projectId: project.id,
        missionId: acceptedProof.missionId,
        packetId: acceptedProof.packetId,
        status: "accepted",
        specialty: "docs-validation",
        completedAt: now.toISOString()
      }
    );

    expect(buildBuilderPassport(graph, identity.id)).toMatchObject({
      agentRunCount: 1,
      projectIds: [project.id],
      specialties: ["docs-validation"]
    });
    expect(recommendContributionProjectIds(graph, identity.id)).toEqual([
      project.id
    ]);
  });

  it("validates graph shape at the package boundary", () => {
    expect(() =>
      parseContributionGraph({
        id: "bad_graph",
        identities: [],
        projects: [],
        observedContributions: [],
        acceptedProofs: [],
        valueSignals: [
          {
            ...linkedReceipt,
            txHash: "not-a-tx"
          }
        ],
        agentRuns: [],
        updatedAt: now.toISOString()
      })
    ).toThrow();
  });

  it("adds matched GitHub history to the graph without treating it as accepted credit", () => {
    const graph = addGitHubHistoryToContributionGraph(
      createContributionGraph({
        id: "graph_alex",
        identities: [identity],
        projects: [project],
        now
      }),
      {
        contributorId: identity.id,
        history: githubHistory,
        projectByRepo: {
          "oss/docsync": project.id
        }
      }
    );

    expect(graph.observedContributions).toHaveLength(2);
    expect(graph.acceptedProofs).toHaveLength(0);
    expect(graph.observedContributions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceUrl: "https://github.com/oss/docsync/pull/42",
          status: "observed",
          notes: expect.arrayContaining(["GitHub signal: merged."])
        }),
        expect.objectContaining({
          sourceUrl: "https://github.com/oss/docsync/issues/17",
          status: "needs_proof",
          notes: expect.arrayContaining(["GitHub signal: open."])
        })
      ])
    );
    expect(buildBuilderPassport(graph, identity.id)).toMatchObject({
      observedCount: 2,
      acceptedProofCount: 0,
      proofPoints: 0
    });
  });

  it("tracks connected accounts, marketplace snapshots, receipts, and credentials without bypassing proof", () => {
    const baseGraph = createContributionGraph({
      id: "graph_alex",
      identities: [identity],
      projects: [project],
      now
    });

    const connected = connectAccountReference(
      connectAccountReference(baseGraph, {
        id: "account_github_alex",
        contributorId: identity.id,
        provider: "github",
        status: "oauth_configured",
        handle: "alex-dev",
        sourceUrl: "https://github.com/alex-dev",
        webhookUrl: "https://example.com/webhooks/github",
        connectedAt: now.toISOString(),
        notes: ["OAuth app and webhook endpoint are configured references."]
      }),
      {
        id: "account_wallet_alex",
        contributorId: identity.id,
        provider: "wallet",
        status: "verified_reference",
        walletAddress: identity.walletAddress,
        connectedAt: now.toISOString(),
        notes: ["Wallet ownership is a reference, not proof of work."]
      }
    );

    const synced = addMarketplaceSyncRecord(connected, {
      id: "sync_ethglobal_open_agents",
      projectId: project.id,
      source: "ethglobal",
      status: "adapter_ready",
      sourceUrl: "https://ethglobal.com/events/open-agents",
      importedLeadIds: ["ethglobal_open-agents_uniswap_1"],
      blockedClaims: ["does not submit hackathon projects automatically"],
      syncedAt: now.toISOString()
    });

    const receiptOnly = importOnchainReceiptReference(synced, {
      id: "receipt_unlinked",
      contributorId: identity.id,
      projectId: project.id,
      chainId: 1,
      txHash:
        "0x3333333333333333333333333333333333333333333333333333333333333333",
      sourceUrl:
        "https://etherscan.io/tx/0x3333333333333333333333333333333333333333333333333333333333333333",
      now
    });

    expect(receiptOnly.valueSignals[0]).toMatchObject({
      status: "observed_reference",
      linkedPacketId: undefined
    });
    expect(() =>
      issueProofCredentialReference(receiptOnly, {
        id: "credential_early",
        contributorId: identity.id,
        projectId: project.id,
        packetId: acceptedProof.packetId,
        type: "builder_passport_badge",
        status: "issued_reference",
        issuer: "ProofForge",
        credentialUrl: "https://proof.example/credentials/early",
        issuedAt: now.toISOString()
      })
    ).toThrow("Credential references require accepted proof.");

    const accepted = recordAcceptedProofInGraph(receiptOnly, acceptedProof);
    const withLinkedReceipt = importOnchainReceiptReference(accepted, {
      id: "receipt_linked",
      contributorId: identity.id,
      projectId: project.id,
      chainId: 16601,
      txHash:
        "0x2222222222222222222222222222222222222222222222222222222222222222",
      linkedPacketId: acceptedProof.packetId,
      amount: linkedReceipt.amount,
      currency: linkedReceipt.currency,
      now
    });
    const withCredential = issueProofCredentialReference(withLinkedReceipt, {
      id: "credential_packet_docs_install",
      contributorId: identity.id,
      projectId: project.id,
      packetId: acceptedProof.packetId,
      type: "builder_passport_badge",
      status: "issued_reference",
      issuer: "ProofForge",
      credentialUrl: "https://proof.example/credentials/packet-docs-install",
      issuedAt: now.toISOString()
    });

    expect(withCredential.connectedAccounts).toHaveLength(2);
    expect(withCredential.marketplaceSyncs[0]).toMatchObject({
      source: "ethglobal",
      status: "adapter_ready"
    });
    expect(withCredential.credentialReferences).toHaveLength(1);
    expect(buildBuilderPassport(withCredential, identity.id)).toMatchObject({
      acceptedProofCount: 1,
      linkedValueSignalCount: 2
    });
  });
});
