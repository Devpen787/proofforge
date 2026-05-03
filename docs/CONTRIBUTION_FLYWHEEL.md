# ProofForge Contribution Flywheel

Use this with [`OPERATING_GUIDE.md`](./OPERATING_GUIDE.md),
[`CONTRIBUTION_GRAPH.md`](./CONTRIBUTION_GRAPH.md), and
[`PRODUCT_STORYBOARD.md`](./PRODUCT_STORYBOARD.md). This document defines the circular product loop:

```text
Connect sources
-> observe contribution history
-> track projects
-> find useful work
-> prove work with humans and agents
-> accepted proof creates credit/value
-> project and builder graphs grow
-> better recommendations and opportunities
```

ProofForge should feel like a place where a builder sees the projects they are part of, the work they or their agents contributed, what was accepted, what value followed, and where to contribute next.

## Core Flywheel

```text
1. Connect identity and sources
2. Build a personal contribution graph
3. Track project buckets and project growth
4. Match the user or their agent to useful opportunities
5. Generate a Proof Pack
6. Maintainer accepts or rejects proof
7. Accepted proof updates credit, payout, benefits, and public proof
8. Better history improves recommendations, trust, and project participation
```

The loop should be circular, not a one-time demo path.

## Multiple Entryways, One System

Users can enter ProofForge from different starting points.

| Entryway                            | What ProofForge creates first        | Primary next action                         |
| ----------------------------------- | ------------------------------------ | ------------------------------------------- |
| Connect GitHub account              | observed contribution history        | track projects or import open opportunities |
| Paste GitHub issue                  | source-backed Work Lead              | qualify or convert to mission               |
| Connect wallet                      | identity/payment/proof badge signal  | link payout and onchain activity            |
| Join a project                      | project membership and project graph | view open opportunities                     |
| Register local agent/node           | agent identity and capability        | attach to project or run mission            |
| Import marketplace task             | external Work Lead                   | qualify owner, proof, and payout path       |
| Project steward creates project     | project bucket and value rules       | connect sources and define opportunities    |
| User contributes outside ProofForge | observed contribution                | attach proof/acceptance if available        |

Different entryways should still normalize into:

```text
Project
-> Source / Work Lead
-> Mission or observed contribution
-> Proof / Acceptance
-> Credit / Value / Public record
```

## GitHub Contribution Import

GitHub is the most important first connector because it can show both past contribution and new work.

ProofForge should eventually import:

- repositories contributed to
- pull requests opened or merged
- issues created or commented on
- commits where available
- review activity where available
- project/repository metadata
- labels and issue types
- links to accepted work

Imported GitHub activity starts as `Observed`, not automatically accepted ProofForge credit.

```text
GitHub activity
-> observed contribution
-> attach to project bucket
-> verify acceptance signal if possible
-> create ProofForge credit only when accepted proof/acceptance is established
```

This lets a user ask:

```text
What have I contributed to Ethereum, Polkadot, or another open-source project?
Was it merged, accepted, reviewed, or still pending?
Did it create payment, credit, access, or public proof?
What related work can I or my agent do next?
```

## Onchain And External Value Signals

ProofForge should treat onchain records as value or identity signals, not as automatic proof by themselves.

Possible onchain signals:

- treasury payment to a contributor
- grant milestone payment
- bounty payout
- proof badge or contribution credential
- project membership or access token
- public funding proposal
- wallet identity linked to contributor

Rules:

- Onchain payment can support payout/release evidence.
- GitHub or project artifacts can support work evidence.
- Maintainer/project acceptance connects the two.
- Wallet activity does not automatically prove useful work.
- GitHub activity does not automatically prove payout.

The product should connect these records:

```text
GitHub contribution / Proof Pack
+ maintainer acceptance
+ onchain or external payment/receipt
= stronger contribution record
```

MVP should model this carefully. Do not claim live onchain verification until implemented.

## Project Tracking

A tracked project should show:

- source links: GitHub, docs, treasury, marketplace, website
- user's observed contributions
- user's accepted proof
- user's earned/released payout state
- agent/node work connected to the project
- project open opportunities
- project accepted Proof Packs
- project growth signals
- contributor graph
- benefits and access unlocked

Project growth signals may include:

- open issues or open opportunities
- merged work
- accepted proof count
- active contributors
- active agents/nodes
- project pool or funding state
- public proof history
- recent releases or milestones
- onchain payment/funding activity where available

The user should feel:

```text
I am part of this project.
I can see what I did.
I can see how the project is moving.
I can see what my agent contributed.
I can see what I earned or unlocked.
I can see what to do next.
```

## Attribution Model

ProofForge must support several contribution patterns.

| Pattern                         | Attribution rule                                                    |
| ------------------------------- | ------------------------------------------------------------------- |
| User contributes directly       | credit attaches to user identity and source/project                 |
| User uses unregistered agent    | credit still attaches to user; agent may be noted as tool-assisted  |
| User registers local agent/node | credit attaches to owner and agent/node run history                 |
| Project-owned agent contributes | project value rules define contributor/project/agent split          |
| Verifier/packager contributes   | future rules may credit verification and packaging separately       |
| External marketplace accepts    | credit attaches to user/project; payout tracked as external         |
| Onchain payment exists          | payment record attaches to contributor/wallet after matching source |

Default MVP:

```text
Human owner receives credit.
Agent/node is recorded as a capability used by that owner.
Splits require explicit project rules.
```

## Social Contribution Graph

If many users connect sources, ProofForge can show:

- who contributed to the same project
- which projects share contributors
- which agents/nodes helped which projects
- which contributors have accepted proof in a specialty
- which projects have active proof economies
- which accepted proofs are public-safe

This should not become a social feed first. It should support trust and discovery:

```text
Who has actually contributed useful accepted work here?
What projects are active?
Where do my skills or agents fit next?
```

## Flywheel Screens

| Screen            | Flywheel job                                                      |
| ----------------- | ----------------------------------------------------------------- |
| Home              | show next best action from connected history and active work      |
| Connect Sources   | connect GitHub, wallet, project, marketplace, or paste source     |
| Projects          | show tracked project buckets and project growth                   |
| Project Detail    | show user's role, open opportunities, accepted proof, value rules |
| Opportunities     | show source-backed work matched to user/agent/project             |
| Mission Detail    | show mission terms before work starts                             |
| Runner            | produce evidence safely                                           |
| Proof Pack        | package evidence for review                                       |
| Maintainer Review | turn proof into accepted/rejected/revision state                  |
| My Work           | track personal/project contribution states and value              |
| Proof Ledger      | audit accepted proof and value records                            |
| Public Proof      | share public-safe proof                                           |
| Builder Passport  | show cross-source accepted contribution and agent/node history    |

## Dead-End Checks

The flywheel fails if:

- source import does not feel real
- past contribution is hidden or ignored
- projects do not show user relationship and growth
- accepted proof does not update My Work
- payout/credit/benefit state is unclear
- agent contribution cannot be attributed to an owner
- public proof appears before acceptance/redaction
- users cannot find the next useful project opportunity

Any implementation pass should check these before adding more screens.

## Adjacent Ideas: Adopt, Park, Avoid

External feedback keeps pointing at related ideas: persistent agent workspaces, credit pooling, topic markets, GitHub/onchain tracking, and agent-native identity. These are useful, but they should not all enter the MVP at the same time.

### Adopt Now

These strengthen the current ProofForge story:

| Idea                             | How it fits ProofForge                                                    |
| -------------------------------- | ------------------------------------------------------------------------- |
| GitHub-first contribution import | lets a user see past work, open work, accepted PRs/issues, and projects   |
| Wallet/onchain signal tracking   | connects payout, badge, treasury, or credential records to accepted proof |
| Project growth dashboard         | shows how projects develop and where the user contributed                 |
| Personal contribution graph      | makes My Work and Builder Passport useful even without payout             |
| Agent identity and owner rollup  | shows whether work came from the user, registered agent, or local tooling |
| Project-level value rules        | keeps payout, credit, benefits, and ownership explicit                    |

### Park For Later

These are promising but can distract from the defensible proof path:

| Idea                       | Why park it                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| Credit pooling             | requires spending controls, key safety, billing, and trust UX           |
| Topic markets              | adds prediction-market complexity before proof/value loop is proven     |
| Dividends/revenue share    | requires legal/project terms and distribution rules                     |
| Autonomous agent companies | shifts focus from accepted contribution tracking to agent orchestration |
| Multi-framework fork plan  | Clawith/HiClaw can inspire architecture, but MVP should stay focused    |

### Avoid In MVP

These would overclaim the product:

```text
instant payout
automatic ownership
unverified dividends
raw API key pooling
agent autonomy without human approval
public proof before acceptance/redaction
prediction markets as the main product
```

## Ethereum-Native Extension Path

Ethereum-native features should support the proof flywheel, not replace it.

For the precise V1/V2/V3 Ethereum, wallet, onchain receipt, and bounty boundaries, use
[`ETHEREUM_WEB3_BOUNTY_INTEGRATION.md`](./ETHEREUM_WEB3_BOUNTY_INTEGRATION.md).

Good Ethereum fit:

```text
wallet identity
onchain payout or treasury records
agent identity/reputation standards
public proof badge or credential
project funding history
accepted contribution receipts
```

Product rule:

```text
GitHub/source records show what was produced.
Maintainer/project acceptance shows what was accepted.
Onchain records can show what was paid, funded, credentialed, or owned.
ProofForge connects those signals into one contribution graph.
```

For the hackathon, the Ethereum story should be:

```text
ProofForge can become the layer where Ethereum builders connect GitHub, wallet, agents, and project work to see accepted contribution and value history.
```

Not:

```text
ProofForge is already an autonomous credit-pooling prediction market.
```

## Clawith Fork Option

Clawith is a credible future acceleration path because it already has several primitives that overlap with the broader ProofForge flywheel:

- persistent agent identities and workspaces
- Plaza-style agent/human feed
- role-based organizational controls
- usage quotas
- webhook-style triggers
- React + FastAPI application structure

Use it as inspiration or a possible post-MVP fork path, not as an automatic replacement for the current ProofForge prototype.

### What To Reuse Conceptually

| Clawith primitive         | ProofForge fit                                                |
| ------------------------- | ------------------------------------------------------------- |
| Persistent agent identity | registered proof nodes and owner rollup                       |
| Plaza feed                | future project activity feed, not default proof review UI     |
| Webhook triggers          | GitHub PR/issue updates, treasury events, external task state |
| Usage quotas and RBAC     | agent limits, permissions, project roles                      |
| Agent workspace memory    | project context and run history                               |

### Why Not Blindly Fork Now

The current hackathon path needs a tight proof loop:

```text
GitHub source
-> Work Lead
-> Mission
-> local safe run
-> Proof Pack
-> maintainer acceptance
-> credit/payout state
```

Forking a full agent-company product risks making the demo about agent workspace infrastructure instead of accepted proof and contribution tracking.

### Copy-Paste Diff Risks

External fork diffs must be verified against the actual repository before use.

Risk checks:

- repository version and branch must be confirmed
- file paths must exist in the target branch
- auth/user IDs must map GitHub users to ProofForge users, not raw GitHub IDs
- GitHub webhook signatures must be verified with raw request body, not mutated JSON
- PR events must handle `closed` + `merged=true`; `opened` is not a merged contribution
- database style must match the target app, including migrations and async/sync sessions
- treasury code must avoid hardcoded addresses and custody claims
- onchain payouts must be linked to accepted proof, not treated as proof by themselves
- Plaza/feed notifications should be secondary to My Work, Proof Ledger, and Project Detail

### Decision Rule

Use Clawith when it clearly reduces build time for:

```text
agent identity
project activity feed
webhook-driven updates
usage limits
multi-agent coordination
```

Do not use it if it makes us compromise:

```text
source qualification
proof before payout
maintainer acceptance
credit/value distinction
public/private proof boundaries
```
