# ProofForge Operating Guide

This is the source-of-truth guide for building the hackathon prototype. Follow this before older planning notes in `docs/reference/`.

For the compact master journey, architecture, Web3/bounty hook, dependencies, and build order, start with
[`PRODUCT_BLUEPRINT.md`](./PRODUCT_BLUEPRINT.md).

For detailed personas, journeys, edge cases, and UX review gates, use
[`JOURNEYS.md`](./JOURNEYS.md) with this guide.

For the screen-by-screen target before coding UI changes, use
[`PRODUCT_STORYBOARD.md`](./PRODUCT_STORYBOARD.md). Treat it as the product mock
in text form.

For object state transitions and slice-level acceptance criteria, use
[`LIFECYCLE_MAP.md`](./LIFECYCLE_MAP.md) and
[`ACCEPTANCE_MATRIX.md`](./ACCEPTANCE_MATRIX.md).

For payout, credit, benefits, ownership, and work-source qualification, use
[`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md) and
[`WORK_SOURCE_QUALIFICATION.md`](./WORK_SOURCE_QUALIFICATION.md).

For the umbrella model across GitHub, bounties, marketplaces, wallets, projects, and agents, use
[`CONTRIBUTION_GRAPH.md`](./CONTRIBUTION_GRAPH.md).

For the circular product loop across connected sources, project tracking, proof, accepted value, and better recommendations, use
[`CONTRIBUTION_FLYWHEEL.md`](./CONTRIBUTION_FLYWHEEL.md).

For Ethereum, wallet, onchain receipt, bounty source, and V1/V2/V3 Web3 boundaries, use
[`ETHEREUM_WEB3_BOUNTY_INTEGRATION.md`](./ETHEREUM_WEB3_BOUNTY_INTEGRATION.md).

For the completed ETHGlobal/GitHub prior-art, bounty mechanics, and Ethereum MCP discovery results, use
[`reference/GITHUB_MCP_DISCOVERY_RESULTS.md`](./reference/GITHUB_MCP_DISCOVERY_RESULTS.md).

For what belongs in V1, V2, and V3, use
[`PRODUCT_ROADMAP_VERSIONS.md`](./PRODUCT_ROADMAP_VERSIONS.md).

## One-Sentence Product

ProofForge helps developers register agents or nodes, pick useful project work, run it safely, submit proof, get human acceptance, and earn credit, benefits, or payout.

## Atomic Product Unit

The atomic ProofForge product unit is the `Proof Pack`.

```text
Proof Pack = scoped need/work + mission terms + run evidence + verifier result + human approval + maintainer-safe case file + credit/value state.
```

Vocabulary:

| Term            | Meaning                                            |
| --------------- | -------------------------------------------------- |
| Need            | upstream problem, request, or opportunity          |
| Work Lead       | source-backed need that may become a mission       |
| Mission         | scoped, proofable work with safety and value terms |
| Evidence Packet | generated artifact from runner/verifier output     |
| Case File       | maintainer review surface for the Proof Pack       |
| Public Proof    | public-safe accepted proof view                    |
| Proof Ledger    | accepted Proof Packs and their credit/value state  |

## Umbrella Product Model

ProofForge is a connected contribution graph. It sits above existing work networks instead of replacing them.

```text
GitHub / bounties / marketplaces / foundations / treasuries / private projects
-> source-backed work
-> proofable mission
-> human or agent execution
-> Proof Pack
-> accepted proof
-> credit, benefits, payout, and public proof history
```

The product should help a user answer:

```text
What have I contributed?
What did my agents do for me?
What was accepted?
What did I earn or unlock?
Where should I work next?
```

Ethereum/Web3 is the value and receipt layer, not a shortcut around proof:

```text
source or bounty URL
-> mission terms
-> accepted Proof Pack
-> credit / earned payout state
-> optional wallet, receipt, tx hash, grant, bounty, or treasury reference
```

V1 may show wallet, bounty, and onchain receipt references. V1 must not claim custody, escrow, automatic settlement, token issuance, or automatic ownership.

## The Simple Loop

```text
Register agent/node
-> pick useful project work
-> run safely
-> verify with a separate role
-> submit Proof Pack / case file
-> maintainer accepts
-> earned payout / credit
-> project proof ledger grows
```

If a UI screen needs more explanation than this, simplify the screen.

## The Circular Flywheel

The product should not stop after one proof packet.

```text
Connect GitHub, wallet, project, marketplace, or local agent
-> observe existing contribution history
-> track projects and project growth
-> find useful work for the user or their agent
-> create accepted proof
-> update credit, benefits, payout, public proof, and project ledger
-> improve recommendations and trust for the next contribution
```

This is the long-term product loop. The first demo proves one slice of it.

## Non-Negotiables

- Proof before payout.
- Accepted proof creates earned value. Release is a separate step.
- Users must know what they are being paid or credited for, by whom, and how collection works.
- Credit, benefits, payout, and ownership are different things and must not be blurred.
- Raw work needs source, project, acceptance owner, proof requirement, and value path before it becomes a mission.
- Bounty/source requirements must be visible before run and checked in the Proof Pack.
- Agent and node work rolls up to the owner unless project value rules explicitly define a split.
- No useful accepted work should disappear, even when it is unpaid.
- Agents are identifiable and constrained.
- Runner and verifier are separate roles.
- Humans approve public actions, submissions, and payout release.
- Maintainers review evidence, not agent noise.
- Do not claim live integrations that are only modeled or planned.

## Primary Users

### Contributor / Agent Owner

Needs to know:

- what work can be safely run
- which agent/node is doing it
- what proof will be produced
- who accepts the proof
- what credit or payout is created if accepted
- what work is still open or blocked

### Project Steward

Needs to know:

- what the project is trying to improve
- which opportunities are open
- who and what agents are helping
- what proof has been accepted
- what benefits or payouts have been created

### Maintainer / Reviewer

Needs to know:

- what was proven
- whether it is safe
- what artifacts exist
- whether to accept, request revision, or reject
- what payout state acceptance creates

## Current Product Navigation

The product should bias toward user intent, not internal objects.

Recommended primary nav:

```text
Home
Projects
Opportunities
My Work
```

Contextual or later routes:

```text
Agent / Node Setup
Mission Detail
Runner
Case File
Maintainer Review
Proof Ledger
Public Proof
```

`Proof Packets` should not be a default first-time-user tab. Before a user has proof, it is an empty internal object. After proof exists, expose it as `Proof Ledger`.

## Current Prototype Route Aliases

The code still uses some older hash route names. Treat these as implementation aliases, not product language.

| Current hash    | Product label                      |
| --------------- | ---------------------------------- |
| `#opportunity`  | Home                               |
| `#projects`     | Projects                           |
| `#work-queue`   | Opportunities                      |
| `#case-file`    | Case File / generated proof detail |
| `#scoreboard`   | Home outcome / proof ledger state  |
| `#first-run`    | Guided proof flow                  |
| `#run`          | Runner                             |
| `#maintainer`   | Maintainer Review                  |
| `#public-proof` | Public Proof                       |

Cleanup target:

```text
Do not expose flow screens as permanent nav.
Rename or replace Proof Packets with Proof Ledger after proof exists.
Add My Work as the user's cross-project responsibility tracker.
Add Agent / Node Setup as a real onboarding/contextual surface.
```

## Screen Jobs

Each screen gets one immediate question and one primary action.

| Screen            | Question                                      | Primary action                     |
| ----------------- | --------------------------------------------- | ---------------------------------- |
| Home              | What can I do next?                           | Start guided proof run             |
| Agent Setup       | What agent or node am I using?                | Register proof node                |
| Projects          | Where is useful work happening?               | Open opportunities or suggest work |
| Opportunities     | What work can I run or save?                  | Review mission                     |
| My Work           | What am I responsible for?                    | Continue current work              |
| Mission Detail    | Is this safe and worth running?               | Run in sandbox                     |
| Runner            | What is happening right now?                  | Review packet                      |
| Case File         | Is this proof ready to submit?                | Submit to maintainer               |
| Maintainer Review | Should this proof be accepted?                | Accept & mark earned               |
| Proof Ledger      | What proof was accepted and what did it earn? | View public proof                  |

## Card Rules

Cards should not become mini instruction manuals.

Preferred pattern:

```text
Title
State or short fact
Primary action
```

Avoid:

```text
Title
Explanation
Reason to care
Process
Primary action
Secondary action
Repeated proof/payout reminder
```

Use cards for objects, decisions, and ledgers. Hide deeper explanation behind details, tabs, or later screens.

## Agent Identity And Communication

These are product requirements, not optional flavor.

MVP must show local identity:

```text
agentId: docs-runner-01
owner: alex
identityRef: local:docs-runner-01
allowed: clone public repos, run commands, capture logs, package evidence
blocked: open PRs, post comments, spend funds, access secrets
```

MVP must show local coordination trace:

```text
Runner -> Verifier -> Packager -> Human approval
```

ENS and AXL are the bounty-grade upgrades:

```text
ENS: readable identity and discovery
AXL: runner/verifier/packager communication trace
```

If ENS or AXL are not live, label them as planned or modeled locally.

Existing multi-agent frameworks like OpenAgents, CrewAI, AutoGen, and LangGraph are useful adapter targets, not the ProofForge differentiator. ProofForge should sit above them as the proof, credit, and payout layer. See
[`docs/reference/AGENT_ORCHESTRATION_RESEARCH.md`](./reference/AGENT_ORCHESTRATION_RESEARCH.md)
for the framework fit.

Newer "agent company" and topic-room systems like Clawith, HiClaw, and Corellis confirm the same rule: use them as future runtime/workroom adapters, not as the product center. The ProofForge center is still accepted proof.

Do not add raw API-key donation, pooled credit spend, topic markets, prediction markets, dividends, or automatic crypto payout claims to the hackathon path. Those ideas can become a later economic layer only after security, billing, and legal review.

## Integration Priorities

### P0: Must Work

- GitHub issue import into Work Lead
- Work Lead to Mission conversion
- local policy gate
- local runner artifacts
- independent verifier result
- evidence packet and case file
- local agent identity
- local coordination trace
- maintainer acceptance
- earned/released payout accounting
- project credit ledger

### P1: Strong Sponsor Path

- 0G evidence storage with real credentials if available
- Ethereum/Web3/bounty fields visible in mission terms, payout state, and proof ledger
- wallet or payout recipient state modeled honestly
- external/onchain receipt reference attachable to released payout
- ENS identity if it can be made live
- AXL communication if it can be made live

### P2: Do Not Force

- payment settlement
- KeeperHub
- Uniswap
- any integration that cannot be run and defended
- agent framework forks that distract from the working proof loop
- raw API-key pooling or pooled credit donation
- prediction markets or dividend mechanics

## Claim Labels

Every integration must use exactly one label before submission:

```text
Live in demo
Implemented but credential-gated
Modeled locally
Planned roadmap
Removed from submission story
```

## Current Defensible Claims

- GitHub import is implemented.
- Local runner is implemented.
- Verifier is implemented.
- Evidence packet, case file, public packet are implemented.
- Earned/released payout accounting is implemented as manual accounting.
- Project credit ledger is implemented locally.
- 0G adapter is implemented but credential-gated.
- ENS and AXL are product-critical directions, but not live unless completed and verified.

## Current Pre-Submission Gaps

These must be fixed or clearly labeled before recording:

- Agent / Node Setup exists as a local proof-node surface; keep it simple and visible.
- Local agent identity is modeled and should remain visible across run and proof surfaces.
- Local coordination trace is modeled and should remain visible in the packet UI.
- `My Work` exists as the cross-project responsibility tracker; keep it as a primary nav surface.
- The current nav should not expose packet detail as a first-time-user primary tab.
- ENS and AXL are not live integrations unless implemented and verified.

## Build Gates

Before saying a slice is done:

```bash
npm run format:check
npm run build
npm test
npm run smoke:web
```

For packet proof:

```bash
npm run demo:packet
npm run sync:web-proof
```

For GitHub import:

```bash
npm run import:github -- --url https://github.com/<owner>/<repo>/issues/<number>
```

For 0G live proof, credentials must be configured and `npm run demo:packet` must output:

```text
Storage provider: 0g
Storage URI: 0g://...
```

## Documentation Hierarchy

Use this order:

1. `docs/OPERATING_GUIDE.md` - current source of truth.
2. `docs/SUBMISSION_CHECKLIST.md` - final submission gate.
3. `docs/DEMO_SCRIPT.md` - recording flow.
4. `docs/DEPENDENCY_AUDIT.md` - dependency risk status.
5. `docs/reference/` - historical detail and deeper rationale.

If two docs disagree, this operating guide wins unless the user gives a newer instruction.
