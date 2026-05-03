# AI-Native Strategy Crosswalk

> Reference only. This is a public-safe synthesis of the private strategy memo
> `PROOFFORGE_AI_NATIVE_WORK_RESEARCH_AND_PRODUCT_STRATEGY.md`.
> Do not copy the private memo into the public repo without a separate rewrite.
> The current source of truth remains [`../OPERATING_GUIDE.md`](../OPERATING_GUIDE.md).

## Cross-Reference Summary

The private memo strongly supports the current direction:

```text
ProofForge is the trust, proof, and credit layer for AI-native building.
```

It reinforces the current product model:

```text
connected sources
-> scoped work
-> bounded agent/node execution
-> evidence
-> independent verification
-> human decision
-> credit, benefits, payout, and public proof
```

It also sharpens three points:

1. The atomic product unit should be a `Proof Pack`.
2. `Need` should be the upstream problem before Work Lead.
3. Maintenance must count as part of durable contribution value.

## Alignment With Active Docs

| Private memo concept                                                  | Active doc match                                                  | Alignment | Required adjustment                                         |
| --------------------------------------------------------------------- | ----------------------------------------------------------------- | --------- | ----------------------------------------------------------- |
| Golden thread: Needs -> Work -> Proof -> Credit -> Trust -> More Work | `CONTRIBUTION_GRAPH.md`, `OPERATING_GUIDE.md`                     | Strong    | Add Need and Proof Pack vocabulary explicitly               |
| AI lowers creation cost, coordination becomes scarce                  | `WORK_SOURCE_QUALIFICATION.md`, `JOURNEYS.md`                     | Strong    | Keep Work Lead gate strong                                  |
| Proof-backed contribution records                                     | `VALUE_AND_OWNERSHIP_MODEL.md`, `LIFECYCLE_MAP.md`                | Strong    | Treat Proof Pack as atomic trust unit                       |
| Maintainers need evidence, not agent noise                            | `OPERATING_GUIDE.md`, `ACCEPTANCE_MATRIX.md`                      | Strong    | Maintainer/sponsor is a primary trust customer              |
| Agent output is not trusted contribution by default                   | `AGENT_ORCHESTRATION_RESEARCH.md`, `OPERATING_GUIDE.md`           | Strong    | Keep independent verifier separate                          |
| Credit is role-aware                                                  | `VALUE_AND_OWNERSHIP_MODEL.md`, `CONTRIBUTION_GRAPH.md`           | Partial   | Add role-aware credit as future model beyond MVP ledger     |
| Maintenance matters                                                   | Not yet explicit enough                                           | Gap       | Add Maintenance Record and last-verified state              |
| Web3/Ethereum as adapter layer                                        | `AGENT_ORCHESTRATION_RESEARCH.md`, `VALUE_AND_OWNERSHIP_MODEL.md` | Strong    | Keep wallet/attestation optional until live                 |
| Builder Passport                                                      | `CONTRIBUTION_GRAPH.md`                                           | Partial   | Treat as future profile built from accepted proof           |
| Need Board                                                            | `WORK_SOURCE_QUALIFICATION.md`                                    | Partial   | Treat as future source-backed registry, not MVP marketplace |

## Vocabulary Decisions

### Proof Pack

Use `Proof Pack` as the product-level atomic trust unit.

Definition:

```text
Proof Pack = scoped need/work + mission terms + run evidence + verifier result + human approval + maintainer-safe case file + credit/value state.
```

Related terms:

| Term            | Meaning                                                       |
| --------------- | ------------------------------------------------------------- |
| Evidence Packet | data artifact produced by runner/verifier                     |
| Case File       | maintainer review surface for an Evidence Packet / Proof Pack |
| Public Proof    | public-safe view after acceptance                             |
| Proof Ledger    | accepted Proof Packs and their credit/value state             |

This lets the UI say `Proof Pack` without losing the engineering precision of `Evidence Packet`.

### Need

`Need` is the upstream problem or request.

MVP mapping:

```text
Need -> Work Lead
```

Future mapping:

```text
Need -> Claim / Proposal -> Work Lead -> Mission
```

Do not add a generic Need Board before the proof loop works. For MVP, use source-backed Work Leads.

### Builder Passport

`Builder Passport` is the future public/private profile built from accepted proof.

MVP mapping:

```text
My Work + Proof Ledger + Public Proof
```

Future mapping:

```text
Builder Passport = connected accounts + accepted Proof Packs + role-aware credit + payouts + benefits + maintenance history.
```

### Maintenance Record

Maintenance is a contribution state, not polish.

Future field group:

- owner
- last verified
- open risks
- dependency/security status
- funding state
- handoff or sunset plan

MVP should at least show known limits and last verified date when a public proof or project ledger entry claims durable value.

## Current Product Doctrine Confirmed

The private memo confirms these active rules:

- Proof before payout.
- Credit, payout, benefits, ownership, and public proof are distinct.
- Work must be source-backed and proofable before agents run.
- Agents can create attempts; ProofForge creates accepted contribution records.
- Human responsibility stays visible.
- Verification must be independent from the builder/runner claim.
- Web3 should remain an adapter layer for portability, attestations, storage, funding, and settlement.
- Wallets are optional until settlement or portable attestations are live.
- Do not reward raw output volume.
- Do not track every prompt or keystroke by default.

## Product Gaps Exposed

| Gap                               | Why it matters                                                             | Current answer                                        |
| --------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- |
| Proof Pack naming not explicit    | The atomic product unit needs one memorable name                           | Add vocabulary to operating docs                      |
| Need not modeled separately       | Useful work starts as need, not task                                       | Treat Need as upstream Work Lead for MVP              |
| Role-aware credit not implemented | Meaningful work includes scoping, review, testing, validation, maintenance | MVP uses simple credit ledger; future adds roles      |
| Maintenance not surfaced enough   | AI makes demos cheap but durable value hard                                | Add maintenance state to roadmap and public proof     |
| Builder Passport absent           | Cross-source contribution needs a home                                     | MVP uses My Work / Proof Ledger; future profile       |
| GitHub PR proof not first-class   | AI-assisted PRs are a strong wedge                                         | MVP can use issues/docs; add PR verifier later        |
| AI-use disclosure level undecided | Too little reduces trust; too much becomes surveillance                    | Record role/tool/commands/artifacts, not full prompts |

## Implementation Implications

### MVP Should Emphasize

```text
GitHub/source-backed Work Lead
-> Mission Contract
-> local runner
-> verifier result
-> Proof Pack / Case File
-> maintainer decision
-> earned payout or credit
-> project proof ledger
```

### UI Should Say

- Proof Pack
- accepted proof
- credit recipient
- earned payout
- released payout
- benefit unlocked
- source-backed work
- maintained / last verified where relevant

### UI Should Avoid

- generic bounty board
- generic project management
- proof theater badges without evidence
- AI swarm language
- prompt archive UI
- crypto reputation protocol framing before proof loop works

## Research Claims Not Revalidated In This Pass

This crosswalk did not independently revalidate every academic or market source in the private memo. Treat those citations as strategy background until a dedicated research-verification pass is run.

## Decision

Adopt the memo's core strategy, but keep the hackathon product narrow:

```text
ProofForge is a connected contribution graph whose atomic trust object is the Proof Pack.
The MVP proves one source-backed AI/agent-assisted work item end to end.
```
