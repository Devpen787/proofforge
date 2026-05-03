# ProofForge Lifecycle Map

Use this map with [`JOURNEYS.md`](./JOURNEYS.md) and
[`OPERATING_GUIDE.md`](./OPERATING_GUIDE.md). It defines the product objects, their allowed state transitions, and the state gates the UI must respect.

## Lifecycle Summary

```text
Work Lead
-> Mission
-> Run
-> Evidence Packet
-> Maintainer Review
-> Accepted Proof
-> Earned Payout / Credit
-> Released Payout
-> Proof Ledger / Public Proof
```

No object should skip its gate. Raw work cannot become a run. Generated evidence cannot create payout. Accepted proof creates earned value, not released money.

## Core Objects

| Object          | Purpose                                                                 | Owner                     | User-facing surface                 |
| --------------- | ----------------------------------------------------------------------- | ------------------------- | ----------------------------------- |
| Project         | Container for useful work, people, agents, proof, benefits, and funding | Project steward           | Projects                            |
| Source Record   | Origin and qualification record for imported or suggested work          | System / steward          | Opportunities / Work Lead Detail    |
| Work Lead       | Raw or imported opportunity that may become a mission                   | Steward or contributor    | Opportunities / triage              |
| Mission         | Scoped, proofable, safe unit of work                                    | Project steward or system | Mission Detail                      |
| Value Terms     | Mission-level rules for payout, credit, benefit, recipient, and release | Project steward / sponsor | Mission Detail, Case File, My Work  |
| Agent / Node    | Identifiable capability that runs or verifies work                      | Contributor / node owner  | Agent Setup, Project agents, Runner |
| Run             | Local evidence-only execution event                                     | Contributor / agent owner | Runner                              |
| Evidence Packet | Evidence artifact produced by run and verifier                          | Contributor / system      | Case File                           |
| Review          | Maintainer decision on submitted packet                                 | Maintainer / reviewer     | Maintainer Review                   |
| Payout          | Accounting record created after accepted proof                          | Project / sponsor         | My Work, Proof Ledger               |
| Public Proof    | Public-safe view of accepted proof                                      | Project / contributor     | Public Proof                        |

## Work Lead Lifecycle

Statuses from code:

```text
imported
needs_triage
proofable
mission_ready
converted
rejected
```

Allowed transitions:

| From              | To            | Trigger                                              | Gate                                    |
| ----------------- | ------------- | ---------------------------------------------------- | --------------------------------------- |
| imported          | needs_triage  | imported lead lacks details                          | missing fields exist                    |
| imported          | proofable     | imported lead has objective and evidence shape       | proofability high enough                |
| needs_triage      | proofable     | user clarifies missing details                       | acceptance owner and proof target known |
| proofable         | mission_ready | system checks reward path, risk, and blocked actions | no required data missing                |
| mission_ready     | converted     | user converts lead                                   | permission and conversion guard pass    |
| any non-converted | rejected      | user rejects or risk is too high                     | reason captured                         |

Conversion gate:

```text
proofability >= threshold
missing.length === 0
project known
acceptanceOwner exists
desiredEvidence exists
riskLevel known
value path known
status !== rejected
```

UI rule:

```text
If any conversion gate fails, show it as a Work Lead, not a Mission.
```

## Mission Lifecycle

Statuses from code:

```text
ready
running
approval_required
packet_ready
submitted
accepted
revision_requested
rejected
```

Allowed transitions:

| From               | To                 | Trigger                             | Gate                                             |
| ------------------ | ------------------ | ----------------------------------- | ------------------------------------------------ |
| ready              | running            | contributor starts run              | agent/node registered, mission not blocked       |
| running            | approval_required  | run reaches external/share decision | human approval required                          |
| running            | packet_ready       | run and verifier pass               | no approval needed or approval already granted   |
| approval_required  | packet_ready       | human approves evidence packet      | no external unsafe action taken                  |
| packet_ready       | submitted          | contributor submits case file       | packet exists and is not duplicate               |
| submitted          | accepted           | maintainer accepts                  | reviewer authorized, packet not already accepted |
| submitted          | revision_requested | maintainer requests revision        | structured reason captured                       |
| submitted          | rejected           | maintainer rejects                  | structured reason captured                       |
| revision_requested | packet_ready       | contributor fixes packet            | new evidence or correction exists                |

Blocked transitions:

| Attempt                | Reason                                            |
| ---------------------- | ------------------------------------------------- |
| ready -> submitted     | mission must run and create packet first          |
| ready -> accepted      | maintainer cannot accept without submitted packet |
| submitted -> submitted | duplicate submission                              |
| accepted -> accepted   | duplicate acceptance                              |
| rejected -> accepted   | rejected packet needs resubmission/new review     |

UI rule:

```text
Mission Detail owns the run decision. Runner owns execution. Case File owns submission. Maintainer Review owns acceptance.
```

## Run Lifecycle

Run states are currently modeled in the web prototype rather than a shared package.

```text
not_started
running
verifying
packet_ready
failed
cancelled
```

Allowed transitions:

| From           | To           | Trigger                              | Gate                          |
| -------------- | ------------ | ------------------------------------ | ----------------------------- |
| not_started    | running      | user clicks Run in sandbox           | local policy passes           |
| running        | verifying    | command exits and artifacts captured | logs and environment captured |
| verifying      | packet_ready | verifier passes                      | verifier result exists        |
| verifying      | failed       | verifier fails                       | issue captured                |
| running        | cancelled    | user cancels                         | no packet submitted           |
| any pre-submit | failed       | runner error                         | error and logs saved          |

Run safety invariant:

```text
No public posts, PRs, payments, secrets, or private repo access happen during local run.
```

## Evidence Packet Lifecycle

Statuses from code:

```text
draft
generated
verified
approval_required
approved
submitted
accepted
needs_revision
rejected
```

Allowed transitions:

| From              | To                | Trigger                                   | Gate                           |
| ----------------- | ----------------- | ----------------------------------------- | ------------------------------ |
| draft             | generated         | packet files created                      | runner artifacts exist         |
| generated         | verified          | verifier passes                           | verifier result passed         |
| generated         | needs_revision    | verifier fails                            | issue captured                 |
| verified          | approval_required | sharing or external action needs approval | policy requires human review   |
| approval_required | approved          | human approves                            | privacy/security review passed |
| verified          | submitted         | user submits                              | no approval required           |
| approved          | submitted         | user submits                              | packet approved                |
| submitted         | accepted          | maintainer accepts                        | reviewer authorized            |
| submitted         | needs_revision    | maintainer requests revision              | reason captured                |
| submitted         | rejected          | maintainer rejects                        | reason captured                |

Packet submission gate:

```text
packet exists
privacy review complete
security review complete
verifier result exists
human approval satisfied when required
not already submitted
```

Public proof gate:

```text
packet status is accepted
public-safe artifacts only
raw logs private by default
local paths masked
secrets absent or redacted
```

## Review Lifecycle

```text
unreviewed
accepted
revision_requested
rejected
```

Decision rules:

| Decision         | Required data                                                                     | Result                                               |
| ---------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Accept           | what was proven, confidence, artifacts, privacy/security pass, payout if accepted | packet accepted, earned payout/credit can be created |
| Request revision | structured reason and update request                                              | packet needs revision, no earned payout              |
| Reject           | structured reason                                                                 | packet rejected, no earned payout                    |

Maintainer rule:

```text
Maintainers review clean proof, not raw agent noise.
```

## Payout Lifecycle

Statuses from code:

```text
escrowed
earned
released
disputed
cancelled
```

Allowed transitions:

| From     | To        | Trigger                       | Gate                              |
| -------- | --------- | ----------------------------- | --------------------------------- |
| escrowed | earned    | packet accepted               | accepted packet exists            |
| earned   | released  | steward/sponsor marks release | payout is earned and not disputed |
| earned   | disputed  | steward/reviewer disputes     | reason captured                   |
| disputed | released  | dispute resolved              | manual decision                   |
| escrowed | cancelled | mission or packet rejected    | no accepted proof                 |

Blocked transitions:

| Attempt                             | Reason                                      |
| ----------------------------------- | ------------------------------------------- |
| generated packet -> earned payout   | only accepted packets create earned payouts |
| submitted packet -> released payout | release requires earned payout              |
| released -> disputed                | released payouts cannot be disputed in MVP  |
| released -> released                | duplicate release                           |

Payment language:

```text
Earned = accepted but not released.
Released = marked paid or released.
External = paid outside ProofForge.
No automatic money movement in the MVP.
```

## Value Terms Lifecycle

```text
undefined
draft
confirmed
earned
released
disputed
```

Allowed transitions:

| From      | To        | Trigger                       | Gate                                                              |
| --------- | --------- | ----------------------------- | ----------------------------------------------------------------- |
| undefined | draft     | Work Lead is created          | source and project exist                                          |
| draft     | confirmed | Mission is created            | value type, recipient, acceptance owner, and release method known |
| confirmed | earned    | packet accepted               | accepted proof exists                                             |
| earned    | released  | payout/benefit release marked | release authority exists                                          |
| earned    | disputed  | steward/sponsor disputes      | reason captured                                                   |

Value invariant:

```text
Every runnable mission must say what value is created, who receives it, and how release or collection works.
```

Ownership invariant:

```text
Credit, benefit, payout, and ownership are separate. Accepted proof does not create ownership unless project terms explicitly grant it.
```

## Agent / Node Lifecycle

```text
unregistered
registered
attached_to_project
running
verifying
healthy
blocked
retired
```

Allowed transitions:

| From                | To                  | Trigger                               | Gate                                  |
| ------------------- | ------------------- | ------------------------------------- | ------------------------------------- |
| unregistered        | registered          | user confirms local proof node        | identity and capability profile exist |
| registered          | attached_to_project | steward attaches agent                | allowed/blocked actions accepted      |
| attached_to_project | running             | mission starts                        | project and mission permissions match |
| running             | healthy             | run completes and checks pass         | health result exists                  |
| any active          | blocked             | policy, health, or permission failure | reason visible                        |
| any active          | retired             | owner removes agent                   | active runs resolved                  |

Identity invariant:

```text
Every run and packet must show which agent/node ran it and who owns credit.
```

## Project Lifecycle

```text
draft
active
recruiting
paused
archived
```

Project is active when it has:

- purpose
- at least one opportunity or work lead
- steward or acceptance owner
- people or agent capacity

Project command room must not become a settings dump. It should show:

- purpose
- open opportunities
- active work
- people and agents
- proof ledger
- benefits/unlocks

## Ledger Lifecycle

Proof ledger entries are created only from accepted proof.

Ledger entry must include:

- project
- mission
- packet
- contributor or node owner
- accepted by
- accepted at
- credit/reputation/payout effect
- public-safe visibility state

Ledger invariant:

```text
The ledger records accepted proof, not raw attempts.
```

## State Ownership

| State                  | Source package or surface                    |
| ---------------------- | -------------------------------------------- |
| Work Lead status       | `packages/mission`                           |
| Mission status         | `packages/mission` and web prototype state   |
| Run status             | web prototype / runner app                   |
| Evidence Packet status | `packages/evidence`                          |
| Review status          | web prototype and packet status              |
| Payout status          | `packages/payments`                          |
| Project status         | `packages/projects`                          |
| Agent identity         | web demo data today; future identity package |

## Product Rules Derived From Lifecycle

- Home cannot start a mission if the agent/node is missing.
- Opportunities cannot show raw leads as ready missions.
- Mission Detail cannot hide acceptance owner or blocked actions.
- Runner cannot imply external action happened.
- Case File cannot submit without verifier and privacy/security review.
- Maintainer Review cannot accept twice.
- Accepted proof creates earned payout/credit only once.
- Released payout is manual and separate.
- Public Proof only exists after accepted proof and redaction.

## Lifecycle Done Gate

Before a slice is complete, answer:

1. Which object changed state?
2. What user action caused it?
3. What gate allowed it?
4. What edge case blocks it?
5. What test or smoke path proves it?

If those answers are not clear, the slice is not ready.
