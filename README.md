# ProofForge

> Open Agents Hackathon project: a protocol-agnostic proof guild for agent-assisted software work.

**ProofForge imports work from GitHub and bounty networks, then uses agents, runners, and human approval to turn it into verified evidence packets before anything reaches a maintainer.**

## 5-Second Version

AI agents make it cheap to generate code. ProofForge makes it possible to trust the work.

We help builders, agents, and spare machines work together on useful software tasks, prove what works, and earn credit only when the contribution holds up.

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

## Hackathon Scope

For this hackathon, we are starting with one narrow workflow:

> **GitHub bug reproduction -> independent verification -> maintainer-safe evidence packet.**

The first demo should prove that ProofForge can:

1. Import a GitHub issue.
2. Convert it into a small verifiable mission.
3. Run the mission in a local sandbox.
4. Capture commands, logs, environment, and result.
5. Ask a verifier agent to independently check the work.
6. Ask a human to approve before public submission.
7. Produce an evidence packet a maintainer can review quickly.

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

Open-source and protocol communities already coordinate around useful work, public goods, bounties, grants, and reputation.

ProofForge makes that pattern protocol-agnostic:

- GitHub keeps the canonical issue or PR.
- Existing bounty and grant networks keep their funding flows.
- ProofForge adds the verification layer.

The goal is to help people build shared software without drowning maintainers in low-quality AI output.

## How Sponsors Fit

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

These are later-stage integrations for accepted-work payout or settlement. The MVP does not lead with payments.

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

## Repository Hygiene

This repo is built in small, reviewable steps.

Every meaningful contribution should include:

- a small scope
- a clear definition of done
- evidence that it works
- tests or logs when applicable
- no unrelated changes

We are building ProofForge the same way ProofForge expects work to be done.

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
- proof command center UI for the core journey

The current demo uses a deterministic fixture mission first so judges can reproduce the proof path locally.

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

Useful local routes:

```text
http://localhost:5173/#opportunity
http://localhost:5173/#first-run
http://localhost:5173/#projects
http://localhost:5173/#work-queue
http://localhost:5173/#run
http://localhost:5173/#case-file
http://localhost:5173/#maintainer
http://localhost:5173/#scoreboard
http://localhost:5173/#public-proof
```

The current web prototype shows:

- Opportunity: the proof loop and ready work with acceptance owners.
- First Run: guided six-step activation from safe mission to runner.
- Projects: proof ledger, project backlog, and constrained agent delegations.
- Work Queue: source import categories, GitHub import command, Work Lead diagnosis, and clarification gate.
- Runner: local execution, packet output preview, security state, and human approval checkpoint.
- Case File: maintainer/private/public artifact split.
- Maintainer: decision support with confidence, risk, privacy, artifacts, and payout if accepted.
- Scoreboard: next action, payout state, reputation unlock, and recent activity.
- Public Proof: shareable accepted proof view with private details removed.

For the full hackathon recording flow, see [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

For a route-by-route product walkthrough, see [docs/VISUAL_WALKTHROUGH.md](docs/VISUAL_WALKTHROUGH.md).

For the final submission gate, see [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md).

For dependency audit status and current mitigations, see [docs/DEPENDENCY_AUDIT.md](docs/DEPENDENCY_AUDIT.md).

## Next Steps

1. Add a deployed demo URL.
2. Record the 2-4 minute hackathon demo video.
3. Add final demo screenshots or a short visual walkthrough.
4. Add Docker-backed sandbox execution.
5. Add live 0G upload instructions when credentials are available.

## License

MIT
