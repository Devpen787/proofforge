# ProofForge Acceptance Matrix

This matrix turns the journeys and lifecycle into build gates. A screen or slice is not done because it looks better. It is done when the intended user can complete the job, the right object state changes, and the claim can be tested.

Use with:

- [`OPERATING_GUIDE.md`](./OPERATING_GUIDE.md)
- [`CONTRIBUTION_GRAPH.md`](./CONTRIBUTION_GRAPH.md)
- [`JOURNEYS.md`](./JOURNEYS.md)
- [`LIFECYCLE_MAP.md`](./LIFECYCLE_MAP.md)
- [`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md)
- [`WORK_SOURCE_QUALIFICATION.md`](./WORK_SOURCE_QUALIFICATION.md)
- [`ETHEREUM_WEB3_BOUNTY_INTEGRATION.md`](./ETHEREUM_WEB3_BOUNTY_INTEGRATION.md)

## Global Acceptance Rules

Every product slice must satisfy:

| Gate                | Requirement                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| User clarity        | A first-time user can identify the next primary action in under 5 seconds.                      |
| One job             | The screen has one immediate question and one dominant CTA.                                     |
| State truth         | UI labels match lifecycle state; no fake paid/accepted/integrated claims.                       |
| Safety              | External posts, PRs, payments, secrets, and private data remain blocked without approval.       |
| Proof               | Evidence, verifier, privacy, and security state appear before submission.                       |
| Proof Pack          | The slice strengthens the atomic Proof Pack, not a generic dashboard or task board.             |
| Payout              | Earned and released payout are distinct.                                                        |
| Value terms         | User can see what they are paid/credited for, by whom, and how release/collection works.        |
| Web3/bounty truth   | Wallet, bounty, tx, grant, and treasury references are labeled as live, modeled, or future.     |
| Source truth        | Runnable work has source, project, acceptance owner, proof requirement, and value path.         |
| Source requirements | Source/bounty submission requirements are visible before run and checked in the Proof Pack.     |
| Contribution graph  | The screen makes clear whether the user is seeing personal work, project work, or public proof. |
| Agent rollup        | Agent/node work rolls up to the correct owner or explicit split rule.                           |
| Maintenance         | Durable claims include known limits or last-verified/maintenance state where relevant.          |
| Ownership           | Credit, benefit, payout, and ownership are never blurred.                                       |
| Recovery            | Empty, blocked, failed, revision, and rejected states have a next action.                       |
| Testability         | There is a unit, integration, or smoke test path for the claim.                                 |

## Journey A: First-Time Contributor

| Step | Screen             | User action                  | Required state change                                   | Acceptance criteria                                                                                                                                   | Test / proof                        |
| ---- | ------------------ | ---------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| A1   | Home               | Start safest proof           | route to Agent Setup or First Run                       | one obvious CTA; agent/node status visible; no crowded process wall                                                                                   | smoke: home loads and CTA navigates |
| A2   | Agent / Node Setup | Register / confirm node      | agent `unregistered -> registered`                      | shows owner, identity ref, allowed actions, blocked actions                                                                                           | route smoke and UI assertion        |
| A3   | Opportunities      | Review mission               | route to Mission Detail                                 | ready missions are separate from Work Leads; each mission shows source, project, owner, risk, value path, runtime                                     | route smoke, mission data test      |
| A4   | Mission Detail     | Run in sandbox               | mission `ready -> running`; route to Runner             | user sees what must be proven, acceptance owner, funder/value path, recipient, collection method, source/bounty requirements, allowed/blocked actions | mission contract tests, smoke click |
| A5   | Runner             | Approve/review packet        | run `running -> packet_ready`; packet created           | local evidence-only copy; timeline; verifier trace; output preview                                                                                    | runner tests, smoke journey         |
| A6   | Case File          | Submit to maintainer         | packet `verified/approved -> submitted`                 | maintainer summary, artifacts, privacy/security, source/bounty requirements checklist, shared/private split; duplicate submit blocked                 | evidence tests, smoke journey       |
| A7   | Maintainer Review  | Accept & mark earned         | packet `submitted -> accepted`; payout `none -> earned` | decision card shows what was proven, confidence, risk, who receives credit/payout, payout if accepted                                                 | payment tests, smoke journey        |
| A8   | My Work / Home     | Release payout or view proof | payout `earned -> released` when release clicked        | earned/released distinction visible; collection method visible; public proof only after accepted                                                      | payment tests, smoke journey        |

Edge acceptance:

| Edge                  | Acceptance criteria                                                           |
| --------------------- | ----------------------------------------------------------------------------- |
| No agent registered   | primary run action routes to setup or blocks with repair action               |
| Mission blocked       | run CTA disabled or routes to safer mission                                   |
| Verifier fails        | Case File cannot be maintainer-ready                                          |
| Secret detected       | submission requires redaction/review                                          |
| Duplicate accept      | payout is not duplicated                                                      |
| Value path unknown    | do not show cash reward; keep as credit-only or needs-value-path              |
| Onchain receipt shown | must be linked to accepted proof or clearly marked as external/reference only |

## Journey B: Returning Contributor / Agent Owner

| Step | Screen  | User action           | Required state change               | Acceptance criteria                                                  | Test / proof                 |
| ---- | ------- | --------------------- | ----------------------------------- | -------------------------------------------------------------------- | ---------------------------- |
| B1   | Home    | Open current work     | route to My Work or current item    | Home shows next action, not every active item                        | smoke: nav to My Work        |
| B2   | My Work | Continue item         | route to relevant contextual screen | rows sorted by needs-action; blocked/revision items visible          | component or smoke assertion |
| B3   | My Work | Resolve revision      | revision state routes to Case File  | revision reason visible; user sees what to fix                       | smoke journey or state test  |
| B4   | My Work | Release earned payout | payout `earned -> released`         | release disabled until earned; released state updates paid-out total | payment tests                |

Edge acceptance:

| Edge                           | Acceptance criteria                        |
| ------------------------------ | ------------------------------------------ |
| Nothing active                 | show one recommended opportunity           |
| Multiple projects              | every row includes project and next action |
| Payout earned but not released | copy never says paid                       |

## Journey C: Project Steward

| Step | Screen           | User action        | Required state change                              | Acceptance criteria                                            | Test / proof                |
| ---- | ---------------- | ------------------ | -------------------------------------------------- | -------------------------------------------------------------- | --------------------------- |
| C1   | Projects         | Start project      | project `draft -> active/recruiting`               | project has purpose, lanes, steward, and one next action       | project model tests         |
| C2   | Projects         | Suggest work       | Work Lead created                                  | work appears as Work Lead, not Mission                         | source/mission tests        |
| C3   | Work Lead Triage | Ask clarification  | lead remains `needs_triage`                        | missing data is visible and conversion stays blocked           | mission conversion tests    |
| C4   | Work Lead Triage | Convert to mission | lead `mission_ready -> converted`; mission `ready` | conversion only allowed when gates pass                        | `canConvertWorkLead` tests  |
| C5   | Projects         | Invite contributor | pending member/invite created                      | invite state visible; not counted as active unless accepted    | project tests               |
| C6   | Projects         | Attach agent       | agent attached to project                          | allowed/blocked actions visible; no autonomous control implied | project tests, UI smoke     |
| C7   | Projects         | View ledger        | accepted proof entry visible                       | ledger shows accepted proof, not raw attempts                  | evidence/public proof tests |

Edge acceptance:

| Edge                | Acceptance criteria                                            |
| ------------------- | -------------------------------------------------------------- |
| No acceptance owner | lead cannot convert                                            |
| No funding pool     | mission can be reputation/benefit-only but cannot promise cash |
| Agent mismatch      | attach flow shows blocked permission reason                    |
| Empty project       | primary CTA is Suggest Work or Invite, not a wall of metrics   |

## Journey D: Work Lead Triage

| Step | Screen           | User action         | Required state change             | Acceptance criteria                                                                                                     | Test / proof          |
| ---- | ---------------- | ------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------- |
| D1   | Opportunities    | Import GitHub issue | lead `imported` or `needs_triage` | import creates Work Lead and preserves source URL, repo, issue owner, and source type                                   | `import:github` tests |
| D2   | Work Lead Detail | Analyze/clarify     | lead fields updated               | proofability, risk, source owner, acceptance owner, reward/value path, source/bounty requirements, missing info visible | source/mission tests  |
| D3   | Work Lead Detail | Convert             | mission created                   | missing fields are zero; desired evidence, project, acceptance owner, and value path exist                              | conversion tests      |
| D4   | Work Queue       | Run mission         | route to Mission Detail           | converted mission appears as ready opportunity                                                                          | route smoke           |

Edge acceptance:

| Edge             | Acceptance criteria                             |
| ---------------- | ----------------------------------------------- |
| Duplicate source | show existing lead/mission instead of duplicate |
| Low proofability | recommend reject or clarification               |
| Private repo     | evidence-only or blocked until policy exists    |
| External payout  | label external; do not imply ProofForge paid    |

## Journey E: Maintainer / Reviewer

| Step | Screen            | User action      | Required state change                  | Acceptance criteria                                                       | Test / proof            |
| ---- | ----------------- | ---------------- | -------------------------------------- | ------------------------------------------------------------------------- | ----------------------- |
| E1   | Maintainer Review | Open packet      | route to Case File or review detail    | card shows proof summary, risk, confidence, artifacts, payout if accepted | smoke route             |
| E2   | Maintainer Review | Accept           | packet accepted; earned payout created | duplicate accept blocked; payout status `earned`                          | payment tests           |
| E3   | Maintainer Review | Request revision | packet `needs_revision`                | structured reason captured and contributor next action exists             | evidence/app state test |
| E4   | Maintainer Review | Reject           | packet `rejected`                      | reason visible; no earned payout created                                  | payment/evidence tests  |

Edge acceptance:

| Edge                  | Acceptance criteria                       |
| --------------------- | ----------------------------------------- |
| Unauthorized reviewer | decision disabled with clear owner        |
| Privacy issue         | accept blocked or warning requires action |
| Already accepted      | action disabled and existing payout shown |

## Journey F: Sponsor / Funder

| Step | Screen         | User action         | Required state change           | Acceptance criteria                                 | Test / proof        |
| ---- | -------------- | ------------------- | ------------------------------- | --------------------------------------------------- | ------------------- |
| F1   | Project Ledger | View pool           | none                            | committed, earned, released, available are distinct | visual/UI assertion |
| F2   | Payout row     | Release payout      | payout `earned -> released`     | only earned payout can release                      | payment tests       |
| F3   | Ledger         | Export/view records | export route or artifact exists | export clearly marked manual/accounting in MVP      | future/optional     |

Edge acceptance:

| Edge               | Acceptance criteria                                |
| ------------------ | -------------------------------------------------- |
| Pledged not funded | label pledged, not escrowed                        |
| External payout    | mark external method                               |
| Dispute            | show disputed state without erasing accepted proof |

## Journey G: Public Viewer

| Step | Screen       | User action          | Required state change           | Acceptance criteria                                         | Test / proof        |
| ---- | ------------ | -------------------- | ------------------------------- | ----------------------------------------------------------- | ------------------- |
| G1   | Public Proof | Open accepted proof  | none                            | accepted status, project, mission, accepted by/date visible | public packet tests |
| G2   | Public Proof | Inspect artifacts    | none                            | only public-safe artifacts visible                          | public packet tests |
| G3   | Public Proof | Open project/context | route to project/public context | private logs and internal notes hidden                      | smoke or visual QA  |

Edge acceptance:

| Edge                | Acceptance criteria                         |
| ------------------- | ------------------------------------------- |
| Packet not accepted | no public proof, or unavailable/draft state |
| Private artifact    | redacted/withheld state                     |
| Project private     | public page blocks or minimizes details     |

## Integration Acceptance Labels

Every integration or sponsor claim must be labeled:

| Label                            | Acceptance requirement                                    |
| -------------------------------- | --------------------------------------------------------- |
| Live in demo                     | runnable in the local demo or deployed app during judging |
| Implemented but credential-gated | code exists, tests pass, docs explain required env vars   |
| Modeled locally                  | represented in local data only; no live claim             |
| Planned roadmap                  | documented as future; not part of demo proof              |
| Removed from submission story    | not shown or claimed                                      |

Current intended labels:

| Capability                        | Label                                                           |
| --------------------------------- | --------------------------------------------------------------- |
| GitHub issue import               | Live in demo                                                    |
| Local runner artifacts            | Live in demo                                                    |
| Verifier result                   | Live in demo                                                    |
| Evidence packet/case file         | Live in demo                                                    |
| Local agent identity              | Modeled locally / live local demo                               |
| Local coordination trace          | Modeled locally / live local demo                               |
| Earned/released payout accounting | Live in demo                                                    |
| 0G storage                        | Implemented but credential-gated unless credentials are present |
| Wallet/payout recipient fields    | Modeled locally unless wallet connection is implemented         |
| Bounty/DAO/grant source metadata  | Modeled locally / manual source reference                       |
| Onchain receipt/tx hash reference | Modeled locally unless chain verification is implemented        |
| ENS identity                      | Planned roadmap unless implemented and verified                 |
| AXL communication                 | Planned roadmap unless implemented and verified                 |
| Wallet collection                 | Planned roadmap unless implemented and verified                 |
| NFT/proof badge issuance          | Planned roadmap unless implemented and verified                 |
| Legal ownership/revenue share     | Removed from submission story unless explicit terms exist       |
| Credit pooling/API-key donation   | Removed from submission story                                   |
| Prediction markets/dividends      | Removed from submission story                                   |

## Required Verification Before "Done"

Run these before claiming a product slice works:

```text
npm run format:check
npm run lint
npm run typecheck
npm test
npm run smoke:web
```

For UI slices, also do a browser click-through for the relevant journey and capture screenshots when the layout changed substantially.

## Slice Review Template

Use this before moving on:

```text
Slice:
Primary user:
Journey step:
Contribution graph view:
Object state changed:
Gate enforced:
Primary CTA:
Edge cases covered:
Value/source questions answered:
Tests run:
Browser path checked:
Remaining risk:
```

If this template cannot be filled, the slice is not done.
