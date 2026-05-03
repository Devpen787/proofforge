# ProofForge Work Source Qualification

Use this with [`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md),
[`LIFECYCLE_MAP.md`](./LIFECYCLE_MAP.md), [`ACCEPTANCE_MATRIX.md`](./ACCEPTANCE_MATRIX.md), and
[`ETHEREUM_WEB3_BOUNTY_INTEGRATION.md`](./ETHEREUM_WEB3_BOUNTY_INTEGRATION.md). This document answers:

```text
Where does work come from?
Who is behind it?
What product/project is it for?
Who accepts proof?
Who funds or rewards it?
How do we know it makes sense to work on?
How do we follow up?
```

## Source Principle

ProofForge should not show random tasks. It should show qualified project work.

Every piece of work starts as a source-backed Work Lead.

```text
Need
-> Source
-> Work Lead
-> Qualification
-> Mission
-> Accepted Proof
```

For MVP, `Need` and `Work Lead` can be represented together. Later, a Need Registry can separate problem discovery from mission execution.

```text
Source
-> Work Lead
-> Qualification
-> Mission
-> Accepted Proof
```

Raw work cannot skip qualification.

## Source Types

Supported or planned source categories:

| Source                     | Examples                                           | MVP status                            |
| -------------------------- | -------------------------------------------------- | ------------------------------------- |
| GitHub issue               | open-source bug, docs issue, reproduction request  | Live in demo                          |
| GitHub PR                  | verification request, regression check             | Planned or modeled unless implemented |
| Docs URL                   | install guide, quickstart, tutorial                | Modeled/local fixture                 |
| Foundation backlog         | ecosystem grant/backlog request                    | Modeled                               |
| Marketplace task           | external QA or agent work                          | Modeled                               |
| Bounty / grant URL         | Gitcoin, DAO, foundation, grant, or sponsor link   | Manual/reference in V1                |
| Onchain receipt            | transaction hash or receipt URL for released value | Manual/reference in V1                |
| Private team request       | internal QA/check request                          | Planned/model only                    |
| Project steward suggestion | work created inside a ProofForge project           | Modeled                               |

## Required Source Record

Every Work Lead needs a source record.

| Field                  | Meaning                                                                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sourceType             | GitHub issue, PR, docs URL, foundation backlog, marketplace task, private request                                                                                            |
| sourceUrl              | canonical URL or internal project reference                                                                                                                                  |
| sourceOwner            | person/org/repo/project behind the request                                                                                                                                   |
| projectName            | project/product this work improves                                                                                                                                           |
| projectHandle          | normalized project reference                                                                                                                                                 |
| repository             | repo when applicable                                                                                                                                                         |
| importedAt             | timestamp                                                                                                                                                                    |
| importedBy             | contributor/steward/system                                                                                                                                                   |
| rawRequest             | original request text                                                                                                                                                        |
| acceptanceOwner        | who can accept proof                                                                                                                                                         |
| rewardPath             | cash, external, credit, reputation, benefit, none                                                                                                                            |
| bountyUrl              | optional bounty, grant, DAO proposal, or external value source URL                                                                                                           |
| rewardAsset            | USD, credits, reputation, ETH, USDC, project token, or external unit                                                                                                         |
| releaseMethod          | manual, external platform, wallet, credits, reputation-only                                                                                                                  |
| custodyStatus          | whether ProofForge controls funds; V1 default is no custody                                                                                                                  |
| submissionRequirements | source/bounty rules that must be satisfied before review; examples include public repo, setup instructions, demo, deployed contract, feedback file, protocol-use explanation |
| requiredArtifacts      | files or proof objects the source expects; examples include README, test logs, architecture diagram, tx link, `FEEDBACK.md`, public demo                                     |
| proofability           | score and reason                                                                                                                                                             |
| missing                | missing information                                                                                                                                                          |
| risk                   | low, medium, high                                                                                                                                                            |
| recommendation         | ask clarification, convert, reject, evidence-only                                                                                                                            |

## Qualification Questions

Before work becomes a Mission, ProofForge must answer:

1. What product/project is this for?
2. Who is the maintainer, steward, buyer, or acceptance owner?
3. What needs to be proven?
4. What evidence would convince the owner?
5. Can a local agent/node safely do it?
6. What actions are allowed?
7. What actions are blocked?
8. What value exists if accepted?
9. Who receives credit or payout?
10. What source/bounty submission requirements must be met?
11. What follow-up is needed after submission?

If these are unclear, the item remains a Work Lead.

## GitHub Source Qualification

GitHub is the strongest MVP source because it gives:

- repo owner
- repo name
- issue number
- issue author
- labels
- issue body
- state
- canonical URL
- public follow-up thread

ProofForge should extract:

```text
owner/repo
issue number
issue author
labels
raw body
source URL
missing reproduction/environment details
proofability score
recommended evidence
blocked actions
```

GitHub Work Lead acceptance owner:

- default: issue author or repo maintainer
- better: explicit maintainer/steward chosen by project
- if unknown: lead cannot become mission-ready

GitHub follow-up:

- proof packet can produce a maintainer-ready summary
- public comment or PR remains blocked until human approval
- MVP does not post automatically

## Project Matching

Work should attach to a project before or during qualification.

Matching signals:

- repository owner/repo
- project handle
- source URL domain
- labels or lane names
- steward selection
- existing project source list

If no project matches:

```text
Create Unassigned Work Lead
-> ask user to choose or create project
-> block mission conversion until project/acceptance owner is known
```

## Proofability Score

Proofability measures whether the work can produce evidence.

Positive signals:

- clear reproduction steps
- expected vs actual behavior
- environment details
- command or code block
- public repo
- bug/docs/test label
- acceptance owner known
- reward/benefit path known

Negative signals:

- no reproduction path
- vague request
- private repo with no access policy
- no acceptance owner
- no evidence shape
- requires external posting
- requires payment/spend
- high security/privacy risk

Proofability labels:

| Score  | Meaning                  | Default action                       |
| ------ | ------------------------ | ------------------------------------ |
| 85-100 | Mission-ready            | Convert if all required fields exist |
| 70-84  | Proofable but incomplete | Ask clarification or evidence-only   |
| 40-69  | Needs triage             | clarify or rewrite                   |
| 0-39   | Not proofable            | reject or park                       |

Score alone is not enough. Required fields must exist.

## Work Lead To Mission Gate

Required before conversion:

```text
project known
source known
acceptance owner known
objective clear
required proof clear
source/bounty requirements known when applicable
risk known
allowed/blocked actions known
value path known
missing info resolved
```

Blocked conversion examples:

| Missing                | Why blocked                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| acceptance owner       | nobody can accept proof                                                    |
| proof requirement      | agent does not know what evidence to produce                               |
| submission requirement | user cannot tell whether the external bounty/source will accept the packet |
| project/source         | cannot track value or follow up                                            |
| reward/benefit path    | user cannot know why to do it                                              |
| environment            | proof may be invalid                                                       |
| private access policy  | agent may expose or misuse data                                            |

## Value Source Qualification

Every source-backed lead must answer:

```text
Paid by whom?
For what accepted proof?
Through which method?
What happens if accepted?
What happens if rejected?
```

Value source types:

| Type            | Meaning                                         |
| --------------- | ----------------------------------------------- |
| Project pool    | project has local reward pool or sponsor budget |
| External buyer  | payout tracked outside ProofForge               |
| Foundation      | foundation/community reward or credits          |
| Bounty/grant    | external bounty, grant, or DAO reward path      |
| Onchain receipt | released payout or sponsor payment reference    |
| Reputation-only | no cash; accepted proof builds record           |
| Benefit-only    | unlocks access/status/usage right               |
| None/unknown    | cannot be advertised as paid                    |

If value is unknown:

```text
Do not show "earn $X".
Show "credit/reputation only" or "needs reward path".
```

## Follow-Up Model

Each mission needs a follow-up path.

| Follow-up              | Meaning                           |
| ---------------------- | --------------------------------- |
| maintainer inbox       | packet reviewed inside ProofForge |
| GitHub comment draft   | summary prepared but not posted   |
| external buyer review  | buyer accepts outside ProofForge  |
| project steward review | project owner accepts proof       |
| public proof           | accepted proof can be shared      |

Human approval is required before:

- GitHub comments
- PRs
- external submissions
- public proof creation if privacy review is incomplete
- payout release

## Discovery Experience

The product should support three discovery modes.

### 1. Recommended Work

For contributors:

- safe
- fits agent/node capability
- clear reward or credit
- known acceptance owner
- project has purpose

### 2. Project Opportunities

For stewards and contributors:

- grouped by project
- tied to lanes
- shows active/ready/needs-triage
- shows project impact

### 3. Import / Suggest Work

For stewards:

- paste GitHub issue or external task
- analyze
- show missing info
- create Work Lead
- convert only when ready

## Source Trust Levels

| Trust level             | Meaning                                           | UI treatment                                    |
| ----------------------- | ------------------------------------------------- | ----------------------------------------------- |
| Verified project source | source belongs to a project/steward in ProofForge | can appear as recommended work                  |
| Public OSS source       | public GitHub issue/repo with clear proof         | can appear as Work Lead or Mission if qualified |
| External source         | marketplace/buyer/foundation/imported task        | requires acceptance and value path clarity      |
| Private source          | private team request                              | evidence-only unless policy exists              |
| Unknown source          | no owner or unclear origin                        | triage only; cannot run                         |

## Objective Criteria For "Makes Sense"

A lead makes sense when:

- it improves a known project/product
- the project has a steward, maintainer, buyer, or acceptance owner
- the evidence can be generated safely
- acceptance creates credit, benefit, or payout
- follow-up is clear
- the mission is small enough to complete and review
- the user can understand why it matters

A lead does not make sense when:

- no one can accept it
- no one benefits from it
- evidence cannot be produced
- reward is fake or unknown but advertised
- the agent would need unsafe access
- the work is too vague to scope

## UI Requirements

Opportunity cards should show:

- title
- project/repo
- source type
- acceptance owner
- value path
- proofability
- risk
- runtime
- one action

Work Lead detail should show:

- raw source summary
- source owner
- project match
- missing info
- recommendation
- conversion gate
- follow-up path

Mission Detail should show:

- what is being proven
- source link
- who accepts it
- who funds/rewards it
- what value is created if accepted
- what the agent can and cannot do

## MVP Acceptance

For the hackathon MVP, we can defend:

- GitHub issue import creates a Work Lead
- Work Lead diagnosis detects missing reproduction/environment details
- proofability and missing fields control conversion
- Mission Detail shows source, acceptance owner, and value path
- no external GitHub action happens without approval
- evidence packet can produce a maintainer-ready follow-up summary

We cannot defend unless implemented:

- automatic GitHub comments
- automatic PRs
- automatic marketplace submission
- verified maintainer identity across all repos
- real external buyer acceptance
- automatic reward settlement

## Done Gate

Before a Work Lead or Mission is shown as runnable, answer:

1. Where did this work come from?
2. What project/product does it improve?
3. Who is behind it?
4. Who accepts proof?
5. What proof is required?
6. What value is created if accepted?
7. Who receives credit or payout?
8. What is missing?
9. What is blocked?
10. What follow-up happens after submission?

If the UI cannot answer those questions, the work is not mission-ready.
