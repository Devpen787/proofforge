# ProofForge

> A protocol-agnostic proof layer for agent-assisted software work.

**ProofForge connects existing work sources like GitHub, project backlogs, bounty networks, and agent runs, then turns useful work into accepted proof, contribution credit, payout state, and public-safe project history.**

## 5-Second Version

AI agents make it cheap to generate code. ProofForge makes it possible to trust, track, and credit the work.

We help builders connect their work sources, see projects they contribute to, let agents or local nodes help safely, prove what works, and track credit or payout only when the contribution holds up.

## The Mission

Build together. Prove the work. Share the credit. Grow the commons.

ProofForge is not a PR spam engine, bounty marketplace, or passive-income app. It is a workbench for producing high-signal software evidence:

- bug reproductions
- PR verifications
- failing regression tests
- docs validation
- release checks
- compatibility results

The rule is simple:

> No proof, no credit.

The longer-term flywheel is:

> Connect sources -> track projects -> prove useful work -> get accepted -> record credit/value -> find better work.

## Product Scope

ProofForge starts with one narrow workflow inside that larger flywheel:

> **GitHub source/import -> qualified mission -> local agent run -> independent verification -> maintainer-safe Proof Pack -> accepted proof -> credit and earned payout state.**

The current product slice supports:

1. Import a GitHub issue.
2. Convert it into a source-backed Work Lead and small verifiable Mission.
3. Tie the run to an identifiable agent or proof node.
4. Run the mission in a local sandbox.
5. Capture commands, logs, environment, and result.
6. Ask a verifier role to independently check the work.
7. Record the runner -> verifier -> packager -> human approval trace.
8. Produce a Proof Pack a maintainer can review quickly.
9. Let a maintainer accept, request revision, or reject the packet in the product flow.
10. Create credit and earned payout state without implying automatic settlement.

### Ethereum / Web3 / Bounty Work

ProofForge can track Web3 work without overclaiming custody or settlement:

```text
GitHub issue / bounty URL / DAO proposal
-> qualified mission terms
-> accepted Proof Pack
-> credit + earned payout state
-> optional wallet, tx hash, receipt, grant, bounty, or treasury reference
```

V1 tracks wallet, bounty, and onchain receipt references. It does not custody
funds, escrow funds, issue tokens, or settle payments automatically.

For the exact V1/V2/V3 Web3 boundaries, see
[docs/ETHEREUM_WEB3_BOUNTY_INTEGRATION.md](docs/ETHEREUM_WEB3_BOUNTY_INTEGRATION.md).

## Evidence Packet

An evidence packet is the unit of value in ProofForge.

It contains:

- mission objective
- source issue or PR
- repo and commit
- environment
- commands run
- logs and artifacts
- reproduction result
- before/after proof when available
- verifier result
- risk flags
- human approval status
- maintainer-ready summary

Maintainers should not receive raw agent output. They should receive clean, verified evidence.

## Why This Matters

Open-source and protocol communities already coordinate around useful work, public goods, bounties, grants, onchain treasuries, and reputation.

ProofForge makes that pattern protocol-agnostic:

- GitHub keeps the canonical issue or PR.
- Existing bounty, grant, treasury, and marketplace networks keep their funding flows.
- Wallets and onchain records can provide payment or credential signals when available.
- ProofForge links source work, accepted proof, credit, payout state, and project history.

The goal is to help people build shared software without drowning maintainers in low-quality AI output.

## Protocol Integrations

0G storage and ENS identity are implemented in the current proof path when
configured. Additional communication and settlement integrations are roadmap
items unless the repository includes working code and proof output for them.

### 0G

0G is the persistent memory and evidence layer:

- evidence packets
- run logs
- project memory
- contribution records
- reusable task context

### Gensyn AXL

AXL is the agent/node communication layer:

- runner node
- verifier node
- packager agent
- human approval agent

The builder should not grade its own work.

### ENS

ENS can provide readable identities for:

- proof nodes
- agents
- maintainers
- project namespaces

### KeeperHub / Uniswap

These are later-stage integrations for accepted-work payout or settlement. ProofForge does not lead with payments before accepted proof exists.

## The Proof Code

1. No proof, no credit.
2. Builders do not grade their own work.
3. Maintainers receive evidence, not noise.
4. Small missions beat giant drops.
5. Human judgment guards public action.
6. Credit follows accepted usefulness.
7. Commercial work can fund the commons.
8. The work must hold.

When a contribution is verified, we say:

> The work holds.

## Current Status

This repository now has the first working proof slice:

- npm workspace scaffold
- Evidence Packet schema with validation tests
- Mission Contract schema with Work Lead conversion tests
- GitHub issue importer that turns existing public issues into Work Leads
- constrained local runner that writes artifacts
- independent verifier that checks runner artifacts
- policy gate that keeps missions local and evidence-only before approval
- demo command that generates `evidence-packet.json`, `case-file.md`, `policy.json`, `public-packet.json`, `payout.json`, and `project.json`
- accepted proof simulation that creates an earned `payout.json`
- manual release command that creates `released-payout.json`
- project credit ledger for accepted proof
- proof-to-earn product UI for the core journey

The current demo uses a deterministic fixture mission so the proof path can be reproduced locally.

## Run Locally

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Typecheck:

```bash
npm run typecheck
```

Import an existing GitHub issue as a Work Lead:

```bash
npm run import:github -- --url https://github.com/microsoft/vscode/issues/1
```

This writes a local Work Lead JSON file under:

```text
demo-output/imports/
```

The importer only reads public issue data. It does not post comments, open PRs, create payments, or contact maintainers.

Convert a mission-ready Work Lead into a Mission Contract:

```bash
npm run convert:lead -- --in demo-output/imports/example.work-lead.json
```

Vague Work Leads fail conversion until the required evidence and missing details are clear.

Generate the first evidence packet:

```bash
npm run demo:packet
npm run sync:web-proof
```

That command writes:

```text
demo-output/docs-install/packet/evidence-packet.json
demo-output/docs-install/packet/case-file.md
demo-output/docs-install/packet/policy.json
demo-output/docs-install/packet/public-packet.json
demo-output/docs-install/packet/payout.json
demo-output/docs-install/packet/project.json
```

`sync:web-proof` copies sanitized generated packet, verifier, policy, payout, and project-credit fields into the browser demo without exposing local filesystem paths or raw logs.

By default, the packet is stored through the local storage adapter and the packet records a `file://` storage URI.

The payout file is manual accounting only. It proves the accepted-work state transition:

```text
Accepted Evidence Packet -> Earned Payout
```

It does not move money automatically.

Release the earned payout as a separate manual accounting step:

```bash
npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json
```

That proves the second payment transition:

```text
Earned Payout -> Released Payout
```

The project file shows the companion coordination state:

```text
Project -> Work Lead -> Mission -> Accepted Packet -> Contributor Credit
```

To use the real 0G storage adapter, set:

```bash
ZERO_G_EVM_RPC=
ZERO_G_INDEXER_RPC=
ZERO_G_PRIVATE_KEY=
```

Then run:

```bash
npm run demo:packet
```

The 0G adapter uses the official `@0gfoundation/0g-storage-ts-sdk` package and returns a `0g://` storage URI plus transaction hash when upload succeeds.

`demo-output/` is ignored by git because it is generated proof output.

Run the web prototype:

```bash
npm run dev
```

The web app shows the core product loop:

```text
Home
-> Agent Setup
-> Guided proof flow
-> Projects
-> Opportunities
-> Runner
-> Case File
-> Maintainer Review
-> My Work
-> Builder Passport
-> Public Proof
```

Useful local routes:

```text
Home: http://localhost:5173/#opportunity
Agent Setup: http://localhost:5173/#agent-setup
Guided proof flow: http://localhost:5173/#first-run
Projects: http://localhost:5173/#projects
Opportunities: http://localhost:5173/#work-queue
My Work: http://localhost:5173/#my-work
Builder Passport: http://localhost:5173/#builder-passport
Mission detail: http://localhost:5173/#mission-detail
Runner: http://localhost:5173/#run
Case File: http://localhost:5173/#case-file
Maintainer Review: http://localhost:5173/#maintainer
Public Proof: http://localhost:5173/#public-proof
```

The current web prototype shows:

- Home: next safe action, ready work, and current earning/proof state.
- Guided proof flow: activation from safe mission to runner.
- Projects: proof ledger, project backlog, and constrained agent delegations.
- Opportunities: source import categories, GitHub import command, Work Lead diagnosis, and clarification gate.
- Runner: local execution, packet output preview, security state, and human approval checkpoint.
- Case File: maintainer/private/public artifact split.
- Maintainer Review: decision support with confidence, risk, privacy, artifacts, and payout if accepted.
- My Work: accepted work, pending proof, payout state, reputation, and next action.
- Builder Passport: observed history, accepted proof, agent runs, and proof-gated value signals.
- Public Proof: shareable accepted proof view with private details removed.

For the current documentation map, see [docs/README.md](docs/README.md).

For the demo recording flow, see [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

## Roadmap

1. Add hosted source connections for GitHub and project backlogs.
2. Add stronger sandbox execution for proof runs.
3. Add live maintainer submission integrations.
4. Add peer agent communication for runner, verifier, and packager roles.
5. Add optional onchain settlement rails after proof acceptance.

## License

MIT
