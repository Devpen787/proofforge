# ProofForge User Journeys

This is the user-journey source of truth. Use it with
[`OPERATING_GUIDE.md`](./OPERATING_GUIDE.md),
[`CONTRIBUTION_GRAPH.md`](./CONTRIBUTION_GRAPH.md),
[`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md), and
[`WORK_SOURCE_QUALIFICATION.md`](./WORK_SOURCE_QUALIFICATION.md) before
changing product screens.

## Journey Principles

ProofForge is not a generic dashboard. It is a guided product where useful work becomes accepted proof, and accepted proof creates credit, benefits, or payout records.

Every journey must preserve this line:

```text
useful project work
-> safe agent/node run
-> evidence packet
-> human acceptance
-> credit, benefits, payout state, and proof ledger
```

Do not make users manage internal objects before they understand what they can do next.

Every journey must answer two commercial questions:

```text
What am I working on, where did it come from, and who accepts it?
What value do I get if accepted, who grants it, and how do I collect or use it?
```

Every journey must also preserve the umbrella model:

```text
Connected source
-> personal/project bucket
-> contribution state
-> accepted proof
-> value state
```

## Primary Users

### 1. Contributor / Agent Owner

Profile:

- developer or builder with a local runner, coding agent, or spare compute node
- may connect GitHub, wallet, marketplace, or project accounts over time
- wants useful work, visible credit, and possible payout
- may not understand ProofForge yet
- needs strong safety boundaries before trusting the agent flow

Motivation:

```text
Connect my work sources, find work my agent can safely do, prove it, get accepted, and track credit, benefits, or payout.
```

Primary anxiety:

```text
Will this agent post, spend money, leak secrets, or waste my time?
```

Primary success moment:

```text
My proof was accepted and my credit/payout state updated.
```

### 2. Project Steward

Profile:

- project founder, ecosystem lead, open-source maintainer, or community organizer
- wants people and agents to help improve a project
- cares about proof, contributor quality, and project progress

Motivation:

```text
Connect project sources, turn project needs into proofable opportunities, and track accepted contributions.
```

Primary anxiety:

```text
Will this become noisy task management or low-quality bounty spam?
```

Primary success moment:

```text
The project has open opportunities, active agents, accepted proof, and a growing proof ledger.
```

### 3. Maintainer / Reviewer

Profile:

- person responsible for accepting evidence
- may be skeptical of agent output
- wants fast signal, not raw logs or agent chatter

Motivation:

```text
Review clean proof, decide quickly, and create the correct payout/credit state.
```

Primary anxiety:

```text
Is this proof real, safe, reproducible, and private enough to accept?
```

Primary success moment:

```text
I accepted valid proof without digging through noisy agent output.
```

### 4. Sponsor / Funder

Profile:

- foundation, project steward, company, or buyer funding useful work
- cares about pool status, accepted proof, released payouts, and auditability

Motivation:

```text
Fund useful proof and see where the money, credits, or benefits went.
```

Primary anxiety:

```text
Did funds move only after accepted proof?
```

Primary success moment:

```text
I can see accepted packets, earned payout records, releases, and receipts.
```

Sponsor is not the main MVP journey, but payout and ledger language must not block this future role.

### 5. Public Viewer

Profile:

- someone inspecting a project, proof packet, contributor, or public result
- may arrive from a shared link

Motivation:

```text
Trust that accepted proof happened without seeing private logs or unsafe details.
```

Primary anxiety:

```text
Is this real proof or just a badge?
```

Primary success moment:

```text
I can see what was proven, who accepted it, and what public-safe artifacts exist.
```

## Journey A: First-Time Contributor

Goal: get from zero context to one accepted proof packet.

Entry points:

- lands on `Home`
- follows an invite link to a project
- opens a shared opportunity

Happy path:

```text
Home
-> Agent / Node Setup
-> Opportunities
-> Mission Detail
-> Runner
-> Case File
-> Maintainer Review
-> Earned Payout / Credit
-> My Work
-> Public Proof or Proof Ledger
```

Screen requirements:

| Step               | User question             | UI must show                                                                                                 | Primary action          |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------- |
| Home               | What can I safely do now? | one recommended opportunity, agent/node status, earnable value                                               | Start safest proof      |
| Agent / Node Setup | Who is doing the work?    | node identity, owner, allowed/blocked actions, project attachments                                           | Register / confirm node |
| Opportunities      | Which work is ready?      | scoped missions, source/project, risk, owner, value path, runtime                                            | Review mission          |
| Mission Detail     | Is this worth running?    | what must be proven, source, who accepts, who funds/rewards, recipient, collection method, what agent can do | Run in sandbox          |
| Runner             | What is happening?        | timeline, output preview, security state, verifier trace                                                     | Review packet           |
| Case File          | Is this ready to submit?  | maintainer summary, artifacts, privacy/security, shared/private split                                        | Submit to maintainer    |
| Maintainer Review  | Was it accepted?          | decision state and payout/credit impact                                                                      | Accept & mark earned    |
| My Work            | What changed?             | earned payout, proof status, next action                                                                     | Release / view proof    |

Edge cases:

| Edge case                       | Expected product behavior                                                 |
| ------------------------------- | ------------------------------------------------------------------------- |
| No agent/node registered        | Home CTA routes to Agent / Node Setup before mission run.                 |
| Agent is unhealthy              | Mission run is blocked; user sees health issue and repair action.         |
| Mission is unsafe or blocked    | Mission Detail explains the blocked rule and offers another mission.      |
| Missing acceptance owner        | Opportunity stays a Work Lead; cannot run as a Mission.                   |
| Runner fails                    | Runner offers retry, save logs, or return to opportunities.               |
| Verifier disagrees              | Case File shows verifier issue; submit CTA becomes disabled or secondary. |
| Secret or private path detected | Case File requires review/redaction before submission.                    |
| Packet submitted twice          | Guard blocks duplicate submission and routes to existing review state.    |
| Maintainer requests revision    | My Work shows revision request as next action.                            |
| Maintainer rejects              | My Work shows rejected state, reason, and suggested next mission.         |
| Accepted but not released       | UI says `Earned`, not `Paid`; release remains a separate action.          |
| Value path unknown              | Do not advertise cash; keep as credit-only or needs-value-path.           |
| Ownership terms unclear         | Do not imply ownership; show credit/benefit only.                         |

Done criteria:

- a new user can identify the first click in under 5 seconds
- no screen requires reading a process manual
- proof before payout is visible at the decision points
- the user can explain who did the work, who verified it, who accepted it, and what changed

## Journey B: Returning Contributor / Agent Owner

Goal: track current responsibilities and continue the highest-value next action.

Entry points:

- opens `Home`
- opens `My Work`
- receives notification about review, revision, or payout state

Happy path:

```text
Home
-> My Work
-> Continue run / submit packet / fix revision / release payout
-> Proof Ledger
```

My Work must group:

- ready missions
- running missions
- packets waiting for submission
- packets in maintainer review
- revision requests
- earned payouts waiting for release
- project invites

Edge cases:

| Edge case                           | Expected product behavior                                                |
| ----------------------------------- | ------------------------------------------------------------------------ |
| Multiple active items               | Sort by blocked/needs-action first, then newest.                         |
| Nothing active                      | Show one recommended opportunity, not an empty table.                    |
| Payout earned but not released      | Make the distinction explicit without implying automatic money movement. |
| Agent attached to multiple projects | Show project label and capability fit per row.                           |
| User owns a node but not the agent  | Credit line shows the correct recipient.                                 |
| Revision request exists             | It should outrank new opportunities in My Work.                          |

Done criteria:

- `My Work` answers "what am I responsible for?"
- Home does not duplicate every My Work row
- the user can finish an in-progress item without hunting across tabs

## Journey C: Project Steward

Goal: create or manage a project where people and agents turn needs into accepted proof.

Entry points:

- opens `Projects`
- follows a project invite
- creates a project from Home

Happy path:

```text
Projects
-> Project Command Room
-> Suggest Work
-> Work Lead Triage
-> Convert to Mission
-> Invite Contributor
-> Attach Agent
-> Track Active Work
-> Proof Ledger
```

Project Command Room must show:

- project purpose
- open opportunities
- active work lanes
- people and agents
- benefits and unlocks
- proof ledger
- funding/payout state only when useful

Edge cases:

| Edge case                    | Expected product behavior                                              |
| ---------------------------- | ---------------------------------------------------------------------- |
| Project has no opportunities | Primary CTA is `Suggest work`; show purpose and empty lane.            |
| Raw work is vague            | Create Work Lead, not Mission; ask for missing details.                |
| No acceptance owner          | Block conversion or mark lead as needs triage.                         |
| No reward path               | Allow reputation/benefit-only mission if clearly labeled.              |
| Agent permission mismatch    | Attach Agent flow explains allowed/blocked mismatch.                   |
| Contributor invite pending   | Show pending state; do not count as active contributor until accepted. |
| Accepted proof exists        | Ledger becomes a product asset and public proof can be generated.      |
| Funding pool empty           | Do not promise cash; show credit/benefit path.                         |

Done criteria:

- Projects feels like the operating layer, not a folder list
- steward can tell what the project needs next
- raw opportunities do not skip the triage gate
- attached agents feel useful but constrained

## Journey D: Work Lead Triage

Goal: convert messy work into a mission only when it is proofable.

Entry points:

- import GitHub issue
- paste external task
- project steward suggests work
- marketplace/foundation backlog import

Happy path:

```text
Import / Suggest Work
-> Work Lead Detail
-> Proofability Diagnosis
-> Missing Info
-> Convert to Mission
-> Opportunity appears in queue
```

Required fields before conversion:

- objective
- project or repo
- acceptance owner
- proof required
- risk level
- reward, credit, or benefit path
- blocked actions

Edge cases:

| Edge case                           | Expected product behavior                                     |
| ----------------------------------- | ------------------------------------------------------------- |
| Missing browser/version/environment | Ask clarification; conversion disabled or clearly risky.      |
| No acceptance owner                 | Cannot become mission.                                        |
| Private repo requested              | Evidence-only or blocked until access policy exists.          |
| Public posting requested            | Human approval required before any external action.           |
| Payment unclear                     | Label as unpaid/credit-only/benefit-only instead of guessing. |
| Duplicate lead                      | Link to existing lead or mission.                             |
| Low proofability                    | Recommend reject or rewrite scope.                            |

Done criteria:

- Work Queue contains ready missions, not raw work
- user understands why a lead is or is not runnable
- conversion never hides missing acceptance or risk data

## Journey E: Maintainer / Reviewer

Goal: decide whether a packet should create earned value.

Entry points:

- opens review notification
- opens Maintainer Review
- follows packet link

Happy path:

```text
Maintainer Review
-> Packet Detail / Case File
-> Accept, Request Revision, or Reject
-> Earned Payout / Credit Record Created
```

Decision card must show:

- what was proven
- result
- confidence
- artifacts
- privacy/security status
- risk
- payout if accepted
- contributor or node owner

Edge cases:

| Edge case                  | Expected product behavior                             |
| -------------------------- | ----------------------------------------------------- |
| Evidence incomplete        | Request revision with structured reason.              |
| Wrong environment          | Revision reason points to required environment.       |
| Privacy issue              | Block acceptance until redaction or reject.           |
| Already accepted           | Disable second acceptance and route to payout/ledger. |
| Payout disputed            | Keep packet accepted but mark payout state disputed.  |
| Reviewer is not authorized | Decision buttons disabled; show who can accept.       |

Done criteria:

- maintainer can decide without reading raw agent logs
- acceptance creates earned payout/credit, not released payout
- revision/rejection states are recoverable and clear

## Journey F: Sponsor / Funder

Goal: see that funded work turns into accepted proof before release.

Entry points:

- opens project funding section
- opens proof ledger
- exports payout records

Happy path:

```text
Project
-> Funding / Ledger
-> Accepted Packets
-> Earned Payouts
-> Released Payouts
-> Export Records
```

Edge cases:

| Edge case                             | Expected product behavior                                  |
| ------------------------------------- | ---------------------------------------------------------- |
| Reward pool is pledged but not funded | Label as pledged, not escrowed.                            |
| Accepted proof but release pending    | Show earned state and release requirement.                 |
| External payout                       | Show external method; do not imply ProofForge moved money. |
| Disputed payout                       | Ledger shows dispute without erasing accepted proof.       |
| No payout path                        | Show reputation/benefit-only credit.                       |

Done criteria:

- sponsor sees where value was created
- payout states are auditable and not overpromised
- export/receipt can be a later route without blocking MVP

## Journey G: Public Viewer

Goal: trust accepted proof without seeing private data.

Entry points:

- shared public proof link
- project public page
- contributor profile

Happy path:

```text
Public Proof
-> What Was Proven
-> Accepted By
-> Public-Safe Artifacts
-> Project / Contributor Context
```

Must show:

- accepted status
- project
- mission
- what was proven
- accepted by
- accepted date
- public-safe artifacts
- reward/credit if public-safe

Must hide:

- raw local paths
- private logs
- secrets
- internal agent notes
- private payout records
- private project data

Edge cases:

| Edge case           | Expected product behavior                                |
| ------------------- | -------------------------------------------------------- |
| Packet not accepted | No public proof page, or show private/draft unavailable. |
| Artifact is private | Show artifact withheld/redacted state.                   |
| Acceptance revoked  | Public page shows revoked/superseded state.              |
| Project private     | Show minimal packet status only, or block public view.   |

Done criteria:

- public proof feels credible, not promotional
- private details stay hidden by default
- public proof reinforces contributor/project reputation

## Global Edge Cases

These apply across journeys.

| Area              | Edge case                                            | Expected behavior                                    |
| ----------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Navigation        | user lands on deep route without prerequisite state  | show contextual recovery action, not a blank page    |
| Persistence       | localStorage missing or corrupted                    | reset to safe demo state and explain minimally       |
| Safety            | action would post, PR, spend, or expose private data | require human approval or block                      |
| Identity          | agent identity missing                               | block run and route to setup                         |
| Verification      | verifier fails or is missing                         | packet cannot be maintainer-ready                    |
| Payment           | payout release attempted before earned               | block and explain earned/released distinction        |
| Duplicate actions | double submit, double accept, double release         | block and show existing state                        |
| Mobile            | dense project view                                   | collapse into clear sections with one primary action |
| Empty states      | no work, projects, packets, or payouts               | show the next useful action, not an explanatory wall |

## Journey Review Gate

Before a UI slice is considered complete, test it as each relevant user:

1. New contributor: can I start safely?
2. Returning contributor: can I find my next responsibility?
3. Project steward: can I see project progress and what needs work?
4. Maintainer: can I make a decision quickly?
5. Public viewer: can I trust the proof without private data?

The slice is not done if a user would ask:

```text
What do I click?
Why am I seeing this?
Who did the work?
Who accepts this?
What changed?
Did I earn anything?
Is this paid or only earned?
Where did my proof go?
```
