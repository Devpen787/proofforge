# ProofForge Product Implementation Registry

Use this document before redesigning, renaming, or rearranging product screens.
It connects the current app routes to the intended product journey, then defines
the gates that every upgrade pass must satisfy.

Related source-of-truth docs:

- [`PRODUCT_STORYBOARD.md`](./PRODUCT_STORYBOARD.md)
- [`JOURNEYS.md`](./JOURNEYS.md)
- [`OPENRESEARCH_PRODUCT_UPGRADE_PLAN.md`](./OPENRESEARCH_PRODUCT_UPGRADE_PLAN.md)
- [`WORK_SOURCE_QUALIFICATION.md`](./WORK_SOURCE_QUALIFICATION.md)
- [`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md)
- [`ACCEPTANCE_MATRIX.md`](./ACCEPTANCE_MATRIX.md)

## North Star

ProofForge is the contribution registry for useful project work.

It turns source-backed work into accepted proof so developers and their agents
can earn credit, reputation, payout state, or other project benefits.

The product loop is:

```text
source-backed work
-> proofable mission
-> bounded proof node run
-> evidence packet
-> maintainer acceptance
-> credit / payout / reputation state
-> public-safe proof
```

The upgrade target is not a prettier dashboard. It is a more legible
registry-like product where every route makes one part of that loop obvious.

## Current URL Tree

ProofForge is a hash-routed React app. The current route registry lives in
`apps/web/src/routes.ts`.

| URL hash            | Current label     | Screen file                                      | Nav level  | Current role                         | Upgrade target                      |
| ------------------- | ----------------- | ------------------------------------------------ | ---------- | ------------------------------------ | ----------------------------------- |
| `#opportunity`      | Home              | `apps/web/src/screens/OpportunityScreen.tsx`     | primary    | Home / registry entry                | Contribution Registry               |
| `#agent-setup`      | Agent Setup       | `apps/web/src/screens/AgentSetupScreen.tsx`      | contextual | Register proof node                  | Proof node identity and permissions |
| `#first-run`        | First Run         | `apps/web/src/screens/FirstRunScreen.tsx`        | contextual | Guided onboarding                    | Optional first-run bridge           |
| `#projects`         | Projects          | `apps/web/src/screens/ProjectsScreen.tsx`        | primary    | Project command room                 | Project registry and ledger         |
| `#work-queue`       | Opportunities     | `apps/web/src/screens/WorkQueueScreen.tsx`       | primary    | Source-backed work inventory         | Work to Prove                       |
| `#my-work`          | My Work           | `apps/web/src/screens/MyWorkScreen.tsx`          | primary    | Contributor value tracker            | Credit ledger                       |
| `#builder-passport` | Passport          | `apps/web/src/screens/BuilderPassportScreen.tsx` | primary    | Contributor / agent passport         | Portable contribution identity      |
| `#mission-detail`   | Mission Detail    | `apps/web/src/screens/MissionDetailScreen.tsx`   | contextual | Proof terms                          | Proof contract                      |
| `#run`              | Runner            | `apps/web/src/screens/RunnerScreen.tsx`          | contextual | Bounded execution                    | Proof node session                  |
| `#case-file`        | Case File         | `apps/web/src/screens/CaseFileScreen.tsx`        | contextual | Maintainer-ready evidence packet     | Evidence packet                     |
| `#maintainer`       | Maintainer Review | `apps/web/src/screens/MaintainerScreen.tsx`      | contextual | Review and acceptance decision       | Review queue                        |
| `#earnings`         | Earnings          | `apps/web/src/screens/EarningsScreen.tsx`        | outcome    | Payout and release state             | Payout ledger                       |
| `#trust-center`     | Trust Center      | `apps/web/src/screens/TrustCenterScreen.tsx`     | support    | Safety, policy, boundaries           | Trust and audit                     |
| `#scoreboard`       | Home              | `apps/web/src/screens/OpportunityScreen.tsx`     | legacy     | Alias for home                       | Remove or alias cleanly             |
| `#public-proof`     | Public Proof      | `apps/web/src/screens/PublicProofScreen.tsx`     | outcome    | Shareable accepted proof             | Public proof record                 |
| `#settings`         | Settings          | `apps/web/src/screens/SettingsScreen.tsx`        | secondary  | Connections and operational controls | Integrations, identity, receipts    |
| `#help`             | Help              | `apps/web/src/screens/HelpScreen.tsx`            | secondary  | Education and roadmap                | Product docs and caveats            |

## Target Navigation Model

The current app has enough routes. The upgrade should make their jobs clearer,
not add more top-level surfaces.

Recommended product labels:

| Product area | Current route(s)                             | Purpose                                      |
| ------------ | -------------------------------------------- | -------------------------------------------- |
| Registry     | `#opportunity`, legacy `#scoreboard`         | System overview and next proof action        |
| Projects     | `#projects`                                  | Project context, open work, accepted ledger  |
| Work         | `#work-queue`, `#mission-detail`             | Select and qualify source-backed work        |
| Run          | `#agent-setup`, `#run`                       | Register and operate the bounded proof node  |
| Packet       | `#case-file`, `#public-proof`                | Review, submit, and share evidence           |
| Review       | `#maintainer`                                | Accept, revise, or reject submitted proof    |
| Credit       | `#my-work`, `#earnings`, `#builder-passport` | Track contribution, value, and reputation    |
| Support      | `#settings`, `#help`, `#trust-center`        | Integrations, safety, education, future work |

Do not make every item above a sidebar tab. Primary navigation should remain
small. Context and outcome routes should be reached from the workflow.

## Primary User Journeys

### Contributor / Agent Owner

Goal: find useful work, run a safe proof node, submit evidence, and track value.

```text
Registry
-> Proof Node Setup
-> Work to Prove
-> Proof Contract
-> Proof Node Session
-> Evidence Packet
-> Review
-> Credit Ledger
-> Public Proof / Passport
```

Required visible answers:

- Where did this work come from?
- Who accepts it?
- What does the proof node do?
- What is blocked?
- What evidence was captured?
- What changed after acceptance?

### Project Steward

Goal: publish or connect project work and see accepted contribution progress.

```text
Projects
-> Publish / import work
-> Work to Prove
-> Review queue
-> Project proof ledger
```

Required visible answers:

- What project is this attached to?
- What work is open, active, accepted, or blocked?
- What value or benefit is attached?
- Who accepted which proof?

### Maintainer / Reviewer

Goal: decide quickly without reading raw agent noise.

```text
Review queue
-> Evidence Packet
-> Accept / revise / reject
-> Credit and payout state update
```

Required visible answers:

- What was tested?
- What passed or failed?
- What artifacts exist?
- Were secrets and local paths handled?
- What value is created if accepted?

### Public Viewer

Goal: inspect a public-safe accepted proof.

```text
Public proof link
-> Accepted proof summary
-> Public artifacts
-> Credit / project / acceptance record
```

Required visible answers:

- What was proven?
- Who accepted it?
- What public-safe evidence exists?
- What credit, reputation, or payout state resulted?

## Page Registry

Each screen must have one dominant object, one obvious current state, and one
clear next action. Repeated objects should be rendered as tables or dense lists,
not loose stacks of cards.

| Route               | Dominant object             | Primary action                      | Supporting data surface                   | Must not do                                      |
| ------------------- | --------------------------- | ----------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| `#opportunity`      | Contribution registry state | Start or continue the next proof    | Registry metrics and latest proof/work    | Become a landing page or theory explainer        |
| `#agent-setup`      | Proof node identity         | Register / confirm proof node       | Owner, ENS/wallet, permissions, skills    | Hide blocked actions or pretend autonomy exists  |
| `#first-run`        | Guided first proof path     | Continue setup or work selection    | Minimal first-run checklist               | Duplicate Home permanently                       |
| `#projects`         | Selected project            | Choose/publish useful work          | Open work, active missions, proof ledger  | Become generic project management                |
| `#work-queue`       | Source-backed work item     | Assess / run selected work          | Scannable inventory table/list            | Show empty or indistinguishable opportunity rows |
| `#mission-detail`   | Proof contract              | Authorize bounded run               | Source, acceptance owner, value, risk     | Skip proofability and safety terms               |
| `#run`              | Proof node session          | Review generated packet             | Live output and trace                     | Look like an agent chat room                     |
| `#case-file`        | Evidence packet             | Submit to maintainer                | Summary, artifacts, privacy, receipts     | Overflow, raw-noise default, unclear submit      |
| `#maintainer`       | Submitted proof decision    | Accept, revise, or reject           | Maintainer summary and value impact       | Make acceptance feel automatic or fake           |
| `#my-work`          | Contributor credit record   | Continue / release / view proof     | Active work and accepted ledger           | Mix pending work with accepted value carelessly  |
| `#builder-passport` | Portable contribution graph | Inspect / connect proof history     | Observed vs accepted contribution states  | Count observed history as accepted credit        |
| `#earnings`         | Payout state                | Prepare / record release            | Earned, released, receipt references      | Imply automatic settlement when manual           |
| `#trust-center`     | Safety boundary             | Inspect / configure trust posture   | Policies, blocked actions, audit status   | Push V2/V3 theory into core workflow             |
| `#public-proof`     | Public accepted proof       | Copy/share public proof             | Redacted artifacts and acceptance summary | Expose private logs, local paths, or secrets     |
| `#settings`         | Connections and readiness   | Connect / prepare operational flows | Wallet, ENS, GitHub handoff, 0G receipts  | Become the main product experience               |
| `#help`             | Product education           | Learn / return to workflow          | Caveats, roadmap, operational model       | Carry private strategy or internal agent notes   |

## Proof Gate Contract

These gates are product rules, not decoration. A screen can be redesigned only
if the relevant gate remains visible or enforced.

| Gate                     | Required before passing                                 | Enforced / shown in routes                                  |
| ------------------------ | ------------------------------------------------------- | ----------------------------------------------------------- |
| Source gate              | Source type, URL/reference, project or owner context    | `#work-queue`, `#mission-detail`, `#case-file`              |
| Project gate             | Project bucket or explicit unassigned state             | `#projects`, `#work-queue`, `#mission-detail`               |
| Acceptance gate          | Maintainer, steward, buyer, or reviewer                 | `#work-queue`, `#mission-detail`, `#maintainer`             |
| Proofability gate        | Objective proof requirement and expected evidence       | `#work-queue`, `#mission-detail`                            |
| Value gate               | Credit, reputation, benefit, payout, or no-value state  | `#mission-detail`, `#maintainer`, `#my-work`, `#earnings`   |
| Agent readiness gate     | Proof node identity, owner, skills, permissions         | `#agent-setup`, `#mission-detail`, `#run`                   |
| Run safety gate          | Sandbox, blocked external actions, no spend, no posting | `#agent-setup`, `#run`, `#case-file`, `#trust-center`       |
| Packet quality gate      | Evidence, verifier result, artifacts, privacy review    | `#run`, `#case-file`                                        |
| Maintainer decision gate | Accept, revise, or reject                               | `#maintainer`                                               |
| Value creation gate      | Accepted proof plus defined value rule                  | `#maintainer`, `#my-work`, `#builder-passport`, `#earnings` |
| Release gate             | Earned payout plus release method or receipt            | `#earnings`, `#my-work`, `#settings`                        |
| Public proof gate        | Accepted proof plus redaction/privacy pass              | `#case-file`, `#public-proof`                               |

Hard rules:

- Work cannot become a mission without source, project context, acceptance
  owner, proof requirement, risk, allowed/blocked actions, and value path.
- A mission cannot run without a registered proof node or explicit setup route.
- A packet cannot submit without privacy/security review.
- Accepted proof always creates credit.
- Earned payout and released payout are separate states.
- Observed GitHub history, wallet receipts, marketplace snapshots, and
  credentials do not count as accepted credit unless linked to accepted proof.

## Visual And Copy Gates

Every implementation pass must check these before merge:

1. The screen has one dominant object.
2. The primary action is obvious in under five seconds.
3. Repeated work/proof/review/credit data uses a table or dense list.
4. Cards frame selected objects or summaries only; no nested card stacks.
5. Core workflow copy is short. Long explanation belongs in Help, Settings, or
   details.
6. The product loop is implied by the journey and shown only where useful.
7. Agent identity is visible as proof-node identity, not as internal process
   text.
8. Credit, payout, and reputation states distinguish `observed`, `accepted`,
   `earned`, and `released`.
9. Buttons and demo script labels match exactly.
10. A screen must not leak private notes, internal strategy, or fake future
    claims.

OpenResearch-inspired visual direction:

- darker protocol shell with high-contrast content regions
- smaller radii and sharper table/list structure
- strong type hierarchy with restrained copy
- monospace for IDs, hashes, commands, receipts, and source refs
- proof green for accepted/safe states
- amber/red for needs-action, blocked, failed, or revision states
- denser desktop-first layouts with side detail panes

## Implementation Passes

### Pass 1: Registry Home

Files:

- `apps/web/src/screens/OpportunityScreen.tsx`
- `apps/web/src/styles/29-redesign-home.css`
- `apps/web/src/demo/project.ts`
- `apps/web/src/demo/proofSummary.ts`

Goal:

Make Home feel like a live contribution registry, not onboarding cards.

Definition of done:

- First viewport shows active project/work/proof/value state.
- Primary action starts or continues the proof journey.
- Metrics and latest proof/work feel operational.
- No generic product-theory blocks above the fold.

### Pass 2: Work Inventory

Files:

- `apps/web/src/screens/WorkQueueScreen.tsx`
- `apps/web/src/styles/30-redesign-opportunities.css`
- `apps/web/src/demo/missions.ts`

Goal:

Make Opportunities read as source-backed work inventory with real choices.

Definition of done:

- Rows are visibly different work items.
- Every row shows source, proof requirement, owner, value, status, and action.
- Selected item details explain why it is proofable.
- CTA label matches Mission Detail entry.

### Pass 3: Project Command Room

Files:

- `apps/web/src/screens/ProjectsScreen.tsx`
- `apps/web/src/styles/28-redesign-projects.css`

Goal:

Make Projects feel like the place a steward uses to grow a project through
accepted proof.

Definition of done:

- Open, active, accepted, and payout/credit states are visible together.
- Project ledger is scannable.
- Publishing/importing work is visible without becoming a fake marketplace.
- Project context and source ownership stay clear.

### Pass 4: Proof Flow Alignment

Files:

- `apps/web/src/screens/MissionDetailScreen.tsx`
- `apps/web/src/screens/RunnerScreen.tsx`
- `apps/web/src/screens/CaseFileScreen.tsx`
- `apps/web/src/screens/MaintainerScreen.tsx`
- `docs/DEMO_SCRIPT.md`
- `docs/DEMO_SCRIPT_TIGHT_2MIN.md`
- `scripts/smokeWeb.ts`

Goal:

Make the filmed journey and the actual UI use the same labels, order, and
states.

Current label contract:

| Step           | Preferred label           |
| -------------- | ------------------------- |
| Setup          | `Set up proof node`       |
| Register       | `Register proof node`     |
| Work           | `Find source-backed work` |
| Mission        | `Assess mission`          |
| Run            | `Authorize bounded run`   |
| Packet         | `Review packet`           |
| Submit         | `Submit to maintainer`    |
| Review         | `Accept & Mark Earned`    |
| Credit         | `Release payout`          |
| Public outcome | `View public proof`       |

Definition of done:

- Demo script, button labels, smoke selectors, and visible journey match.
- No duplicate accessible names for primary actions on the same screen state.
- Maintainer and Case File do not overflow on desktop.

### Pass 5: Credit, Passport, And Public Proof

Files:

- `apps/web/src/screens/MyWorkScreen.tsx`
- `apps/web/src/screens/BuilderPassportScreen.tsx`
- `apps/web/src/screens/PublicProofScreen.tsx`
- `apps/web/src/screens/EarningsScreen.tsx`
- `apps/web/src/styles/16-my-work.css`
- `apps/web/src/styles/22-builder-passport.css`
- `apps/web/src/styles/08-public-proof.css`

Goal:

Make the payoff feel like durable contribution value, not a completion screen.

Definition of done:

- Accepted proof creates visible credit.
- Earned and released payout are visually distinct.
- Passport separates observed history from accepted ProofForge credit.
- Public proof is clean, shareable, and redacted.

## Verification Gates

Before declaring any pass complete, run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run smoke:web
```

Then perform one browser click-through on the same local build:

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
-> #settings
```

Browser review must check:

- no horizontal overflow on desktop
- desktop-first density is preserved
- button labels match the demo script
- selected work item remains consistent across route transitions
- proof node identity remains visible through run and packet
- accepted proof creates visible credit/value state
- public proof is redacted and shareable

If a test must change because a route or label changed, update the smoke test
and demo script in the same pass.

## Merge Rules For Redesign Work

Use these rules when merging redesign branches into operational work:

1. Preserve product state and operational flows over visual novelty.
2. Preserve route IDs unless the route registry and smoke test are updated in
   the same change.
3. Preserve the proof gate contract.
4. Preserve local/demo state reset and seeded proof journey.
5. Do not remove GitHub import, wallet/ENS, 0G receipt, reviewer link, public
   proof, GUN/shared-state, or payout receipt hooks without replacing them.
6. Do not add private process notes, internal strategy, or personal artifacts to
   public docs.
7. Run the full verification gates before pushing.

## Current Known Risks

- Some route names still reflect earlier product language
  (`opportunity`, `scoreboard`) instead of the registry model.
- Accessibility selectors can become ambiguous when a screen has duplicate
  primary CTA labels.
- Script/UI label drift can break rehearsals even when the app works.
- The product can regress into card stacks if repeated data is not moved into
  tables/lists.
- Mobile only needs to avoid catastrophic breakage; desktop quality is the
  primary acceptance bar.
