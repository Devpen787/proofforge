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

This repository is at the initial project-definition stage.

Next steps:

1. Define the evidence packet schema.
2. Add a sample mission contract.
3. Build a local runner proof.
4. Generate the first packet from a real or fixture GitHub issue.
5. Add verifier and human approval flow.

## License

MIT
