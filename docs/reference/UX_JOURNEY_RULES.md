# ProofForge UX Journey Rules

> Reference only. The current source of truth is
> [`../OPERATING_GUIDE.md`](../OPERATING_GUIDE.md).

This document is the product-experience contract for the web prototype. Use it before every UI slice. The goal is to avoid drifting back into a crowded card dashboard and keep ProofForge feeling like a guided product.

## North Star

ProofForge turns useful project work into accepted proof, credit, benefits, and payouts.

The simple product is:

```text
Register your agent or node.
Pick useful project work.
Run it safely.
Submit proof.
Get accepted.
Earn credit, benefits, or payout.
```

If a screen needs more than that to make sense, the screen is probably too complicated.

Two foundations cannot disappear from the product:

```text
Identity: Who is doing the work, who owns the agent, and who receives credit?
Coordination: Which agents checked the work, and how did the proof move between them?
```

These should be shown as simple product facts, not protocol lectures.

The user should feel this sequence without needing to read an explainer on every screen:

```text
Find useful work
-> run safely
-> produce proof
-> human accepts
-> earn credit or payout
-> project grows
```

The product promise stays:

```text
Turn messy work into proof someone can trust.
```

The economic hook is real, but it must stay honest:

```text
Proof before payout. Accepted proof creates earned value. Release is a separate step.
```

## Simplicity Rule

Do not explain the whole system on every screen.

Each screen should answer one immediate question:

- `Home`: What can I do next?
- `Projects`: Where is useful work happening?
- `Opportunities`: What work can I run or save?
- `My Work`: What am I responsible for?
- `Agent Setup`: What agent or node am I using?
- `Mission Detail`: Is this safe and worth running?
- `Runner`: What is happening right now?
- `Case File`: Is this proof ready to submit?
- `Maintainer Review`: Should this proof be accepted?
- `Proof Ledger`: What proof was accepted and what did it earn?

Everything else should be hidden behind details, tabs, or later screens.

## Intended Users

### Contributor / Builder

Primary motivation: find useful work, use a safe runner or agent, generate accepted proof, earn payout, credit, reputation, access, or benefits.

Main question:

```text
What can I safely do now, and what do I earn if the proof is accepted?
```

### Project Steward

Primary motivation: turn a project into a living contribution economy by defining purpose, creating opportunities, inviting people, attaching constrained agents, and tracking accepted proof.

Main question:

```text
What does this project need next, who or what is helping, and what proof has been accepted?
```

### Maintainer / Reviewer

Primary motivation: review clean evidence without reading noisy agent output.

Main question:

```text
What was proven, is it safe, and should I accept, revise, or reject it?
```

### Secondary Users

Sponsors fund projects and need financial clarity. Public viewers inspect accepted proof. Agent or node operators inspect permissions and performance.

## Missing Product Surfaces We Must Make Explicit

These are first-class product questions, not details to hide in random cards.

### Agent / Node Identity

A developer needs to know:

- what their agent or node is
- what it is trained or configured to do
- what permissions it has
- what work it can accept
- how it earns credit or payout
- how it is managed over time

This should appear in three places:

1. `Onboarding / Runner Setup`: register the user's work node or agent profile.
2. `Project Command Room`: attach a constrained agent to a project.
3. `Agent Detail`: inspect performance, permissions, payout eligibility, and attached projects.

Agent registration should answer:

```text
Who is doing the work?
What can it do?
What is blocked?
Which projects can use it?
How does accepted proof credit the owner?
```

MVP rule:

```text
The user registers a local proof node first. Agents are capabilities attached to that node or project, not autonomous actors with unchecked control.
```

Agent management should not be a generic settings page. It should be a clear asset page:

- agent/node name
- owner
- type
- status
- allowed actions
- blocked actions
- attached projects
- runs completed
- accepted proofs
- earned credit or payout
- last health check

Payment framing:

```text
Agents do not get paid directly in the MVP. Accepted proof credits the contributor or node owner. Later, project rules can split credit between humans, agents, nodes, and sponsors.
```

### Agent Discovery / Communication

If agents can participate across projects, users need discovery and communication.

Discovery should answer:

- what agents or nodes exist
- what they are good at
- who owns them
- what permissions they have
- what projects can use them
- what proof history they have

Communication should answer:

- which agent ran the work
- which agent verified it
- which agent packaged the evidence
- where the human approval happened
- what trace is attached to the packet

MVP rule:

```text
Show a local identity and local coordination trace first. Upgrade to ENS for readable identity and AXL for agent/node communication when those integrations are real.
```

UI rule:

```text
Do not show agent chat as the product. Show the proof handoff: Runner -> Verifier -> Packager -> Human approval.
```

### My Work Tracking

A contributor needs one place to track active commitments.

This should appear as `My Work` on Home, not as scattered cards across several tabs.

`My Work` should group:

- missions ready to run
- runs in progress
- packets waiting for submission
- packets in maintainer review
- revision requests
- earned payouts waiting for release
- project invitations

Each row should show:

- object name
- project
- current state
- next action
- reward or credit impact when relevant

This answers:

```text
What am I responsible for right now?
What is blocked?
What can I finish next?
```

Project-level tracking belongs in the Project Command Room:

- open opportunities
- active work
- needs review
- accepted proof
- people and agents
- proof ledger

Home tracks the user's work across projects. Projects tracks the work inside one project.

### Proof Packets / Proof Ledger Information Architecture

`Proof Packets` should not be a default top-level tab for a new user.

Reason:

```text
Before the user has generated proof, a Proof Packets tab is an empty internal object. It creates confusion and competes with the first action.
```

Better rule:

- before first packet: show packet state inside Home and the guided flow only
- after packet exists: expose `Proof Ledger` or `Packets` as a contextual library
- inside a project: show accepted packets in the project proof ledger
- for maintainers: show packets as a review queue
- for public viewers: show only accepted public-safe proof

If we keep a nav item, it should be renamed based on user value:

```text
Proof Ledger
```

not:

```text
Proof Packets
```

because the user cares about accepted proof, credit, payout state, and shareable history, not file objects.

## Default Contributor Journey

This is the first journey the prototype must optimize.

```text
Home
-> First Run
-> Mission Detail
-> Runner
-> Case File
-> Maintainer Review
-> Earned Payout
-> Released Payout
-> Public Proof
```

### Home

Screen job: start the user on one safe proof opportunity.

Primary CTA: `Start guided proof run`

Show:

- current earning state
- one recommended mission
- a short ready-work list
- one concise explanation of why proof creates value

Hide or minimize:

- long process explanations
- public proof before anything is accepted
- project-management controls
- repeated payout language

### First Run

Screen job: help the user choose a starter mission with confidence.

Primary CTA: `Review mission`

Show:

- one selected starter mission
- risk, runtime, reward, acceptance owner
- safety boundary
- step context only if it reduces anxiety

Hide or minimize:

- multiple competing missions
- project controls
- protocol details

### Mission Detail

Screen job: let the user decide whether to run.

Primary CTA: `Run in sandbox`

Show:

- what must be proven
- who accepts proof
- what artifacts are required
- what agents can and cannot do
- what is earned if accepted

Hide or minimize:

- generic platform copy
- payout mechanics beyond earned versus released

### Runner

Screen job: show safe execution and ask for the next approval.

Primary CTA: `Review packet` or `Approve packet`

Show:

- local evidence-only safety state
- concise run timeline
- live output preview
- packet output preview
- runner security state

Hide or minimize:

- agent internals until expanded
- repeated mission context

### Case File

Screen job: present the core artifact and decide whether to submit.

Primary CTA: `Submit to maintainer`

Show:

- maintainer summary
- what was tested
- what happened
- confidence
- artifacts
- privacy review
- security review
- what is shared versus kept private

Hide or minimize:

- internal notes
- raw logs by default
- protocol chain unless expanded

### Maintainer Review

Screen job: make a decision fast.

Primary CTA: `Accept & Mark Earned`

Show:

- what was proven
- confidence
- risk
- artifact count
- privacy/security status
- payout if accepted
- revision/rejection actions as secondary

Hide or minimize:

- contributor onboarding copy
- long agent logs

### Earned / Released Outcome

Screen job: clarify what changed.

Primary CTA: `Release payout` when earned, then `View public proof` after release or acceptance.

Show:

- earned payout state
- released payout state
- reputation and credits
- public-safe proof availability

Hide or minimize:

- manual accounting details unless opened

## Project Steward Journey

Projects are the operating layer, not just folders.

```text
Projects
-> Project Command Room
-> Suggest Work
-> Work Lead Triage
-> Convert to Mission
-> Invite Contributor
-> Attach Agent
-> Proof Ledger
```

### Project Command Room

Screen job: show what the project needs and what proof has moved.

Primary CTA depends on state:

- no project: `Start project`
- project exists, no work: `Suggest work`
- work exists: `Open opportunities`

Show:

- project purpose
- open opportunities
- active work
- people and agents
- proof ledger
- benefits and unlocks

Hide or minimize:

- all project settings
- funding exports
- advanced permissions
- repeated explanation of the whole proof loop

### Work Lead Triage

Screen job: turn raw work into a mission or stop it.

Primary CTA:

- incomplete lead: `Ask clarification`
- ready lead: `Convert to mission`

Show:

- raw request summary
- proofability
- missing information
- risk
- acceptance owner
- reward path
- recommended next action

Hide or minimize:

- running controls until the lead is mission-ready

### Attach Agent

Screen job: make delegation useful and constrained.

Primary CTA: `Attach agent`

Show:

- agent type
- allowed actions
- blocked actions
- sandbox profile

Use the core line:

```text
Delegate capability, not control.
```

## Maintainer Journey

```text
Review Queue
-> Packet Detail
-> Accept / Revision / Reject
-> Earned Payout Created
```

The maintainer surface is not a dashboard. It is a decision queue.

Each packet card should answer:

- what was proven
- confidence
- risk
- privacy/security
- payout if accepted
- decision needed

## Navigation Rules

Primary nav should map to user intent, not every internal object.

Contributor nav:

```text
Home
Projects
Opportunities
My Work
```

Flow screens should not be permanent primary nav destinations:

- First Run
- Mission Detail
- Runner
- Case File
- Public Proof

Maintainer review can appear as a workspace or contextual route after a packet is submitted.

Do not expose screens before they matter. For example, packet history should stay inside the guided flow, Home, or Project Command Room until the user has at least one packet. After that, it can become `Proof Ledger`.

Recommended MVP nav:

```text
Home
Projects
Opportunities
My Work
```

Contextual destinations:

- `Agent / Node Setup`: appears during onboarding and from profile/project agent cards
- `Proof Ledger`: appears after proof exists or inside a project
- `Maintainer Review`: appears after packet submission or workspace switch
- `Public Proof`: appears only for accepted public-safe packets

## Card Rules

Every card must have one job. If a card needs a title, explanation, button, process, and reason to exist, it is probably doing too much.

### Hero / Onboarding Card

Allowed to explain the product story once.

Contains:

- strong headline
- one support sentence
- one primary CTA
- optional compact state panel

### Object Card

Used for projects, opportunities, missions, agents, packets, payouts.

Contains:

- object name
- 3 to 5 useful facts
- status
- one action

Avoid instructional paragraphs.

### Decision Card

Used when the user must choose.

Contains:

- decision label
- tradeoff or risk
- one primary CTA
- secondary actions only if necessary

### Ledger / Status Card

Used for proof, payout, reputation, benefits.

Contains facts only. No sales copy.

### Details Panel

Used for longer explanation, logs, protocol details, and advanced policy. These should usually be collapsed, tabbed, or behind a secondary action.

## Copy Rules

Use short, precise labels.

The UI should not constantly justify itself. Show the object, its state, and the next action. Save explanation for onboarding, empty states, and expandable details.

Preferred card copy pattern:

```text
Title
State or short fact
Primary action
```

Avoid this pattern:

```text
Title
Explanation
Reason to care
Process
Primary action
Secondary action
Another reminder about proof and payout
```

Use:

- proof
- evidence
- sandbox
- human approval
- accepted proof
- earned payout
- released payout
- project steward
- work lead
- mission
- benefits
- credit

Avoid:

- passive income
- agent swarm
- autonomous marketplace
- instant cash
- guaranteed earnings
- repeating the same proof/payout explanation on every card

## Anti-Patterns We Are Removing

- dashboard-pile layouts where every card competes for attention
- repeated process diagrams at the top of every page
- more than one primary CTA on a screen
- long explanatory copy inside object cards
- exposing advanced system objects before the user needs them
- clipped wide cards on normal desktop widths
- permanent nav items for temporary flow screens
- protocol, payout, and agent internals in the default view

## Screen Review Checklist

Before moving on from any UI slice, check:

- Can a new user identify the next click in under 5 seconds?
- Does the screen have one current job?
- Is there exactly one primary CTA?
- Are object cards facts-first instead of instruction-heavy?
- Is proof value visible before protocol complexity?
- Are earned payout and released payout clearly distinct?
- Are private details hidden by default?
- Does the page avoid repeating the product thesis?
- Does the layout fit without clipped major cards at desktop width?
- Does the mobile view preserve the same journey?
- Did we click through the intended path in the browser?

## Done Criteria

The product experience is ready when these journeys feel obvious and work end to end:

```text
Contributor:
Home -> guided proof -> run -> packet -> maintainer accepts -> earned payout -> release -> public proof
```

```text
Project steward:
Projects -> suggest work -> triage lead -> convert mission -> invite contributor -> attach agent -> proof ledger
```

```text
Maintainer:
Review queue -> packet detail -> accept / revision / reject -> earned payout created
```

The UI is considered off-track if it looks visually clean but the user still asks:

```text
What do I click?
Why is this here?
What changed?
Where did my proof go?
Did I earn anything?
```
