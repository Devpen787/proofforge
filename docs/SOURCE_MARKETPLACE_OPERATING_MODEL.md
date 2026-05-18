# Source And Marketplace Operating Model

Use this with [`WORK_SOURCE_QUALIFICATION.md`](./WORK_SOURCE_QUALIFICATION.md),
[`CONTRIBUTION_GRAPH.md`](./CONTRIBUTION_GRAPH.md), and
[`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md).

## Product Stance

ProofForge is the working surface.

Cell System remains a reference archive for research, marketplace scouting,
templates, and first-dollar experiments. Do not split day-to-day work between
the two systems. Import the useful operating knowledge once, then run the live
work loop in ProofForge.

ProofForge should not become a generic marketplace. It should connect to
marketplaces, repos, bounties, grants, and project backlogs, then turn the work
into accepted proof.

```text
external source
-> Work Lead
-> qualified mission
-> bounded human/agent run
-> PFEP Proof Pack
-> external submission or maintainer review
-> accepted proof
-> credit, payout receipt, reputation, public proof
```

## What Cell System Contributes

Bring these ideas into ProofForge:

- marketplace/source registry
- first-dollar and first-credit operating loops
- agent identity vs wallet vs payout rail distinctions
- bid and proof-of-completion templates
- platform setup checklists
- source scoring and task fit heuristics
- external payout receipt tracking

Do not bring over:

- scratch strategy logs
- Polkadot-specific research unless it becomes a source adapter
- private AgentOps process notes
- broad ecosystem research that does not directly improve source intake,
  mission qualification, proof, acceptance, or ledger state

## Source Classes

| Source class             | Examples                                                | ProofForge role                                              | External authority remains with         |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| GitHub/open-source repos | Logos, Ethereum repos, protocol repos                   | import issue/PR/docs task, qualify mission, prove work       | repo maintainers and GitHub permissions |
| Human bounty rails       | Bountycaster, Gitcoin, grant tasks                      | capture bounty terms, proof, acceptance, receipt             | bounty poster or grant reviewer         |
| Agent gig markets        | NEAR Agent Market, dealwork.ai, toku.agency, ugig.net   | track job, bid, delivered proof, accepted payout state       | marketplace escrow/review system        |
| Agent service stores     | MuleRun, Poe, Agent.ai, Relevance AI, Apify             | track listed service, usage proof, reviews, revenue receipts | platform store and payout provider      |
| Protocol-native services | x402 endpoints, MCP-Hive-style skill markets            | record invocation evidence and payment receipts              | protocol/payment rail                   |
| Project backlogs         | internal projects, public roadmaps, maintainer requests | create work requests and steward review                      | project owner/steward                   |

## Current Marketplace Leads

This table is a working source registry, not an endorsement. Terms change
quickly, so each source needs a fresh setup check before real work.

| Platform                        | Lane                                      | Current read                                                                        | ProofForge fit                                                       | Verification level                                        |
| ------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| NEAR Agent Market               | agent gig market                          | Cell System registered `cellproof` and documented agent identity/payout layers      | strong source for real agent jobs and accepted external work         | prior local setup notes; refresh before use               |
| Bountycaster                    | human bounty rail                         | useful for small social bounties and fast proof-of-completion loops                 | strong first-credit/first-dollar source when poster quality is clear | prior local notes; refresh before use                     |
| Gitcoin / grants                | bounty/grant rail                         | useful for larger contribution or research work                                     | good source intake; slower acceptance cycle                          | known ecosystem; adapter later                            |
| Logos repos                     | open-source repo                          | public GitHub organization and contributor path                                     | strong candidate for repo contribution proof                         | inspect current issues before mission creation            |
| dealwork.ai                     | agent gig market                          | public site describes escrow-protected tasks, AI workers, and `skill.md` onboarding | good candidate for job/task source adapter                           | public website observed; verify account flow              |
| toku.agency                     | agent gig market                          | public job board and Stripe payout messaging appear active                          | good candidate for bid/submission tracking                           | public website/search result observed; verify payout flow |
| ugig.net                        | AI-assisted professional/agent gig market | public gigs, agent accounts, API key flow, crypto payout language                   | good candidate for gig import and submission receipt tracking        | public website observed; verify payouts and API           |
| MuleRun                         | agent service store                       | creator docs describe earnings dashboard and payout threshold                       | good for reusable service listing, less direct per-task proof        | public docs observed; verify creator approval             |
| Poe                             | bot marketplace                           | monetized bot distribution channel                                                  | useful for service revenue proof, not mission-style repo work        | verify current creator terms                              |
| Agent.ai / Relevance AI / Apify | service stores                            | distribution and reusable agent listings                                            | useful for public service proof and reviews                          | verify monetization before treating as earning source     |
| x402 ecosystem                  | payment protocol                          | pay-per-call service lane rather than a marketplace                                 | useful for future invocation receipts and micropayment proof         | adapter later                                             |

## Qualification Rules

A source can become a Work Lead only when it has:

1. a stable source URL
2. a clear requester, maintainer, buyer, steward, or acceptance owner
3. explicit desired output or acceptance criteria
4. a proof path ProofForge can capture
5. a value path, even if the value is reputation or project credit
6. a permission boundary: what the human/agent may and may not do

If any of those are missing, the item stays in `needs_triage`.

## Marketplace-Specific Questions

Every marketplace adapter or manual intake must answer:

1. What is the account layer?
2. What is the agent/service identity?
3. What is the human operator approval point?
4. What is the submission channel?
5. Who accepts or rejects the work?
6. What is the payout rail?
7. What receipt proves payment or credit?
8. What data can ProofForge store publicly?

Do not assume a connected wallet, marketplace account, and payout account are
the same thing.

## Operating Loop For Real Work

1. Find source-backed work from a repo, marketplace, bounty, or project request.
2. Import it as a Work Lead.
3. Score it for proofability, acceptance clarity, risk, and value path.
4. Convert it to a mission only when the proof and owner are clear.
5. Run the work locally or with a bounded proof node.
6. Generate and verify a PFEP Proof Pack.
7. Submit externally through the original platform with human approval.
8. Record the external acceptance or revision state.
9. Record payout, credit, reputation, or receipt state.
10. Publish a public-safe proof view only after privacy review passes.

## First Implementation Target

The first product slice is a source registry and intake path that can handle:

- GitHub issue URL
- marketplace task URL
- bounty/grant URL
- manual project request

It should produce one normalized Work Lead shape and mark the source as:

- `ready_to_qualify`
- `needs_triage`
- `blocked_missing_owner`
- `blocked_missing_proof`
- `blocked_unsafe`

That is the bridge from Cell System research into a real ProofForge workflow.

Current CLI:

```bash
npm run intake:source -- --url https://github.com/owner/repo/issues/123 \
  --owner @maintainer \
  --proof "reproduction logs and environment manifest" \
  --value "project credit"
```

This writes a normalized Work Lead JSON file under `demo-output/imports` and
takes no external action. It does not comment on GitHub, bid on a marketplace
task, submit a bounty, or move funds.
