# ProofForge Value And Ownership Model

Use this with [`LIFECYCLE_MAP.md`](./LIFECYCLE_MAP.md),
[`JOURNEYS.md`](./JOURNEYS.md), [`ACCEPTANCE_MATRIX.md`](./ACCEPTANCE_MATRIX.md), and
[`ETHEREUM_WEB3_BOUNTY_INTEGRATION.md`](./ETHEREUM_WEB3_BOUNTY_INTEGRATION.md). This document answers:

```text
What am I getting paid for?
Who pays or accepts it?
How do I collect?
What does my agent earn?
What does credit mean?
Do I own anything?
Where is distribution managed?
```

## Product Position

ProofForge is a proof economy for useful project work.

People and agents do not earn because they clicked a task. They earn when a human accepts useful evidence.

```text
Accepted proof is the value event.
```

Before accepted proof:

- the work is pending
- payout is not earned
- public proof is not created
- credit is not final

After accepted proof:

- the contributor or node owner receives a credit record
- an earned payout may be created
- project benefits may unlock
- public-safe proof may be shown
- release remains separate

## Value Types

ProofForge must distinguish these clearly.

| Type            | Meaning                                                              | Created by                         | MVP status                        |
| --------------- | -------------------------------------------------------------------- | ---------------------------------- | --------------------------------- |
| Credit          | Portable contribution record tied to accepted proof                  | Accepted packet                    | Live local model                  |
| Reputation      | Points or level based on accepted proof history                      | Accepted packet                    | Live local model                  |
| Benefit         | Access, badge, eligibility, role, or usage right                     | Project rules after accepted proof | Modeled locally                   |
| Earned payout   | Accounting record that says accepted proof created payable value     | Maintainer acceptance              | Live local model                  |
| Released payout | Payout marked paid/released/manual settlement complete               | Steward/sponsor release action     | Live local model                  |
| Public proof    | Public-safe record of accepted proof                                 | Accepted packet plus redaction     | Live local model                  |
| Ownership       | Legal/economic ownership in project, revenue, IP, or tokenized asset | Explicit project agreement         | Not MVP unless separately defined |

## What Credit Means

Credit is not automatically equity.

Credit means:

- this person or node produced accepted proof
- the project accepted that proof
- the contribution is recorded in the project ledger
- the contributor may unlock benefits, eligibility, access, status, or reputation

Credit can be used for:

- contributor profile
- project proof ledger
- public proof page
- eligibility for better missions
- reviewer or steward role unlocks
- access to project outputs where project rules allow it
- future distribution formulas
- maintenance and reliability history

Future credit should be role-aware. Useful work can include:

- problem discovery
- requester context
- sponsor/funding
- specification
- AI operation
- implementation
- runner/node execution
- verification
- review
- testing
- validation
- maintenance
- adoption evidence

Credit must not imply:

- automatic payment
- ownership of the project
- ownership of IP
- revenue share
- governance rights
- token value

unless the project defines those terms explicitly.

## Benefits

Benefits are project-defined unlocks attached to accepted proof.

Examples:

- contributor badge
- reviewer eligibility
- early product access
- usage credits
- private project access
- featured contributor status
- paid contributor pipeline
- steward eligibility
- sponsor-funded bonus
- NFT or soulbound proof badge

MVP framing:

```text
Benefit = project-defined access or status unlocked by accepted proof.
```

NFT framing, if shown:

```text
Proof badge = public receipt of accepted contribution.
It is not equity, revenue share, or guaranteed payment unless project terms explicitly say so.
```

## Payout Model

Payment has four stages.

```text
Pledged or reward path visible
-> accepted proof
-> earned payout record
-> released payout
```

### Pledged / Reward Path

Shown before the work runs.

Must answer:

- amount or non-cash value
- type: cash, external, credit, reputation, benefit, none
- funder or sponsor
- acceptance owner
- release method
- whether ProofForge controls the funds

### Earned Payout

Created only after accepted proof.

Means:

```text
The work was accepted and a payable/accounting record exists.
```

Does not mean:

```text
Money has moved.
```

### Released Payout

Means:

```text
The steward/sponsor marked the payout paid, released, or settled.
```

MVP release is manual accounting.

### External Payout

Means:

```text
Payment happens outside ProofForge.
ProofForge tracks the status and receipt, but does not move funds.
```

## Collection And Wallets

MVP:

- payout method can be shown as not connected, manual, external platform, credits, or reputation-only
- wallet address can be stored as a payout recipient or external receipt match target
- chain, token, transaction hash, or receipt URL can be attached to a released payout as a reference
- release is manual
- no automatic transfer
- no custody
- no wallet-required claim

Future wallet flow:

```text
Payout Settings
-> choose method: manual, external platform, wallet, credits, reputation-only
-> connect wallet or external account
-> set default recipient
-> project verifies method if needed
-> release records transaction or receipt
```

Wallet view must show:

- wallet address or external account
- supported networks or method
- default payout preference
- project-specific overrides
- tax/receipt/export note if relevant
- release history

Guardrail:

```text
Do not require a wallet to understand ProofForge.
Do not imply wallet settlement unless implemented.
Do not treat an onchain payment as proof unless it is linked to accepted proof.
```

## Agent And Node Compensation

MVP:

```text
Agents do not get paid directly.
Accepted proof credits the contributor or node owner responsible for the agent/node.
```

Why:

- the legal/payment recipient is a human, organization, wallet, or account
- the agent is a capability, not a legal counterparty in the MVP
- the proof packet still records which agent/node produced the work

Future:

Project value rules can split value across:

- contributor
- agent operator
- node owner
- verifier
- packager
- project treasury
- sponsor
- maintainer/reviewer if project rules allow it

Agent compensation UI should say:

```text
This agent produced accepted proof for Alex.
Credit recipient: Alex
Agent/node: docs-runner-01
```

not:

```text
The agent got paid.
```

unless a future legal/payment model exists.

## Value Distribution Rules

Every mission should have distribution terms before it runs.

Required fields:

| Field            | Meaning                                                     |
| ---------------- | ----------------------------------------------------------- |
| valueType        | cash, external, credit, reputation, benefit, none           |
| amount           | numeric amount when applicable                              |
| currency         | USD, credits, points, token, or project-defined unit        |
| funder           | sponsor, project, external buyer, foundation, none          |
| acceptanceOwner  | who can accept proof                                        |
| recipient        | contributor, node owner, project, split rule                |
| releaseMethod    | manual, external platform, wallet, credits, reputation-only |
| benefitRule      | badge, access, eligibility, role, usage right, none         |
| publicVisibility | public proof, project-only, private                         |
| ownershipTerms   | none, explicit license/access/right, custom agreement       |

Default MVP distribution:

```text
100% credit/payout record goes to the contributor or node owner.
Verifier and packager appear in coordination trace but do not receive separate distribution.
```

Future split example:

```text
70% contributor
20% node owner
10% verifier pool
benefit: reviewer eligibility after 3 accepted proofs
```

## Ownership

Ownership must be explicit.

Accepted proof can create:

- contribution credit
- access to project output
- usage benefit
- badge or NFT receipt
- payout record

Accepted proof does not automatically create:

- ownership of the project
- ownership of code/IP
- token rights
- revenue share
- governance rights

unless a project-specific agreement says so.

The UI must separate:

```text
Credit: you helped.
Benefit: you unlocked access/status.
Payout: you earned payable value.
Ownership: explicitly granted by project terms.
```

## Contract Model

There are three contract layers.

### 1. Mission Contract

Defines:

- objective
- required proof
- allowed actions
- blocked actions
- acceptance owner
- reward/benefit path
- human approval needs

This is already represented in code by `MissionContract`.

### 2. Value Distribution Terms

Defines:

- who receives credit
- who receives payout
- who receives benefits
- how release works
- what is public
- whether ownership exists

This is the missing model that should become a package or project field.

### 3. Project Terms

Defines:

- project purpose
- accepted contribution policy
- benefit ladder
- public proof policy
- payout methods
- ownership/IP language

MVP can model this as local project data and copy.

## Product Surfaces Needed

| Surface              | Job                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Mission Detail       | Show value terms before run: paid by whom, accepted by whom, what value type, who receives it |
| Agent / Node Setup   | Show who owns the node and receives credit by default                                         |
| My Work              | Track earned payouts, release state, credit, benefits, and revision blockers                  |
| Project Command Room | Show reward pool, value rules, proof ledger, benefits/unlocks                                 |
| Case File            | Show payout/credit impact if accepted and what gets shared                                    |
| Maintainer Review    | Show exact effect of accepting the packet                                                     |
| Payout Settings      | Future surface for wallet/external/manual payout preferences                                  |
| Public Proof         | Show accepted proof and public-safe credit/benefit, not private payout details                |

## MVP Acceptance

For the hackathon MVP, we can defend:

- accepted proof creates a credit record
- accepted proof creates an earned payout record when reward exists
- release is manual accounting
- external payout is tracked but paid outside ProofForge
- agent/node identity is recorded and credited to the owner
- benefits can be modeled as project-defined unlocks
- public proof shows accepted contribution

We cannot defend unless implemented:

- automatic wallet payment
- escrow
- token/NFT issuance
- legal ownership
- revenue share
- project equity
- pooled API-key spend
- agent as legal payment recipient

## UI Copy Rules

Use:

```text
Earned after acceptance.
Release is separate.
Credit recipient: Alex.
Benefit unlocked: reviewer eligibility.
External payout tracked outside ProofForge.
Proof badge records accepted contribution.
```

Avoid:

```text
You got paid.
The agent got paid.
You own part of this project.
Guaranteed earnings.
Instant payout.
NFT means ownership.
```

## Done Gate

Every mission, case file, and payout surface must answer:

1. What is being proven?
2. Who accepts it?
3. Who funds it?
4. What value type is created?
5. Who receives credit or payout?
6. How is release/collection handled?
7. Does this create ownership, access, or only credit?
8. What is public versus private?

If the UI cannot answer these, the product is underdefined.
