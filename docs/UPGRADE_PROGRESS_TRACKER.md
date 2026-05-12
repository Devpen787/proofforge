# ProofForge Upgrade Progress Tracker

Use this as the working checklist for the OpenResearch-inspired product polish.
It defines where the work starts, where it ends, and how progress is measured.

Source docs:

- [`PRODUCT_IMPLEMENTATION_REGISTRY.md`](./PRODUCT_IMPLEMENTATION_REGISTRY.md)
- [`OPENRESEARCH_PRODUCT_UPGRADE_PLAN.md`](./OPENRESEARCH_PRODUCT_UPGRADE_PLAN.md)
- [`PRODUCT_STORYBOARD.md`](./PRODUCT_STORYBOARD.md)
- [`JOURNEYS.md`](./JOURNEYS.md)

## Finish Line

The upgrade is done when a desktop user can complete the full ProofForge journey
without confusion:

```text
Registry
-> Proof Node Setup
-> Work to Prove
-> Proof Contract
-> Proof Node Session
-> Evidence Packet
-> Maintainer Review
-> Credit Ledger
-> Public Proof
```

And the product feels like:

```text
a contribution registry for useful project work
```

Not:

```text
a dashboard made of explainer cards
```

## Progress Status Key

| Status         | Meaning                                            |
| -------------- | -------------------------------------------------- |
| `Not started`  | No upgrade pass has been applied yet.              |
| `In progress`  | Screen is being edited or partially improved.      |
| `Needs review` | Code changed; browser/product review still needed. |
| `Blocked`      | Needs a product decision or dependency.            |
| `Done`         | Passes visual, journey, and automated gates.       |

## Upgrade Phases

| Phase | Area                      | Start condition             | Done condition                                     | Status |
| ----- | ------------------------- | --------------------------- | -------------------------------------------------- | ------ |
| 1     | Registry Home             | Route map agreed            | Home feels like a live contribution registry       | Done   |
| 2     | Work Inventory            | Registry Home stable        | Work rows are distinct, scannable, and proofable   | Done   |
| 3     | Projects Command Room     | Work model stable           | Project context, open work, and proof ledger align | Done   |
| 4     | Proof Flow Alignment      | Main journey screens stable | UI labels, demo script, and smoke test match       | Done   |
| 5     | Credit / Passport / Proof | Acceptance flow stable      | Accepted value and public proof feel durable       | Done   |
| 6     | Full Product QA           | All screen passes complete  | Browser walkthrough + full gates pass              | Done   |

## Route Coverage Matrix

| Route               | Product role                  | Upgrade phase | Visual gate | Journey gate | Test gate | Status |
| ------------------- | ----------------------------- | ------------- | ----------- | ------------ | --------- | ------ |
| `#opportunity`      | Contribution Registry         | 1             | Passed      | Passed       | Passed    | Done   |
| `#agent-setup`      | Proof node identity           | 4             | Passed      | Passed       | Passed    | Done   |
| `#first-run`        | Optional first-run bridge     | 4             | Passed      | Passed       | Passed    | Done   |
| `#projects`         | Project registry and ledger   | 3             | Passed      | Passed       | Passed    | Done   |
| `#work-queue`       | Work to Prove                 | 2             | Passed      | Passed       | Passed    | Done   |
| `#mission-detail`   | Proof contract                | 4             | Passed      | Passed       | Passed    | Done   |
| `#run`              | Proof node session            | 4             | Passed      | Passed       | Passed    | Done   |
| `#case-file`        | Evidence packet               | 4             | Passed      | Passed       | Passed    | Done   |
| `#maintainer`       | Review queue                  | 4             | Passed      | Passed       | Passed    | Done   |
| `#my-work`          | Credit ledger                 | 5             | Passed      | Passed       | Passed    | Done   |
| `#builder-passport` | Portable contribution history | 5             | Passed      | Passed       | Passed    | Done   |
| `#earnings`         | Payout ledger                 | 5             | Passed      | Passed       | Passed    | Done   |
| `#trust-center`     | Trust and audit               | 5             | Passed      | Passed       | Passed    | Done   |
| `#public-proof`     | Public proof record           | 5             | Passed      | Passed       | Passed    | Done   |
| `#settings`         | Connections and readiness     | 5             | Passed      | Passed       | Passed    | Done   |
| `#help`             | Education and caveats         | 5             | Passed      | Passed       | Passed    | Done   |

## Per-Screen Done Checklist

A route cannot move to `Done` until all of these are true:

- One dominant object is visible.
- One primary next action is obvious.
- Repeated data is a table or dense list, not loose card stacks.
- Copy is short and user-facing.
- Source, agent, proof, acceptance, and value are clear where relevant.
- No private/internal process notes appear.
- No fake claims about automatic payout, GitHub writeback, or on-chain proof.
- No horizontal overflow on desktop.
- Demo script labels match visible button labels.
- Smoke test still covers the route.

## Journey Done Checklist

The full upgrade cannot move to `Done` until these journeys work:

| Journey                   | Required path                                               | Status |
| ------------------------- | ----------------------------------------------------------- | ------ |
| Contributor / agent owner | Setup -> choose work -> run -> submit -> accepted -> credit | Done   |
| Project steward           | Projects -> publish/import work -> see proof ledger         | Done   |
| Maintainer / reviewer     | Review packet -> accept/revise/reject -> value update       | Done   |
| Public viewer             | Open public proof -> understand accepted result             | Done   |

## Automated Gates

Run these before a phase is marked done:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run smoke:web
```

## Browser Gate

After automated gates pass, manually click through on desktop:

```text
#opportunity
-> #agent-setup
-> #work-queue
-> #mission-detail
-> #run
-> #case-file
-> #maintainer
-> #my-work
-> #public-proof
-> #projects
-> #builder-passport
-> #settings
-> #help
```

Record any issue as:

```text
Route:
Problem:
Why it matters:
Fix:
Status:
```

## Starting Point

Start with Phase 1: `#opportunity`.

Reason:

- It sets the product metaphor.
- It is the first screen judges/users see.
- If Home does not feel like a contribution registry, the rest of the app feels
  like disconnected workflow screens.

## Ending Point

End after Phase 6 when:

- every route row is `Done`
- every journey row is `Done`
- the demo script matches the UI
- automated gates pass
- desktop browser walkthrough passes
- no core screen feels like a generic card dashboard
