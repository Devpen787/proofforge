# ProofForge Product Journey Versions

Use this with [`PRODUCT_STORYBOARD.md`](./PRODUCT_STORYBOARD.md),
[`CONTRIBUTION_FLYWHEEL.md`](./CONTRIBUTION_FLYWHEEL.md), and
[`OPERATING_GUIDE.md`](./OPERATING_GUIDE.md).

This document separates the complete ProofForge vision into buildable versions.

## Full Product Journey

```text
Connect identity and sources
-> observe contribution history
-> track project buckets
-> qualify open work
-> accept mission terms
-> run human/agent work safely
-> generate Proof Pack
-> maintainer accepts or rejects
-> accepted proof creates credit/value state
-> project ledger and My Work update
-> public proof and Builder Passport grow
-> better recommendations and project participation
```

This is the circle we are building toward. Each version should close a real loop, not just add more screens.

## V1: ProofForge MVP / Hackathon Slice

### Promise

```text
Import real work, run it safely, package proof, get accepted, and track credit/payout state.
```

### Primary user

Contributor / agent owner, with a simulated maintainer review.

### Core path

```text
Home
-> Connect Source or use GitHub import
-> Agent Setup
-> Project Detail
-> Mission Detail
-> Runner
-> Proof Pack / Case File
-> Maintainer Review
-> My Work
-> Proof Ledger / Public Proof
```

### Must include

- GitHub issue import or paste URL creates source-backed Work Lead.
- Bounty, DAO proposal, grant, or marketplace links can be represented as source/value metadata, even when imported manually.
- Mission terms show sponsor/funder, reward asset, payout method, custody status, and acceptance owner when value is advertised.
- Work Lead converts only if project, source, acceptance owner, proof, risk, and value path are known.
- Local proof node identity with owner, permissions, limits, verifier path.
- Local sandboxed run.
- Evidence Packet / Proof Pack artifacts.
- Privacy and security review.
- Maintainer acceptance/revision/rejection.
- Accepted proof creates contribution credit.
- Accepted proof creates earned payout only when payout is defined.
- Released payout remains a separate manual/external tracking action.
- Optional wallet, chain, `txHash`, receipt URL, or external bounty reference can attach to value records as a reference.
- My Work shows active, submitted, accepted, earned, released, and rejected states.
- Project ledger shows accepted proof and value state.
- Public Proof is redacted and only appears after acceptance.

### Must not claim

- live broad marketplace imports
- automatic GitHub posting or PR creation
- automatic onchain settlement
- custody of funds
- automatic ownership
- token issuance or NFT proof badge issuance unless implemented
- live bounty marketplace sync unless implemented
- prediction markets
- raw API key pooling
- autonomous agent company behavior

### Done

A judge can complete:

```text
Import GitHub issue
-> qualify mission
-> run local agent
-> generate Proof Pack
-> accept as maintainer
-> see credit + earned payout state
-> view My Work and public-safe proof
```

### Why V1 Is Practical Today

V1 is useful even before the full network exists because contributors already use agents and GitHub today.

The current pain:

```text
I used an agent or local tooling to test/fix/reproduce something.
I have logs, screenshots, commits, or PRs.
The proof is scattered across terminal output, GitHub, chat, and memory.
Maintainers have to trust my summary or dig through noise.
If accepted, my credit/payment/history is fragmented.
```

V1 solves a narrow version:

```text
Take one real GitHub/source-backed task.
Run or document the agent-assisted work locally.
Package the evidence into a clean Proof Pack.
Let a maintainer/reviewer accept, revise, or reject it.
Record the accepted credit and payout state.
```

Practical users:

| User                   | Why V1 helps now                                                    |
| ---------------------- | ------------------------------------------------------------------- |
| Agent-assisted builder | turns local agent output into a maintainer-ready proof package      |
| OSS contributor        | tracks what they tested/reproduced and whether it was accepted      |
| Maintainer             | reviews evidence instead of raw agent chatter or vague claims       |
| Hackathon participant  | proves work from a GitHub issue with a reproducible local run       |
| Project steward        | starts a small project ledger for accepted proof without full infra |

V1 is not a full marketplace. It is a proof workbench and contribution record.

## Practical Architecture

The architecture should make the product buildable in slices.

```text
Web App
  Home / Projects / Opportunities / Mission Detail / Runner / Proof Pack / My Work

Domain Packages
  sources: import GitHub issue or source URL
  mission: Work Lead qualification and Mission Contract
  policy: allowed/blocked action checks
  runner: local sandbox/fixture execution
  verifier: independent evidence checks
  evidence: Evidence Packet / Proof Pack schema
  payments: earned/released payout records
  projects: project ledger, value rules, agent delegation
  storage: local adapter, future 0G/onchain/external references

Local Artifacts
  work-lead.json
  mission-contract.json
  runner-result.json
  verifier-result.json
  evidence-packet.json
  case-file.md
  payout.json
  project-ledger.json

Future Connectors
  GitHub OAuth/webhooks
  wallet/onchain payment and credential signals
  marketplace / DAO / foundation adapters
```

V1 can run without backend complexity:

```text
GitHub public issue import or pasted source
-> local JSON domain objects
-> local runner/verifier artifacts
-> local web UI state
-> local proof ledger
```

That is enough to demo the product truthfully while keeping V2/V3 possible.

## Ethereum / Web3 / Bounty Version Split

Use [`ETHEREUM_WEB3_BOUNTY_INTEGRATION.md`](./ETHEREUM_WEB3_BOUNTY_INTEGRATION.md)
as the detailed contract.

### V1: Visible Hook, No Custody

V1 uses Ethereum/Web3 and bounties as metadata and receipt references.

```text
GitHub issue / bounty URL / DAO proposal URL
-> Source Record
-> Mission value terms
-> accepted Proof Pack
-> credit + earned payout state
-> optional wallet or onchain receipt reference
```

V1 should show:

- wallet or payout recipient state
- bounty/source URL
- sponsor/funder
- reward amount and asset
- release method
- custody status: `external/manual`, not ProofForge escrow
- optional `chainId`, `txHash`, receipt URL, or external platform reference after release

V1 must say:

```text
ProofForge tracks value and receipts.
ProofForge does not move funds in the MVP.
```

### V2: Connected Signals

V2 connects the references:

- wallet connect
- wallet ownership check
- GitHub account import
- observed PR/issue/commit contribution history
- onchain receipt import by wallet or transaction hash
- project funding or treasury references
- matching accepted proof to external payout receipts
- proof badges or credentials only after acceptance

### V3: Network Settlement And Credentials

V3 can add real Web3 integrations after the proof/value loop is trusted:

- sponsor or project funding pools
- verified receipt graph
- optional escrow or settlement adapters
- DAO/foundation/grant/bounty adapters
- portable proof credentials or badges
- standards-based agent identity and reputation where implemented

V3 still does not allow payment, wallet, or token state to bypass proof, maintainer acceptance, redaction, and explicit project value rules.

## Cross-Version Architecture Schema

The architecture should grow by adding adapters and graph depth, not by replacing the V1 proof loop.

### V1 Architecture: Local Proof Loop

```text
Web App
-> Source Import
-> Work Lead / Mission Contract
-> Policy Gate
-> Local Runner
-> Verifier
-> Proof Pack
-> Maintainer Review
-> Project Ledger / My Work
-> Local Credit + Payout State
```

Storage:

```text
local JSON artifacts
local web state
local project ledger
```

Trust boundary:

```text
ProofForge does not post publicly, move funds, or claim custody.
```

### V2 Architecture: Contribution Graph

V2 adds connected identity, historical imports, and richer project tracking.

```text
V1 Proof Loop
+ GitHub Account Import
+ Wallet / Onchain Signal Adapter
+ Project Graph
+ Contributor Graph
+ Agent History
+ Builder Passport
+ Recommendation Engine
```

Storage:

```text
source snapshots
observed contribution records
accepted proof records
wallet/onchain references
project growth signals
agent run history
```

Trust boundary:

```text
Observed contribution is not accepted credit until matched with acceptance/proof.
Onchain payment is not proof of work unless linked to source and acceptance.
```

### V3 Architecture: Networked Proof Economy

V3 adds many projects, adapters, roles, funding flows, and public graph surfaces.

```text
V2 Contribution Graph
+ Auth and real membership
+ Role/RBAC layer
+ External marketplace adapters
+ DAO/foundation/treasury adapters
+ Sponsor/funding module
+ Agent/node profile registry
+ Notification system
+ Dispute and safety workflows
+ Public project pages
+ Verified receipts / credentials
+ Optional credit pooling or topic markets
```

Storage:

```text
database-backed project graph
event log
proof artifact storage
public proof references
payment/receipt references
agent and contributor reputation records
```

Trust boundary:

```text
Network features must preserve source qualification, proof before payout,
human acceptance, redaction, and explicit value rules.
```

### Architecture Growth Rule

```text
V1 proves the workflow.
V2 connects history and identity.
V3 scales across projects, funders, agents, and ecosystems.
```

Do not rewrite the core proof loop for V2 or V3. Extend it.

## Where Agents Fit

Agents are not the product headline in V1. They are capabilities that help produce proof.

### V1 Agent Model

```text
Human owner
-> local proof node / agent identity
-> allowed actions and limits
-> runner role
-> verifier role
-> packager role
-> Proof Pack
-> credit rolls up to owner
```

Agent use cases in V1:

| Agent role | What it does                               | What it cannot do by default           |
| ---------- | ------------------------------------------ | -------------------------------------- |
| Runner     | clone/load repo, run command, capture logs | post comments, open PRs, spend funds   |
| Verifier   | independently check artifacts and result   | approve its own work                   |
| Skeptic    | flag false positives, missing proof, risk  | override human decision                |
| Packager   | assemble case file and evidence packet     | publish public proof before acceptance |

The builder can also use an unregistered external agent outside ProofForge. In that case:

```text
User imports or attaches the resulting evidence.
ProofForge records it as user-owned, agent-assisted work.
Credit still rolls up to the user unless project rules say otherwise.
```

### V2 Agent Model

Agents get history:

```text
runs
accepted proof
failure/revision rate
specialties
project attachments
owner reputation
```

### V3 Agent Model

Agents can become network participants:

```text
profile
standardized identity
project permissions
cross-project reputation
coordinator/verifier/runner roles
possible value splits where project rules allow
```

But V3 agent autonomy never bypasses:

```text
human approval
mission terms
privacy/security review
maintainer acceptance
value rules
```

## V2: Contribution Graph And Project Tracking

### Promise

```text
Connect GitHub and wallet signals to see what you contributed across projects and what value followed.
```

### Primary user

Returning contributor / agent owner and project steward.

### Core path

```text
Connect GitHub account
-> import observed contribution history
-> attach contributions to project buckets
-> track project growth
-> match user/agent to open opportunities
-> accepted proof updates Builder Passport
```

### Adds

- GitHub account connection or richer import.
- Observed contribution history: PRs, issues, commits, reviews where available.
- Project buckets for Ethereum, Polkadot, OSS repos, marketplace projects, private projects.
- Project growth signals: accepted proof count, open opportunities, contributors, releases, funding signals.
- Builder Passport with accepted proof, observed work, specialties, project history.
- Onchain/external value signal tracking:
  - wallet identity
  - payment receipts
  - treasury/grant/bounty signals
  - proof badge or credential references
- My Work becomes the long-term personal tracker.
- Better opportunity matching from history and agent specialties.

### Still not

- automatic credit for every GitHub contribution
- custody or automatic payment
- revenue share/dividends unless explicit project terms exist
- public proof without acceptance/redaction

### Done

A user can connect/import contribution history and answer:

```text
What projects have I touched?
What was accepted?
What did my agent do?
What value or public proof followed?
What can I work on next?
```

### V2 Completion Boundary

The local V2 implementation now covers the full product shape without claiming
production integrations that require deployed credentials:

- GitHub connection references can store OAuth and webhook configuration state.
- Wallet identity and onchain receipts are read-only value signals.
- Contribution graph snapshots can persist through local JSON storage.
- Marketplace and hackathon imports can be tracked as adapter snapshots.
- Project membership, roles, and permissions are represented in the project
  model.
- Credential and badge references are proof-gated and can only attach after an
  accepted Proof Pack.

Production OAuth apps, hosted webhooks, live wallet signature checks, and
external marketplace write APIs remain deployment/configuration work. They
should plug into these V2 contracts rather than bypassing the proof graph.

### First V2 Implementation Slice

The first V2 upgrade should be additive to the V1 proof loop:

- keep `Project -> Work Lead -> Mission -> Proof Pack -> Acceptance` as the
  trusted path
- add a contribution graph over the top of the existing project ledger
- import GitHub account activity as `observed`, not accepted credit
- link observed work to accepted Proof Packs only after maintainer acceptance
- attach wallet, receipt, bounty, grant, and credential records as value
  signals, not as proof by themselves
- roll agent runs up to the owner and preserve specialties, failure/revision
  state, and project attachments
- expose this as Builder Passport: observed work, accepted proof, linked value
  signals, project history, agent history, and next recommended missions
- upgrade hackathon prize/bounty imports into proof readiness checklists:
  repository proof, demo proof, protocol-use proof, deployment references,
  sponsor-requested feedback files, agent framework proof, architecture notes,
  and sponsor acceptance

The first user-facing V2 surface is deliberately small. It should answer:

```text
What did ProofForge observe?
What was accepted?
What value or receipt was linked after acceptance?
What did my agent do for me?
Which bounty or prize requirements still need evidence?
Where should I contribute next?
```

Do not add settlement, escrow, marketplace sync, badge issuance, or autonomous
agent participation as V2 defaults. Those remain V3 unless implemented and
verified.

Current local commands:

```bash
npm run import:github-history -- --login <github-login>
npm run import:ethglobal -- --event "Open Agents"
```

This writes observed GitHub issues and pull requests under `demo-output/imports`.
The imported records are graph inputs only. They do not create credit, payout,
public proof, or maintainer acceptance by themselves.

ETHGlobal prize imports produce source-backed work leads with submission
requirements. V2 classifies sponsor wording into concrete evidence fields, but
still does not submit projects, claim sponsor acceptance, or represent prize
payment.

## V3: Network And Agent Economy Layer

### Promise

```text
ProofForge becomes a network where contributors, agents, projects, sponsors, and public proof compound across ecosystems.
```

### Primary user

Contributor, agent owner, project steward, maintainer, sponsor/funder, public viewer.

### Adds

- Real project membership and role permissions.
- Rich agent/node profiles with reputation, history, project attachments, and possibly standards-based agent identity.
- External marketplace and bounty adapters.
- Foundation/DAO/treasury adapters.
- Verified wallet/onchain payment receipts.
- Proof badges or credentials.
- Sponsor/funding workflow:
  - project pool
  - funded missions
  - earned/released payouts
  - exports/receipts
- Notifications and return journeys.
- Abuse/trust/safety workflows:
  - spam source handling
  - duplicate packet prevention
  - disputes
  - secret leak response
  - accepted proof reversal policy
- Optional future workspace/feed layer inspired by tools like Clawith/HiClaw.
- Optional future credit pooling or topic markets only after proof/value loop is proven.

### Still guarded

- credit pooling requires spending controls and safe key handling
- topic markets require separate legal/product design
- dividends/revenue share require explicit project agreements
- agent autonomy never bypasses human approval for public action, spend, or submission

### Done

The product can support a real project ecosystem:

```text
Projects publish useful work.
Contributors and agents produce proof.
Maintainers accept proof.
Sponsors fund accepted work.
Builders accumulate portable proof history.
Projects grow visibly from accepted contributions.
```

## Version Split Summary

| Area                   | V1 MVP                       | V2 Contribution Graph             | V3 Network Layer                        |
| ---------------------- | ---------------------------- | --------------------------------- | --------------------------------------- |
| Source                 | GitHub issue / paste URL     | GitHub account + observed history | many adapters                           |
| Agent                  | local proof node             | agent history and specialties     | agent profiles, coordination, standards |
| Project                | demo project bucket          | tracked projects and growth       | real membership, funding, public pages  |
| Proof                  | Evidence Packet / Proof Pack | project and user proof ledger     | portable credentials and public graph   |
| Value                  | local credit + payout state  | wallet/onchain/external signals   | sponsor pools and verified receipts     |
| Public proof           | redacted accepted proof      | Builder Passport                  | ecosystem-wide reputation               |
| Markets/credit pooling | not included                 | research only                     | optional after proof loop is trusted    |

## Build Rule

Do not pull a V2 or V3 feature into V1 unless it makes the V1 proof loop clearer.

The V1 demo wins by being narrow and real:

```text
real source
safe run
reviewable proof
human acceptance
visible credit/value state
```

## Journey Extension Map

V1, V2, and V3 are not separate products. They are nested versions of the same journey.

### V1 Journey: First Accepted Proof

```text
User opens Home
-> sees one safest mission from a real source
-> confirms source/project/agent readiness
-> reviews Mission Contract
-> runs local proof node
-> receives Proof Pack
-> submits to maintainer review
-> maintainer accepts
-> My Work shows accepted proof
-> Proof Ledger shows credit and earned payout state
-> Public Proof can be viewed after redaction
```

What the user feels:

```text
I found useful work.
My agent ran safely.
The proof was accepted.
I can see what I earned or credited.
```

### V2 Extension: Contribution Memory

V2 starts from the V1 outcome and expands backwards and sideways.

```text
User connects GitHub account
-> ProofForge imports observed contribution history
-> contributions attach to project buckets
-> user sees past accepted/pending/rejected work
-> wallet/onchain records attach as value signals where available
-> Builder Passport shows cross-source contribution history
-> recommendations improve from history and agent specialties
-> user returns to Projects or Opportunities for the next mission
```

What the user feels:

```text
I can see the projects I have helped.
I can see what was accepted.
I can see where payment, credit, or benefits followed.
I know where I should contribute next.
```

### V3 Extension: Networked Proof Economy

V3 starts from many V2 users and projects.

```text
Projects publish more opportunities
-> sponsors or treasuries fund work
-> contributors and agents build proof histories
-> maintainers accept/reject proof at scale
-> verified receipts, badges, and public proof spread
-> agent/node profiles develop reputation
-> external adapters bring in marketplace, DAO, foundation, and private work
-> the network recommends trusted contributors, agents, and missions
```

What the ecosystem feels:

```text
Useful work is visible.
Accepted contribution is portable.
Projects can reward proof.
Agents help without bypassing human trust.
```

### Extension Rule

Each version should preserve the previous version's core promise:

```text
V1 proves one accepted contribution.
V2 remembers and connects many contributions.
V3 coordinates many contributors, agents, projects, and value sources.
```
