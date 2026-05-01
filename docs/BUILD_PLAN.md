# ProofForge Build Plan

ProofForge will be built in small, reviewable commits. The app preview is a useful product sketch, but we will not paste a large generated component into the repo.

## Product Goal

Build one working loop:

> GitHub issue -> mission contract -> local runner -> verifier -> evidence packet -> human approval.

Everything else is secondary until this loop works.

## Current Working Slice

The repo currently proves:

```text
GitHub/public work source
-> Work Lead
-> Mission Contract
-> policy gate
-> local runner artifacts
-> independent verifier result
-> evidence packet JSON
-> markdown case file
-> public-safe packet
-> earned payout
-> released payout
-> project credit
```

Run it with:

```bash
npm run demo:packet
```

This writes generated artifacts under:

```text
demo-output/docs-install/
```

The next critical step is real 0G storage for the generated packet.

The current web prototype also shows the product journey:

```text
Opportunity
-> First Run
-> Projects
-> Work Queue
-> Runner
-> Case File
-> Maintainer Review
-> Scoreboard
-> Public Proof
```

## Storage Adapter

The packet demo now stores generated evidence through a storage adapter.

Default:

```text
local adapter -> file:// URI
```

0G path:

```text
0G adapter -> 0g:// root hash URI
```

The 0G adapter is enabled when these environment variables are present:

```text
ZERO_G_EVM_RPC
ZERO_G_INDEXER_RPC
ZERO_G_PRIVATE_KEY
```

The adapter uses the official `@0gfoundation/0g-storage-ts-sdk` SDK and `ethers`.

## What The Preview Gives Us

The preview defines the right user journey:

1. Onboard a contributor or proof node.
2. Import or choose a mission.
3. Run agents in a sandbox.
4. Stop for human approval when risk appears.
5. Generate an evidence packet.
6. Submit to a maintainer-safe inbox.
7. Track accepted work and reputation.

It also gives us useful vocabulary:

- mission
- work lead
- proof node
- runner
- verifier
- skeptic
- packager
- evidence packet
- case file
- maintainer inbox
- contribution ledger

## What We Will Not Do

We will not:

- commit one large generated component
- fake commit history
- ship inert UI as if it works
- build payouts before proof works
- post to GitHub or maintainers automatically
- let the builder grade its own work
- claim 0G, AXL, ENS, KeeperHub, or Uniswap integrations before they exist

## Implementation Order

### 1. Evidence Packet Schema

Goal:

Define the core object judges and maintainers will inspect.

Deliverables:

- `packages/evidence`
- TypeScript schema
- example packet fixture
- validation tests

Definition of done:

- invalid packets fail validation
- example packet passes validation
- README explains the packet fields

### 2. Mission Contract Schema

Goal:

Define how raw work becomes a small, proofable mission.

Deliverables:

- `packages/mission`
- mission schema
- sample GitHub issue mission fixture
- validation tests

Definition of done:

- mission has objective, source, allowed actions, risk level, evidence required, and human approval rule

### 3. Local Runner Proof

Goal:

Run a safe command locally and capture evidence.

Deliverables:

- `apps/runner`
- command execution wrapper
- environment manifest
- log capture
- artifact directory

Definition of done:

- runner can execute a fixture reproduction command
- logs and environment are written to disk
- no network or public submission is performed

### 4. Evidence Packet Generator

Goal:

Turn runner output into a maintainer-readable packet.

Deliverables:

- packet builder
- markdown summary
- JSON packet
- fixture output

Definition of done:

- packet includes mission, environment, commands, logs, artifacts, result, risk flags, and approval status

### 5. Verifier

Goal:

Run an independent verification pass.

Deliverables:

- `packages/verifier`
- verifier result schema
- second-run comparison

Definition of done:

- verifier result is stored separately from runner result
- packet cannot be marked verified without verifier output

### 6. Web App Shell

Goal:

Create the visible ProofForge workflow without pretending unsupported features exist.

Deliverables:

- `apps/web`
- mission board
- runner status
- evidence packet preview
- human approval screen
- maintainer inbox mock

Definition of done:

- app runs locally
- core flow is clickable
- seeded data matches the working schemas

### 7. 0G Adapter

Goal:

Store evidence packets and project memory through a clean adapter.

Deliverables:

- `packages/storage`
- local adapter first
- 0G adapter when credentials and SDK setup are ready

Definition of done:

- app uses the storage interface
- local adapter works before 0G is connected
- 0G integration is documented honestly when added

### 8. AXL Agent Communication

Goal:

Show runner and verifier as separate cooperating agents.

Deliverables:

- `packages/agents`
- runner agent
- verifier agent
- packager agent
- AXL message adapter when available

Definition of done:

- messages are visible in logs
- runner and verifier are separate roles
- AXL usage is documented with setup steps

## First Commit Sequence

1. `docs: define MVP build plan`
2. `chore: scaffold monorepo`
3. `feat: add evidence packet schema`
4. `test: validate evidence packet fixtures`
5. `feat: add mission contract schema`
6. `test: validate mission fixtures`
7. `feat: capture local runner logs`
8. `feat: generate evidence packet from runner output`
9. `feat: add independent verifier result`
10. `feat: scaffold web app shell`

## Quality Gates

Every commit should answer:

- What changed?
- Why does it matter?
- How was it verified?
- What remains fake or mocked?

The work must hold.
