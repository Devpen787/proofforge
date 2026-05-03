# ProofForge Contribution Graph

Use this with [`OPERATING_GUIDE.md`](./OPERATING_GUIDE.md),
[`WORK_SOURCE_QUALIFICATION.md`](./WORK_SOURCE_QUALIFICATION.md), and
[`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md). This document defines the bigger product idea:

```text
ProofForge is an umbrella for connected contribution, proof, credit, benefits, and payout across existing work networks.
```

ProofForge is not another GitHub. It does not replace code hosting, issue trackers, bounty markets, DAOs, or marketplaces. It connects to them, qualifies work, tracks what humans and their agents did, and records what got accepted or rewarded.

## Product Thesis

Developers already contribute across many places:

- GitHub repositories
- open-source issues and PRs
- ecosystem bounties
- foundation backlogs
- DAO treasuries
- marketplace tasks
- private team work
- agent-generated runs
- project communities

The problem is that contribution history, proof, payout, credit, and benefits are fragmented.

ProofForge should answer:

```text
What have I worked on?
What did my agents work on for me?
What was accepted?
What did I earn?
What credit or benefit did I unlock?
What is still maintained or stale?
What projects am I part of?
Where can I work next?
```

## Circular Contribution Flywheel

ProofForge should become more useful as more sources, users, agents, and projects connect.

```text
Connect source or identity
-> observe contribution history
-> attach work to project buckets
-> qualify open opportunities
-> prove work with human/agent execution
-> maintainer accepts proof
-> credit, payout, benefit, or public proof updates
-> project and builder graphs improve
-> better opportunity matching and trust
```

This means the product is not only a mission runner. It is a persistent contribution memory layer.

## The Umbrella Model

ProofForge connects sources and turns them into one personal and project-level contribution graph.

```text
GitHub
Marketplace
Foundation backlog
DAO treasury
Private project
User-created project
Agent/node runs
        |
        v
ProofForge Work Source
        |
        v
Work Lead / Mission / Proof Packet
        |
        v
Accepted Proof / Credit / Payout / Benefit
        |
        v
Contributor Graph + Project Graph
```

## Core User Promise

For a contributor:

```text
Connect your work sources.
See projects and opportunities you can contribute to.
Let your agent or node help safely.
Track proof, acceptance, credit, benefits, and payout in one place.
```

For a project steward:

```text
Create or connect a project.
See all work, contributors, agents, accepted proof, benefits, and payouts around it.
```

For a maintainer or sponsor:

```text
See what was actually proven and who should receive credit, benefits, or payout.
```

## Connected Accounts And Sources

Potential connectors:

| Connector            | What it imports                                                   | What it helps prove                                  |
| -------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| GitHub               | repos, issues, PRs, contribution history, comments, labels        | source of work, past contribution, acceptance signal |
| Wallet               | identity, payout address, proof badge ownership, onchain activity | collection method, badge/account link                |
| Bounty marketplace   | tasks, submissions, buyer acceptance, external payout state       | paid opportunity and external follow-up              |
| DAO treasury         | proposals, votes, funding, milestones, contributors               | funded work and project governance context           |
| Foundation backlog   | ecosystem requests, grants, milestones                            | project opportunity and sponsor context              |
| Local runner / agent | runs, artifacts, verifier trace, packet creation                  | evidence production                                  |

GitHub and onchain records should complement each other:

```text
GitHub shows what was produced.
Maintainer/project review shows what was accepted.
Onchain or external records may show what was paid, funded, or credentialed.
ProofForge links those signals into one project/contributor graph.
```

MVP priority:

```text
GitHub import
local agent/node identity
local runner/verifier
manual payout tracking
project proof ledger
```

Future priority:

```text
GitHub account connection
wallet connection
external bounty imports
DAO/foundation imports
proof badge issuance
verified payout receipts
```

## Contribution States

Not all contribution is accepted or paid. ProofForge should still track useful states.

| State     | Meaning                                        | Value                        |
| --------- | ---------------------------------------------- | ---------------------------- |
| Observed  | imported from connected source or user history | personal tracking            |
| Claimed   | user or agent intends to work on it            | work planning                |
| Running   | agent/node is producing evidence               | execution state              |
| Submitted | proof packet sent for review                   | pending value                |
| Accepted  | maintainer/project accepted proof              | credit and possible payout   |
| Revised   | more evidence requested                        | recoverable work             |
| Rejected  | proof not accepted                             | learning/history             |
| Earned    | accepted proof created payout/credit/benefit   | value record                 |
| Released  | payout or benefit marked released/available    | collection/access state      |
| Public    | accepted proof is shareable                    | reputation and proof history |

This lets ProofForge show:

```text
I contributed.
It was accepted.
It was not accepted.
It earned payout.
It earned credit only.
It unlocked a benefit.
It is public proof.
```

## Human And Agent Rollup

Agents are extensions of a contributor or organization in the MVP.

```text
Agent/node work rolls up to its owner.
```

A proof packet should show:

- human owner
- agent/node identity
- runner role
- verifier role
- packager role
- credit recipient
- payout recipient
- project
- source

Default MVP:

```text
Credit recipient = human or node owner.
Agent = capability used by that owner.
```

Future:

```text
Project rules may split credit or payout between contributor, node owner, verifier, packager, sponsor, or project treasury.
```

## Personal Contribution Graph

A user's ProofForge home should eventually show:

- connected accounts
- projects followed or joined
- open opportunities matched to them
- active work
- submitted proof
- accepted proof
- revision/rejection history
- earned payouts
- released payouts
- benefits unlocked
- public proof badges
- agent/node performance

The user should be able to ask:

```text
What have I contributed to Polkadot?
What have I contributed to Ethereum?
What did I get accepted for?
What did I earn?
What did my agent do?
What can I work on next?
```

Imported source activity starts as observed history, not final credit. ProofForge should distinguish:

```text
observed contribution
submitted proof
accepted proof
earned payout
released payout
public proof
```

## Project Contribution Graph

A project should show:

- source links: GitHub, treasury, foundation, marketplace, docs
- open work
- active contributors
- attached agents/nodes
- submitted proof
- accepted proof
- payout/benefit state
- contributor ledger
- public proof
- project benefits and access rules
- project growth signals
- user's relationship to the project
- onchain or external payment/funding signals where available

This is where ProofForge differs from a DAO treasury or GitHub repo:

```text
GitHub shows code and issues.
Treasuries show funding and votes.
ProofForge shows who did useful work, what proof was accepted, and what value followed.
```

The project view should answer:

```text
How is this project developing?
What did I contribute here?
What did my agent contribute here?
Who else contributed accepted proof?
What value, benefits, or payment followed?
What should I work on next?
```

## Credit And Benefits Across Sources

Credit is portable contribution memory.

It can come from:

- accepted GitHub-linked proof
- accepted marketplace proof
- accepted DAO/foundation milestone
- accepted private project proof
- accepted agent/node verification

Benefits can be source-specific:

- project access
- usage credits
- reviewer eligibility
- contributor badge
- private channel access
- future paid mission eligibility
- public proof badge

Rule:

```text
Every accepted contribution should produce at least one tracked value outcome: credit, reputation, benefit, payout, or public proof.
```

## Payment Across Sources

ProofForge should not pretend to control every payment source.

It should label payment origin:

| Origin               | Meaning                                                   |
| -------------------- | --------------------------------------------------------- |
| Project pool         | project/steward funds reward inside ProofForge accounting |
| External marketplace | buyer pays outside ProofForge; ProofForge tracks status   |
| DAO/foundation       | payout depends on external governance or funding process  |
| Private sponsor      | sponsor pays manually or externally                       |
| Credit-only          | accepted proof creates reputation/benefit, not cash       |
| Unknown              | cannot be advertised as paid                              |

Collection states:

```text
Not earned
Earned
Released
External pending
External confirmed
Disputed
Credit-only
Benefit unlocked
```

## What The MVP Should Show

For the hackathon prototype, the UI should imply this connected future without overclaiming.

MVP should show:

- a connected source concept through GitHub issue import
- a local proof node/agent identity
- project buckets
- open opportunities
- source-backed Work Leads
- safe mission run
- evidence packet
- maintainer acceptance
- earned/released payout accounting
- credit ledger
- public proof badge as modeled proof, not minted NFT

MVP should not claim:

- automatic wallet payout
- live NFT minting
- verified GitHub account history unless implemented
- marketplace payout integration unless implemented
- DAO treasury integration unless implemented
- legal ownership or revenue share

## Product Surfaces Implied

### Home

Job:

```text
Show connected contribution state and next best action.
```

Should show:

- connected source status
- proof node/agent status
- current work
- earned/released/credit state
- recommended project opportunity

### Projects

Job:

```text
Show project buckets and their contribution graph.
```

Should show:

- project purpose
- sources connected
- open opportunities
- active work
- contributors and agents
- accepted proof
- benefits
- value/payout state

### Opportunities

Job:

```text
Show source-backed work that can become accepted proof.
```

Should show:

- source
- project
- acceptance owner
- value path
- proofability
- missing info
- follow-up path

### My Work

Job:

```text
Track all personal and agent work across sources.
```

Should show:

- observed/claimed/running/submitted/accepted/revised/rejected work
- payout/credit/benefit state
- agent/node rollup
- next action

### Contribution Ledger

Job:

```text
Show accepted contribution history across projects and sources.
```

Should show:

- project
- source
- proof packet
- accepted by
- credit/benefit/payout
- public proof status
- maintenance status

## Maintenance State

AI makes creation cheaper than upkeep. ProofForge should not treat launch as the final value event.

Every durable proof or project ledger entry should eventually track:

- owner
- last verified date
- open risks
- dependency/security status where relevant
- funding state
- handoff or sunset plan

MVP rule:

```text
Show known limits and last verified date where the UI implies durable value.
```

## Design Implication

The app should not feel like a pile of tasks.

It should feel like:

```text
my connected contribution operating layer
```

Users should understand:

- where their work comes from
- where their agent helps
- what gets accepted
- what they earned or unlocked
- what projects they are building history with

## Done Gate

Before building or redesigning any screen, answer:

1. Which connected source does this screen relate to?
2. Is this user looking at personal work, project work, or public proof?
3. What contribution state is shown?
4. What value state is shown?
5. Does agent work roll up to the right human or organization?
6. Is this paid, credit-only, benefit-only, or unknown?
7. What is the next action?
8. What should remain hidden until accepted?

If the screen cannot answer these, it will drift back into a generic dashboard.
