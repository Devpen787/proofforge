# ProofForge

> A contribution layer for useful project work across people, agents, and existing work networks.

**ProofForge helps builders and their agents move real projects forward, turn useful work into accepted proof, and track the credit, payout, reputation, access, or public proof that follows.**

## 5-Second Version

ProofForge is the layer between messy work and recognized value.

It connects work from GitHub issues, open-source projects, project backlogs, bounty boards, grant milestones, marketplaces, and agent runs, then turns that work into proof a maintainer or steward can accept.

AI agents make it cheap to generate code and perform software tasks. ProofForge makes it possible to organize, verify, credit, and pay for the useful work that actually holds up.

## The Mission

Build together. Prove the work. Share the credit. Grow the commons.

ProofForge is not another marketplace, PR spam engine, or passive-income app. It does not replace GitHub, bounty networks, grant programs, DAO treasuries, or agent frameworks. It connects them through proof.

The idea is simple: people already work on their own projects, other people's projects, open-source repos, protocol backlogs, bounties, grants, and unfinished software. Agents can help move that work forward, but without a shared coordination and acceptance layer, the result is scattered effort, unclear credit, and too many useful projects left half-done.

ProofForge gives that work a structure:

```text
source-backed project work
-> human or bounded agent help
-> evidence packet
-> maintainer or steward acceptance
-> credit, payout, reputation, access, and project history
```

The current product is a workbench for producing high-signal software evidence:

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

The north star is a living contribution economy: useful projects get more help, contributors and agent owners get recognized, and accepted work compounds back into the project instead of disappearing in issues, chats, or one-off bounty boards.

## Product Scope

ProofForge starts with one narrow workflow inside that larger flywheel:

> **GitHub source/import -> qualified mission -> local agent run -> independent verification -> maintainer-safe Proof Pack -> accepted proof -> credit and earned payout state.**

The current product slice supports:

1. Create a project workspace with purpose and contribution context.
2. Create a project work request with reward, acceptance owner, and contributor
   invite.
3. Import a real public GitHub issue directly inside the web app.
4. Convert qualified GitHub/project work into a small verifiable Mission.
5. Tie the run to an identifiable agent or proof node.
6. Run the mission in a local sandbox.
7. Capture commands, logs, environment, and result.
8. Ask a verifier role to independently check the work.
9. Record the runner -> verifier -> packager -> human approval trace.
10. Produce a Proof Pack a maintainer can review quickly.
11. Let a maintainer accept, request revision, or reject the packet in the
    product flow.
12. Export the Proof Pack, copy reviewer/public links, and create credit or
    earned payout state without implying automatic settlement.
13. Record an external wallet receipt after acceptance when a payout actually
    happens.
14. Export a hash-linked ProofForge event record for source import, packet
    readiness, submission, acceptance, and payout receipt state.

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

ProofForge also keeps a local signed-event chain for the state it does own:
source import, proof packet creation, review decisions, accepted credit, and
manual payout receipts. That record can be wallet-signed and exported from
Settings as 0G-ready JSON.

For the exact V1/V2/V3 Web3 boundaries, see
[docs/ETHEREUM_WEB3_BOUNTY_INTEGRATION.md](docs/ETHEREUM_WEB3_BOUNTY_INTEGRATION.md).

For the authority boundary between ProofForge, GitHub, maintainers, wallets,
bounty platforms, and storage networks, see
[docs/AUTHORITY_MODEL.md](docs/AUTHORITY_MODEL.md).

For the credential-light V1 operating model, see
[docs/CREDENTIAL_LIGHT_OPERATIONAL_V1.md](docs/CREDENTIAL_LIGHT_OPERATIONAL_V1.md).

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

Ethereum and other protocol ecosystems show why this matters: global contributors can improve shared infrastructure, earn reputation, receive grants or bounties, and help public goods compound over time. Most builders and smaller projects do not have the same coordination layer. Their work is spread across issues, chats, demos, agents, private tasks, and unfinished ideas.

ProofForge makes that contribution pattern protocol-agnostic:

- GitHub keeps the canonical issue or PR.
- Existing bounty, grant, treasury, and marketplace networks keep their funding flows.
- Wallets and onchain records can provide payment or credential signals when available.
- ProofForge links source work, accepted proof, credit, payout state, and project history.

The goal is to help people and agents build shared software without drowning maintainers in low-quality AI output or losing credit for useful work that actually helped.

## Protocol Integrations

0G storage and ENS identity are implemented in the current proof path when
configured. Additional communication and settlement integrations are roadmap
items unless the repository includes working code and proof output for them.

### 0G

0G is the persistent memory and evidence layer. ProofForge uses 0G meaningfully
because accepted proof needs durable, shareable evidence instead of screenshots
or unverifiable claims:

- evidence packets
- run logs
- project memory
- contribution records
- reusable task context

When `ZERO_G_*` credentials are configured, `npm run demo:packet` stores the
Proof Pack through the 0G adapter and records a `0g://` storage URI plus
transaction hash. `npm run settle:payout` can also attach a 0G Galileo testnet
settlement receipt to the payout release step without giving ProofForge custody
of funds.

### ENS

ENS provides readable identities for agents and proof nodes. ProofForge uses ENS
meaningfully when `npm run ens:check` resolves an agent name and carries that
identity into the proof packet and public proof:

- proof nodes
- agents
- maintainers
- project namespaces

### Future Settlement And Communication Rails

Later integrations can add peer agent communication, reliable execution, or
onchain settlement after proof acceptance. ProofForge does not lead with
payments before accepted proof exists, and the README only names prize tracks
that are meaningful in the current product.

## Prize And Bounty Alignment

ProofForge targets prizes only where the sponsor technology is part of the
product loop, not just mentioned in the UI.

### Primary Targets

#### 0G - Best Agent Framework, Tooling & Core Extensions

ProofForge fits this track as agent tooling and infrastructure for useful
software work:

- source-backed work intake from GitHub, bounty, grant, marketplace, or project
  sources
- Work Lead qualification into bounded missions
- proof node identity, skills, permissions, and blocked actions
- runner, verifier, packager, and human approval trace
- Proof Pack generation for maintainers
- durable proof storage through the 0G adapter when configured
- credit and payout state created only after accepted proof

This is the strongest fit because ProofForge is a reusable layer that other
agent runtimes, project workrooms, and bounty systems can plug into.

#### 0G - Best Autonomous Agents, Swarms & iNFT Innovations

ProofForge can also fit this track as a bounded autonomous-agent application,
with the current demo focused on one proof node and a clear path to runner,
verifier, and packager agents:

- the proof node assesses sourced work
- local execution is constrained by policy
- verifier checks artifacts before submission
- evidence is packaged for human acceptance
- agent work rolls up to the owner and project ledger

This track should be positioned as a working bounded-agent proof loop, not as a
fully autonomous swarm.

#### ENS - Best ENS Integration for AI Agents

ProofForge fits this track if the demo shows a real ENS-resolved agent identity:

- `npm run ens:check -- --name <agent.eth> --address <agent-wallet>`
- the resolved ENS identity is written into an identity receipt
- the proof packet carries the agent identity reference
- the public proof shows the agent/proof-node identity attached to accepted work

ENS improves the product because agent identity is part of trust, discovery, and
credit. It is not cosmetic; it tells reviewers which proof node helped and who
the work rolls up to.

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
- browser-persistent project, request, invite, proof, review, and payout state
- Evidence Packet schema with validation tests
- Mission Contract schema with Work Lead conversion tests
- GitHub issue importer that turns existing public issues into Work Leads
- GitHub contribution history import for Builder Passport and contribution graph
  modeling
- constrained local runner that writes artifacts
- independent verifier that checks runner artifacts
- policy gate that keeps missions local and evidence-only before approval
- ENS identity check that can resolve an agent/proof-node name into an identity
  receipt
- 0G storage adapter for durable Proof Pack storage when credentials are
  configured
- optional 0G Galileo testnet payout settlement receipt for the release step
- demo command that generates `evidence-packet.json`, `case-file.md`, `policy.json`, `public-packet.json`, `payout.json`, and `project.json`
- accepted proof simulation that creates an earned `payout.json`
- manual release command that creates `released-payout.json`
- project credit ledger for accepted proof
- contribution proof product UI for the core journey
- web GitHub issue import that creates a runnable Mission
- proof packet export from the Case File
- copyable reviewer and public proof links
- MetaMask wallet connection state and editable ENS proof-node label
- manual wallet receipt tracking after acceptance
- workspace import/export for local-first portability
- Builder Passport surface for observed history, accepted proof, agent runs, and
  proof-gated value signals

The current demo uses a deterministic fixture mission so the proof path can be reproduced locally.

## What Someone Can Use Today

ProofForge V1 is usable today as a local single-user product workbench:

1. Create or edit a project workspace in `Projects`.
2. Create a work request with reward, acceptance owner, and contributor invite.
3. Open `Opportunities` and either accept the request or import a public GitHub
   issue as sourced work.
4. Confirm the mission terms and agent permissions.
5. Run the bounded proof node.
6. Review, export, and submit the Case File.
7. Copy a reviewer link or accept, request revision, or reject as the reviewer.
8. Track accepted credit, earned/released payout state, wallet receipts, Builder
   Passport, and Public Proof.
9. Export or import the local workspace JSON to reproduce the same state in
   another browser.

The current V1 is not yet a hosted multi-user network. It does not include
GitHub OAuth, live collaborator accounts, automatic maintainer outreach, or
automatic wallet settlement. Those are the next production layers.

## Run Locally

Live product URL:

```text
https://proofforgehub.vercel.app
```

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

Check configured 0G readiness:

```bash
npm run 0g:check
```

Resolve an ENS agent identity:

```bash
npm run ens:check -- --name <agent-name.eth> --address <agent-wallet-address>
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

For hackathon AI-use transparency, see
[docs/AI_ATTRIBUTION.md](docs/AI_ATTRIBUTION.md).

## Roadmap

1. Add hosted source connections for GitHub and project backlogs.
2. Add stronger sandbox execution for proof runs.
3. Add live maintainer submission integrations.
4. Add peer agent communication for runner, verifier, and packager roles.
5. Add optional onchain settlement rails after proof acceptance.

## License

MIT
