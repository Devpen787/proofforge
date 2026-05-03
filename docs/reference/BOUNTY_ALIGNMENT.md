# ProofForge Bounty Alignment

> Reference only. The current source of truth is
> [`../OPERATING_GUIDE.md`](../OPERATING_GUIDE.md).

This document separates real implemented tech from demo narrative and future integrations. Do not claim a bounty integration is live unless it passes the proof gate below.

The pre-submission execution plan lives in
[`INTEGRATION_PRE_SUBMISSION_PLAN.md`](./INTEGRATION_PRE_SUBMISSION_PLAN.md).

## Current Hackathon Thesis

ProofForge should not rebuild the work economy. Existing projects, GitHub issues, bounties, grants, and marketplaces already contain the work.

ProofForge adds:

```text
source work -> safe run -> independent verification -> evidence packet -> human acceptance -> credit / payout record
```

## What Is Real Today

### GitHub Source Import

Status: implemented.

Where:

- `packages/sources`
- `apps/runner/src/importGitHubIssue.ts`
- command: `npm run import:github -- --url <github issue url>`

What it does:

- reads a public GitHub issue through the GitHub API
- turns it into a local Work Lead
- scores proofability
- identifies missing information
- blocks PR/comment/payment action

Why it matters:

GitHub can be the first real source of work. We do not need to invent demand before the product works.

### Mission / Policy / Runner / Verifier

Status: implemented locally.

Where:

- `packages/mission`
- `packages/policy`
- `apps/runner`
- `packages/verifier`

What it does:

- converts a Work Lead into a scoped mission
- evaluates safety policy
- runs a deterministic local proof fixture
- writes logs and environment artifacts
- verifies runner output separately

Why it matters:

This is the working proof spine. It shows the product is not only UI.

### Evidence Packet / Case File / Public Packet

Status: implemented.

Where:

- `packages/evidence`
- command: `npm run demo:packet`

What it does:

- creates structured evidence packet JSON
- creates maintainer-readable case file markdown
- creates public-safe packet view
- strips local file storage refs from public proof

Why it matters:

The packet is the asset. This is what maintainers and judges should inspect.

### Earned / Released Payout Accounting

Status: implemented as manual accounting.

Where:

- `packages/payments`
- `apps/runner/src/releasePayout.ts`

What it does:

- creates earned payout after accepted proof
- separates earned from released
- supports manual release state

What it does not do:

- no automatic transfer
- no escrow
- no payment rail integration

Why it matters:

We can honestly show “proof before payout” without pretending money moved automatically.

### Project Credit / Proof Ledger

Status: implemented locally.

Where:

- `packages/projects`

What it does:

- creates project records
- attaches Work Leads and missions
- attaches constrained agent delegations
- records accepted proof
- updates project contribution state

Why it matters:

This supports the project-centered proof economy story.

## Sponsor / Bounty Tech Status

### 0G

Status: adapter implemented, live usage credential-gated.

Where:

- `packages/storage`
- `packages/storage/src/zeroGStorageAdapter.ts`
- command path: `npm run demo:packet`

Tech used:

- `@0gfoundation/0g-storage-ts-sdk`
- `ethers`

How it works:

```text
No credentials -> local storage adapter
ZERO_G_EVM_RPC + ZERO_G_INDEXER_RPC + ZERO_G_PRIVATE_KEY -> 0G adapter
```

Claim level:

```text
We have a real 0G adapter in code. The default demo uses local storage unless credentials are configured.
```

Proof gate before claiming live 0G:

- run `npm run demo:packet` with 0G credentials
- output must show `Storage provider: 0g`
- output must show `Storage URI: 0g://...`
- output should show transaction hash when returned by the SDK

### Gensyn AXL

Status: not live.

Current product usage:

- runner, verifier, and packager roles are modeled
- independent verifier exists locally
- message trace field exists in packet protocol refs

Missing:

- no live AXL adapter
- no real agent/node message transport
- no setup instructions

Claim level:

```text
AXL is an intended agent communication layer, not a completed integration.
```

Proof gate before claiming:

- create an AXL adapter package
- record runner/verifier/packager messages through AXL
- store `messageTraceId` in the evidence packet
- document setup and verification command

### ENS

Status: not live.

Current product usage:

- packet protocol refs support `identityRef`
- UI/demo copy can show readable identities

Missing:

- no ENS resolver
- no wallet or name lookup
- no identity binding for agents, maintainers, projects, or nodes

Claim level:

```text
ENS is a planned identity layer, not a completed integration.
```

Proof gate before claiming:

- resolve an ENS name in code
- attach identity ref to an evidence packet
- display it in public proof

### KeeperHub / Uniswap / Payment Rails

Status: later-stage only.

Current product usage:

- earned payout record
- released payout record
- external/manual payout labels

Missing:

- no escrow
- no settlement
- no swap
- no automatic payout

Claim level:

```text
Payments are manual accounting in the MVP. Commercial work and bounty networks can fund missions, but ProofForge does not move funds yet.
```

Proof gate before claiming:

- implement a payment adapter
- verify payment state through a real external API or transaction
- keep earned and released states distinct in UI and packet data

## Product UI Implications

The product should show real integrations only where they are true.

Use visible labels:

- `GitHub import: live`
- `Local runner: live`
- `Verifier: live`
- `Evidence packet: live`
- `Agent identity: modeled locally`
- `Coordination trace: modeled locally`
- `0G storage: available with credentials`
- `AXL: planned`
- `ENS: planned`
- `Payout rails: manual accounting`

Do not put planned integrations in primary user flows as if they already work.

## Next Bounty Work

Priority order:

1. Make the GitHub import visible and usable from Opportunities.
2. Add Agent / Node Setup so the user understands who runs proof.
3. Add local coordination trace so the packet shows Runner -> Verifier -> Packager -> Human approval.
4. Run and record one 0G credentialed packet upload if credentials are available.
5. Decide whether AXL or ENS can be made real in the remaining time.
6. Keep payment rails as manual accounting unless a real integration is completed.

## Submission Rule

For every bounty claim, we need:

- file path
- command to run
- expected output
- screenshot or generated artifact
- honest limitation

If we cannot provide those five things, it belongs in “planned,” not “implemented.”
