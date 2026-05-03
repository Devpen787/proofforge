# ProofForge Visual Walkthrough

> Reference only. Use [`../DEMO_SCRIPT.md`](../DEMO_SCRIPT.md) for recording
> flow and [`../OPERATING_GUIDE.md`](../OPERATING_GUIDE.md) for current product
> rules.

Historic route-by-route guide. Prefer current labels from the operating guide when recording or judging: Home, Opportunities, Maintainer Review, Proof Ledger / outcome state.

## Golden Loop

```text
Existing Work
-> Work Lead
-> Mission
-> Agent / Node Identity
-> Safe Run
-> Coordination Trace
-> Evidence Packet
-> Maintainer Review
-> Earned Payout
-> Released Payout
-> Public Proof
-> Project Credit
```

Every screen should make at least one part of this loop obvious.

## Routes

### Home

URL: `http://localhost:5173/#opportunity`

What to notice:

- the product promise is visible immediately
- ready work has rewards, runtime, risk, and acceptance owner
- the proof loop explains Work -> Run -> Verify -> Packet -> Credit

Primary action: run the first proof packet.

### Guided Proof Flow

URL: `http://localhost:5173/#first-run`

What to notice:

- one guided starter mission
- six-step activation path
- safety defaults before the runner
- no public action, PR, or payment before approval

Primary action: run the safest starter mission.

### Projects

URL: `http://localhost:5173/#projects`

What to notice:

- projects coordinate people, agents, backlog, proof, and reward pool
- proof ledger shows accepted packets, pending packets, earned payouts, latest proof, and proof history
- agent cards show allowed and blocked actions
- people roster shows the collaboration layer

Primary action: open the Work Queue.

### Opportunities

URL: `http://localhost:5173/#work-queue`

What to notice:

- raw work enters as a Work Lead before becoming a Mission
- GitHub/source imports are read-only and local
- diagnosis explains what is known, what is missing, and why conversion is blocked
- the clarification question prevents agent spam

Primary action: ask clarification or run the scoped starter mission.

### Runner

URL: `http://localhost:5173/#run`

What to notice:

- the run is local and evidence-only
- lifecycle shows the proof operation
- packet output preview shows what artifacts will be created
- approval checkpoint is the human gate before anything leaves the workspace

Primary action: approve the packet.

### Case File

URL: `http://localhost:5173/#case-file`

What to notice:

- maintainer summary is the core asset
- packet facts show status, verifier, policy, and public action state
- privacy and security reviews are separate
- shared vs private artifact boundaries are explicit

Primary action: submit the packet to the maintainer inbox.

### Maintainer Review

URL: `http://localhost:5173/#maintainer`

What to notice:

- maintainer reviews clean proof, not raw agent output
- decision card shows what was proven, confidence, risk, artifacts, privacy, and payout
- review standards show the packet is decision-ready
- accepting creates an earned payout, not an automatic payment

Primary action: accept and mark earned.

### Proof Ledger / Outcome State

URL: `http://localhost:5173/#scoreboard`

What to notice:

- next best action changes based on proof state
- earned and released payouts are distinct
- payout timeline shows the accounting flow
- reputation unlock and project credit make contribution history visible

Primary action: release payout or start the next proof mission.

### Public Proof

URL: `http://localhost:5173/#public-proof`

What to notice:

- accepted proof is shareable
- public view keeps private logs, local paths, and payout internals hidden
- project, contributor, artifacts, verifier, and payout outcome are visible at a safe level

Primary action: return to Scoreboard.

## Demo Message

ProofForge does not replace existing work networks. It plugs into them.

The product turns messy work into scoped missions, safe runs, evidence packets, maintainer decisions, payout state, and project credit.
