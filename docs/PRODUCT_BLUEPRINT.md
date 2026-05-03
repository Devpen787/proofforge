# ProofForge Product Blueprint

This is the compact build reference. Use it when deciding what the product should feel like, what to build next, and whether a slice is on mission.

Detailed supporting docs:

- [`PRODUCT_STORYBOARD.md`](./PRODUCT_STORYBOARD.md) for screen-level detail.
- [`PRODUCT_ROADMAP_VERSIONS.md`](./PRODUCT_ROADMAP_VERSIONS.md) for V1/V2/V3 boundaries.
- [`ETHEREUM_WEB3_BOUNTY_INTEGRATION.md`](./ETHEREUM_WEB3_BOUNTY_INTEGRATION.md) for wallet, onchain receipt, bounty, and Ethereum boundaries.
- [`ACCEPTANCE_MATRIX.md`](./ACCEPTANCE_MATRIX.md) for done gates.

## Product Thesis

ProofForge is a proof and contribution layer over existing work networks.

```text
Existing work sources
-> safe human/agent execution
-> accepted Proof Pack
-> contribution credit
-> payout, receipt, benefit, or public proof state
-> better project and contributor history
```

ProofForge does not replace GitHub, bounty marketplaces, DAO treasuries, grants, or agent frameworks. It connects them through proof.

## North Star

```text
Find useful work.
Prove it safely.
Get accepted.
Track what you earned, credited, or unlocked.
See how your work and agents contribute to larger projects.
```

The product should feel practical first:

```text
I connected a source.
I picked real work.
My agent helped safely.
A human accepted the proof.
I can see the value state.
```

## Primary Users

| User                      | Job                                                                 | Success moment                                                     |
| ------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Contributor / Agent Owner | find work, run agent-assisted proof, track credit and payout state  | sees accepted proof and earned/released value in My Work           |
| Project Steward           | organize useful work, agents, people, proof ledger, and value rules | sees project opportunities turn into accepted proof                |
| Maintainer / Reviewer     | decide quickly if proof holds                                       | accepts/revises/rejects without reading raw agent noise            |
| Sponsor / Funder          | fund useful work and track release                                  | sees earned/released records tied to accepted proof                |
| Public Viewer             | trust what was accepted                                             | sees public-safe proof, project context, and optional receipt refs |
| Agent / Node              | execute constrained work and produce evidence                       | appears in trace and reputation without bypassing human approval   |

## V1 Storyboard

V1 is a proof workbench with visible value tracking. It is not a full marketplace.

```text
Home
-> Connect Sources
-> Agent Setup
-> Project
-> Opportunity / Mission Detail
-> Runner
-> Proof Pack
-> Maintainer Review
-> My Work / Proof Ledger / Public Proof
```

### 1. Home

User question:

```text
What should I do next?
```

Show:

- one best action
- source connection state
- proof node / agent readiness
- current work/value state
- a short list of safe opportunities

Primary action:

```text
Start safest proof
```

Do not show:

- full protocol explanation
- every product object
- wallet/bounty lecture

### 2. Connect Sources

User question:

```text
Where does my work and value come from?
```

Show:

- GitHub issue import or source URL
- bounty / DAO proposal / grant URL reference
- source/bounty submission requirements when available
- wallet or payout recipient state
- project source links
- clear claim label: live, modeled, planned

Primary action:

```text
Import source
```

V1 truth:

```text
GitHub import can be live.
Bounty/Web3 source can be modeled/manual.
Wallet/tx receipt can be a reference.
No funds move.
```

### 3. Agent Setup

User question:

```text
Who or what is producing proof for me?
```

Show:

- agent/node ID
- owner
- allowed actions
- blocked actions
- verifier path
- credit/payout recipient

Primary action:

```text
Confirm proof node
```

V1 default:

```text
Agent work rolls up to the owner.
Agent is not paid directly.
```

### 4. Project

User question:

```text
What useful project does this work improve?
```

Show:

- project purpose
- source links
- open opportunities
- active work
- accepted proof ledger
- people and agents
- funding/value rules summary

Primary action:

```text
Open opportunities
```

### 5. Opportunity / Mission Detail

User question:

```text
Is this worth running, and what happens if accepted?
```

Show:

- source
- project
- acceptance owner
- proof required
- source/bounty submission requirements
- risk
- allowed/blocked agent actions
- value if accepted
- reward asset and release method
- custody status

Primary action:

```text
Run in sandbox
```

Block if:

```text
source, project, acceptance owner, proof requirement, risk, or value path is unclear
```

### 6. Runner

User question:

```text
What is happening right now, and is it safe?
```

Show:

- local evidence-only status
- command/result trace
- runner -> verifier -> packager trace
- artifacts created
- blocked external actions

Primary action:

```text
Review Proof Pack
```

Never imply:

```text
public post, PR, payment, or external submission happened automatically
```

### 7. Proof Pack

User question:

```text
Is this ready for human review?
```

Show:

- maintainer summary
- what was tested
- what happened
- requirements satisfied checklist
- artifacts
- privacy/security review
- shared/private split
- value if accepted
- receipt refs if present

Primary action:

```text
Submit to maintainer
```

### 8. Maintainer Review

User question:

```text
Does this proof hold?
```

Show:

- what was proven
- confidence
- risk
- privacy state
- artifacts
- credit recipient
- payout impact if accepted

Primary action:

```text
Accept and mark earned
```

Outcomes:

```text
accepted -> credit + earned payout if defined
revision -> contributor action required
rejected -> no earned payout
```

### 9. My Work / Proof Ledger / Public Proof

User question:

```text
What did I contribute, what was accepted, and what value followed?
```

Show:

- active work
- submitted proof
- accepted proof
- earned payout
- released payout
- wallet/receipt state
- public-safe proof
- project history

Primary action depends on state:

```text
continue work
fix revision
mark payout released
view public proof
find next opportunity
```

## V1 Architecture

```text
Web app
-> source import
-> Work Lead
-> Mission Contract
-> policy gate
-> local runner
-> verifier
-> evidence packet
-> case file
-> maintainer decision
-> credit/payout/project ledger
-> public proof
```

Current package responsibilities:

| Package / app       | Responsibility                                                |
| ------------------- | ------------------------------------------------------------- |
| `packages/sources`  | GitHub/source import and Work Lead creation                   |
| `packages/mission`  | mission contract and conversion gates                         |
| `packages/policy`   | allowed/blocked actions and safety rules                      |
| `apps/runner`       | local deterministic proof run and generated artifacts         |
| `packages/verifier` | independent verification of runner artifacts                  |
| `packages/evidence` | evidence packet, case file, public packet                     |
| `packages/payments` | earned/released payout accounting                             |
| `packages/projects` | project ledger, accepted proof, value rules, agent delegation |
| `packages/storage`  | local storage and credential-gated 0G adapter                 |
| `apps/web`          | product prototype and journey UI                              |

Artifacts:

```text
work-lead.json
mission-contract.json
runner-result.json
verifier-result.json
evidence-packet.json
case-file.md
policy.json
payout.json
project.json
public-packet.json
```

## Web3 / Bounty Architecture

V1:

```text
Source URL or bounty URL
-> Source Record
-> Mission value terms
-> accepted Proof Pack
-> earned payout state
-> manual release
-> optional wallet / tx hash / receipt URL reference
```

V2:

```text
GitHub account import
+ wallet connect
+ onchain receipt import
+ bounty/funding adapters
+ accepted proof matched to external value signals
```

V3:

```text
verified receipts
+ sponsor pools
+ optional settlement/escrow adapters
+ public credentials or badges
+ agent identity/reputation standards
```

Guardrail:

```text
No Web3, bounty, grant, wallet, token, or treasury signal bypasses source qualification, proof, human acceptance, redaction, and explicit value rules.
```

## V1 Dependencies

### Product Dependencies

| Dependency             | Required for V1? | Status                                              |
| ---------------------- | ---------------- | --------------------------------------------------- |
| GitHub source          | yes              | import implemented for public issues                |
| Local runner           | yes              | deterministic fixture implemented                   |
| Verifier               | yes              | implemented                                         |
| Proof Pack             | yes              | implemented                                         |
| Maintainer review      | yes              | simulated in UI/state                               |
| Earned/released payout | yes              | local accounting implemented                        |
| Wallet field           | yes as model     | metadata/reference, not live settlement             |
| Bounty URL             | yes as model     | source/value metadata                               |
| Onchain receipt        | yes as model     | optional reference, not verified unless implemented |
| 0G storage             | optional         | adapter exists, credential-gated                    |
| ENS / AXL              | optional         | roadmap unless implemented and verified             |

### Technical Dependencies

Use [`DEPENDENCY_AUDIT.md`](./DEPENDENCY_AUDIT.md) for current risk status.

Known dependency issue:

```text
@0gfoundation/0g-storage-ts-sdk -> open-jsonrpc-provider -> axios
```

Mitigation:

```text
local storage is default
0G adapter is optional and credential-gated
production demo should serve built Vite output
```

## Build Order From Here

1. Clean the UI around this exact V1 storyboard.
2. Add explicit Web3/bounty/value fields only where they affect decisions.
3. Add source/bounty requirement patterns from the discovery exercise to Mission Detail and Proof Pack.
4. Keep Home, Projects, Opportunities, Mission, Runner, Proof Pack, Review, and My Work as the main journey.
5. Remove repeated explanation cards and permanent internal-object tabs.
6. Verify the V1 journey in browser as a first-time user.
7. Run build/test/smoke gates before claiming done.

## Done Definition

V1 is done when a judge can see and run:

```text
source-backed work
-> safe agent-assisted proof
-> generated Proof Pack
-> maintainer acceptance
-> credit + earned payout state
-> optional external/onchain receipt reference
-> public-safe accepted proof
```

and the UI makes the next click obvious at every step.
