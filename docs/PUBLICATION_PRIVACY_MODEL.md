# Publication Privacy Model

Use this with [`SOURCE_MARKETPLACE_OPERATING_MODEL.md`](./SOURCE_MARKETPLACE_OPERATING_MODEL.md),
[`WORK_SOURCE_QUALIFICATION.md`](./WORK_SOURCE_QUALIFICATION.md), and
[`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md).

## Rule

ProofForge is private by default.

Accepted work can create private credit, payout, reputation, and contribution
history. It does not automatically create a public account profile, income page,
or full agent-work history.

```text
private workspace
-> accepted proof
-> optional scoped publication
-> public-safe proof receipt
```

## Why This Matters

ProofForge helps people and agents work across public repos, marketplaces,
bounties, and project backlogs. Some outputs are naturally public, such as a
GitHub PR. The full ProofForge workspace is different: it can include failed
runs, bids, payouts, wallet references, private projects, source scans, and
agent history.

Those should not become public just because one proof was accepted.

## Visibility Levels

| Level         | Meaning                                              | Examples                                                      |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| Private       | Visible only in the user's workspace                 | drafts, failed runs, bids, payout totals, wallet details      |
| Reviewer link | Shared only with a maintainer/steward for a decision | packet summary, verifier result, redacted artifacts           |
| Public proof  | Explicitly published public-safe receipt             | source, mission, accepted status, hashes, public storage refs |

## Public Proof Can Include

- source URL
- mission title
- what was proven
- verifier status
- accepted/reviewed state
- public-safe artifact labels and hashes
- public storage reference if it is not local/private
- optional project credit points

## Public Proof Must Not Include By Default

- full account/profile history
- all attempted work
- failed missions
- marketplace bids
- private projects
- wallet balances
- payout totals
- payout transaction hashes
- ENS or wallet identity
- raw logs
- local filesystem paths
- secrets or private environment data

## Identity Modes

Public proof should default to a neutral label, not wallet or ENS.

| Mode             | Example                  | Default                |
| ---------------- | ------------------------ | ---------------------- |
| Public label     | `ProofForge Builder`     | yes                    |
| GitHub identity  | `Devpen787`              | optional               |
| ENS identity     | `proofrunner.jevpen.eth` | optional               |
| Wallet address   | `0x8BB...D141`           | optional and explicit  |
| Local proof node | `docs-runner-01`         | reviewer/internal only |

## Product Gates

1. A packet cannot become public if privacy review fails.
2. Accepted proof remains private until the user publishes it.
3. My Work and Builder Passport are private account surfaces by default.
4. Public Proof is a scoped receipt, not a public profile.
5. Payout and wallet fields stay hidden unless an explicit later product
   control makes them public.

## OpenResearchh Lesson Applied

OpenResearchh presents a sharp public primitive: projects, miners, benchmarks,
validators, and scores. ProofForge should apply the same discipline to its own
primitive: source, mission, proof pack, verifier, acceptance, and public-safe
receipt.

The public artifact should prove one thing well. It should not reveal the
operator's entire work history.
