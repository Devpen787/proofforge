# ProofForge Product Upgrade Plan

This plan uses OpenResearch as a product-structure reference, not as a feature
copy target.

OpenResearch is strong because the entire product is organized around a small
set of public primitives:

- registry
- project
- benchmark
- miner
- validator
- reward pool
- accepted best

ProofForge needs the same level of structural clarity around its own primitives:

- project
- work source
- mission
- proof node
- evidence packet
- maintainer acceptance
- credit ledger
- payout or reputation state

## What OpenResearch Nails

### 0. Product Maturity On First Sight

OpenResearch looks like a finished protocol interface before the user reads the
details. The experience feels mature because the visual language, information
architecture, and copy all point in the same direction:

- dark protocol canvas
- restrained accent system
- clear role model
- live registry stats
- dense but readable data
- credible tables
- one strong system diagram
- short, confident copy
- commands and artifacts that make the product feel executable

ProofForge currently has more product breadth, but less visual authority. Too
many surfaces still feel like a prototype made of stacked product cards. The
problem is not only aesthetics. It is trust. If the product is supposed to be a
proof, credit, and payout layer, the interface has to feel precise, durable,
and hard to fool.

OpenResearch feels like:

> a live protocol with a registry.

ProofForge too often still feels like:

> a demo dashboard explaining a workflow.

That has to change.

### 1. One Product Sentence

OpenResearch says, effectively:

> Agents compete to improve real repos, scored by a benchmark, verified in
> TEEs, paid on-chain.

ProofForge needs the equivalent:

> ProofForge turns useful project work into accepted proof, so people and
> agents can earn credit, reputation, or payout.

The current app often explains the mechanics before the user feels the product.
The upgraded app should lead with the public object being created: accepted
proof.

### 2. A Registry Metaphor

OpenResearch does not feel like a generic dashboard because the homepage is a
registry surface. It shows projects, accepted bests, pools, live events, and a
leaderboard.

ProofForge should use the same structural move:

> Home becomes the Proof Registry / Contribution Registry.

It should show:

- active projects
- open work to prove
- accepted proofs
- earned credit
- payout state
- proof nodes
- latest accepted packet

This gives the product a real protocol/work-network feel instead of a sequence
of internal screens.

### 3. Roles Are Explicit

OpenResearch maps the system into roles:

- researcher
- registry
- miner
- validator

ProofForge should map its roles with equal clarity:

- project steward: publishes work and value rules
- contributor: chooses work and owns credit
- proof node: runs bounded evidence tasks
- maintainer/reviewer: accepts, rejects, or requests revision
- registry: records accepted proof and value state

These roles should appear in the system model, not as repeated explainer cards.

### 4. Tables For Scannable Work

OpenResearch uses tables for projects because the user needs comparison:
baseline, best, delta, supply, pool, status.

ProofForge should use tables for:

- work inventory
- project ledgers
- proof packets
- review queue
- credit/payout ledger

Cards should be reserved for one selected object, not repeated rows.

### 5. One Visual Loop

OpenResearch uses one strong animated diagram to explain the protocol loop.
ProofForge should have one strong product loop:

```text
source -> mission -> proof node -> evidence packet -> acceptance -> credit
```

This loop belongs on the registry/home surface and maybe Help. It should not be
repeated on every workflow screen.

## ProofForge Translation

### Product Metaphor

Current weak metaphor:

> an app dashboard for proof tasks

Target metaphor:

> a contribution registry for project work

This shifts the app from "click through a demo" to "inspect a live work
network."

### Core Navigation

Recommended top-level navigation:

1. Registry
2. Projects
3. Work
4. Review
5. Credit
6. Passport
7. Settings

Mapping from current routes:

| Current Route              | Target Product Role                        |
| -------------------------- | ------------------------------------------ |
| Home / `opportunity`       | Registry overview                          |
| Projects                   | Project command room + contribution ledger |
| Opportunities / Work Queue | Work to prove                              |
| Mission Detail             | Proof contract                             |
| Runner                     | Proof node session                         |
| Case File                  | Evidence packet                            |
| Maintainer                 | Review queue                               |
| My Work                    | Credit ledger                              |
| Builder Passport           | Contributor / agent passport               |
| Earnings                   | Payout ledger                              |
| Trust Center               | Boundaries and audit                       |
| Help                       | Education and roadmap                      |

### Registry Home

Home should not be an onboarding page. It should be the product's live system
surface.

Recommended first viewport:

- headline: `Contribution Registry`
- short subhead: `Source-backed work, accepted proof, credit, and payout state.`
- primary CTA: `Prove work`
- secondary CTA: `Publish work`
- metric strip:
  - active projects
  - open work
  - accepted proofs
  - earned value
  - proof nodes
- selected proof/work panel:
  - latest accepted packet or safest available mission
- compact loop visual:
  - source -> mission -> proof node -> packet -> accepted -> credit

Avoid:

- explaining every concept in the first viewport
- oversized generic hero copy
- repeated cards for things that are really table rows

### Projects

Projects should feel like the command room for a contribution economy.

Recommended structure:

- project header: name, steward, source, pool/value rule
- project metrics: open work, active missions, accepted proof, credit, payout
- primary table: open/active/accepted work
- selected side panel: current work request or latest proof
- ledger strip: accepted packets and payout/receipt references

Primary action:

> Publish work request

Secondary actions:

- connect source
- invite contributor
- attach proof node

### Work

Opportunities should become `Work to Prove`.

Recommended structure:

- filter tabs: all, ready, needs triage, reward path, safe
- table columns:
  - source
  - work
  - proof requirement
  - acceptance owner
  - value
  - risk
  - status
  - action
- selected detail pane:
  - source URL
  - why this is provable
  - required evidence
  - allowed/blocked actions

Primary action:

> Assess mission

### Proof Contract

Mission Detail should not feel like a generic detail page. It should be a
contract for what will be proven.

Recommended structure:

- work source
- proof requirement
- acceptance owner
- value path
- proof node identity
- permissions
- failure/revision path

Primary action:

> Authorize bounded run

### Proof Node Session

Runner should show live execution, but it should be disciplined.

Recommended structure:

- left: run state and next action
- right: terminal/log output
- bottom: proof trace with stable horizontal timeline

Primary action:

> Open evidence packet

Avoid:

- tall cards with wrapped vertical text
- proof trace boxes that compress labels
- repeated policy explanation

### Evidence Packet

Case File should be the artifact.

Recommended structure:

- packet header: packet id, source, maintainer, value, storage state
- tested / result / verifier / artifacts / privacy / security
- reviewer handoff actions:
  - copy reviewer link
  - copy GitHub comment
  - submit to maintainer
  - export packet

Primary action:

> Submit to maintainer

### Review Queue

Maintainer should behave like a decision queue.

Recommended structure:

- queue table on left
- selected packet review on right
- decision buttons fixed in the selected review panel
- acceptance details collapsed unless needed

Primary action:

> Accept & Mark Earned

### Credit Ledger

My Work, Earnings, and Passport overlap too much. They should become three
views of the same ledger:

- My Work: operational task state
- Earnings: payout and release state
- Passport: contributor identity and cumulative proof

Recommended near-term simplification:

- My Work becomes `Credit Ledger`
- Earnings becomes a tab or detail section inside Credit Ledger
- Passport remains as identity/reputation summary

## Visual System Direction

ProofForge can borrow structural discipline from OpenResearch without copying
its exact style.

Recommended visual principles:

- darker product/protocol canvas
- thin lines and table grids
- monospace labels for protocol objects
- one accent color for live/accepted states
- secondary amber/red/blue only for status
- fewer rounded cards
- cards only for selected object panels
- tables for repeated data
- compact metric strips
- stable proof-flow diagram
- no paragraph-heavy explainer blocks in core screens

The product should feel like:

> registry + terminal + ledger + review queue

not:

> SaaS dashboard + onboarding cards

## UI/UX Gap: Why OpenResearch Feels Better

### What Their UI Does Well

#### Visual Authority

OpenResearch uses a dark, technical, high-contrast canvas with fine grid lines,
small labels, monospace identifiers, and restrained highlights. It feels like a
protocol console. The color system supports the product: green/cyan means live
or improved, amber means registry/token mechanics, red means validation risk.

ProofForge should not blindly copy the dark theme, but it needs comparable
authority. The current light-card system makes proof, review, and payout feel
softer than they should.

#### Strong First Viewport

OpenResearch's first viewport answers:

- what is this?
- why does it exist?
- what is live?
- what can I do?
- what does the system loop look like?

ProofForge's first viewport has improved, but it still reads more like
onboarding than a live network. It should immediately show the registry of work,
proof, and credit.

#### Fewer, Stronger Objects

OpenResearch does not scatter attention across many unrelated panels. It gives
the user a few high-value objects:

- install command
- live flow diagram
- registry metrics
- active project table
- event stream
- leaderboard

ProofForge has the right objects, but they are fragmented across screens and
often styled at the same visual weight. Source, mission, packet, acceptance,
credit, and payout all compete instead of forming a hierarchy.

#### Tables Where Tables Belong

OpenResearch uses table layouts for project lists because comparison matters.
This makes the product feel operational.

ProofForge still uses too many repeated card-like blocks for work inventory,
active work, proof rows, and ledgers. These should become tables or dense rows.

#### One Diagram, Not Endless Explanation

OpenResearch's diagram does real work: it makes the loop visible once.

ProofForge should have one strong proof loop:

```text
source -> mission -> proof node -> packet -> review -> accepted credit
```

Then every screen should simply advance that loop.

#### Copy Confidence

OpenResearch uses short product copy:

- "Closed-loop AI discovery."
- "The benchmark is the oracle."
- "Beat the benchmark. Earn the reward."

ProofForge copy often explains too much:

- why the product exists
- what agents can and cannot do
- what future integrations might do
- what is simulated or credential-gated

Those details are important, but they belong in Help, Settings, docs, or
collapsed details. The main product UI should be shorter and more decisive.

### Where ProofForge Looks Amateur Today

This is the blunt assessment:

- too many rounded card surfaces
- too many panels of equal importance
- too many paragraphs inside workflow screens
- weak first-screen product metaphor
- mixed naming: Home, Opportunities, My Work, Earnings, Passport, Trust Center
- visible workflow labels drift from the actual demo script
- buttons sometimes duplicate accessible names
- rows sometimes look like cards pretending to be data
- proof/value state is present but not visually dominant
- agent identity is important but still feels like a status badge, not a
  protocol actor
- the app does not yet feel like a registry, ledger, or review system

None of this means the product is bad. It means the interface is not yet
communicating the seriousness of the product.

The product thesis is strong:

> useful work -> accepted proof -> credit/value

The interface should be as strong as the thesis.

## Target Experience

ProofForge should feel like a serious operating surface for contribution proof.

Target references:

- protocol registry
- maintainer review queue
- terminal/evidence runner
- project ledger
- contributor passport

Avoid references:

- generic SaaS dashboard
- hackathon explainer page
- onboarding wizard
- card-heavy CRM
- fake marketplace

### Target Feel

The upgraded interface should feel:

- precise
- technical
- trustworthy
- scannable
- alive
- source-backed
- ledger-like
- maintainer-safe

It should not feel:

- cute
- bloated
- generic
- over-explained
- card-stacked
- decorative
- speculative

### Visual Rules For The Upgrade

1. Use one dominant page object per screen.
2. Use tables/lists for repeated work, proof, review, and credit data.
3. Use side panels for selected-object details.
4. Use cards only for selected objects or summaries, not every row.
5. Keep copy short in the core UI.
6. Move education and caveats into Help/Settings/details.
7. Make accepted proof and credit visually stronger than setup text.
8. Make agent/proof-node state visible but not noisy.
9. Use protocol-like labels, hashes, IDs, source refs, and timestamps where
   they help credibility.
10. Do not add new concepts until the existing loop feels obvious.

### Recommended Brand Direction

The current ProofForge brand can evolve without becoming a clone of
OpenResearch.

Suggested direction:

- background: deep charcoal / near-black protocol shell
- main surface: muted off-white or dark elevated panels, chosen consistently
- lines: thin, low-contrast grid and table separators
- accent: proof green / emerald for accepted/live states
- secondary accent: amber for pending/reward, red for rejected/risk, blue/cyan
  for source/storage
- typography: strong sans for headings, monospace for IDs/hashes/commands
- radius: 3-8px, not large soft cards
- data density: higher on desktop
- spacing: tighter and more deliberate

The goal is not "dark mode because OpenResearch is dark." The goal is:

> make ProofForge feel like proof infrastructure.

## Implementation Order

### Pass 1: Product Shell And Registry Home

Goal: make the first screen feel like a real product network.

Changes:

- rename Home conceptually to Registry
- add a registry metric strip
- add a compact proof-loop diagram
- turn current ready-work rows into a registry table
- make primary CTA `Prove work`
- make secondary CTA `Publish work`

Files:

- `apps/web/src/screens/OpportunityScreen.tsx`
- `apps/web/src/styles/29-redesign-home.css`
- `apps/web/src/demo/project.ts`
- `apps/web/src/demo/proofSummary.ts`

### Pass 2: Work Inventory Table

Goal: make Opportunities clearly different from Projects.

Changes:

- rename screen language to `Work to Prove`
- use table-first inventory
- selected item detail pane
- separate ready work from needs triage
- preserve current mission actions

Files:

- `apps/web/src/screens/WorkQueueScreen.tsx`
- `apps/web/src/styles/30-redesign-opportunities.css`
- `apps/web/src/demo/missions.ts`

### Pass 3: Project Command Room

Goal: make projects feel like contribution economies.

Changes:

- project header with steward/source/value rules
- ledger strip
- open/active/accepted table
- selected work request panel
- clearer publish-work flow

Files:

- `apps/web/src/screens/ProjectsScreen.tsx`
- `apps/web/src/styles/28-redesign-projects.css`

### Pass 4: Flow Labels And Demo Script Alignment

Goal: remove script/UI drift.

Current verified labels:

- `Set up proof node`
- `Find source-backed work`
- `Assess mission`
- `Authorize bounded run`
- `Review packet` / `Open case file`
- `Submit to maintainer`
- `Accept & Mark Earned`

Changes:

- update `docs/DEMO_SCRIPT.md`
- update `docs/DEMO_SCRIPT_TIGHT_2MIN.md`
- update smoke selectors only where labels are intentionally changed

### Pass 5: Review, Credit, Passport Consolidation

Goal: reduce overlap and make accepted value obvious.

Changes:

- Maintainer becomes Review Queue
- My Work becomes Credit Ledger
- Earnings folds into Credit Ledger or is visually subordinate
- Passport shows cumulative contribution identity

Files:

- `apps/web/src/screens/MaintainerScreen.tsx`
- `apps/web/src/screens/MyWorkScreen.tsx`
- `apps/web/src/screens/EarningsScreen.tsx`
- `apps/web/src/screens/BuilderPassportScreen.tsx`

## Success Criteria

The upgraded product should be understandable in one pass:

1. A project publishes useful work.
2. A contributor or proof node chooses work.
3. The work becomes a mission.
4. The proof node runs within boundaries.
5. The evidence packet is reviewed.
6. Accepted proof creates credit and payout state.
7. The registry records the contribution history.

The judge/user should not need internal context to understand:

- source
- agent/proof node
- proof
- acceptance
- value

## What Not To Copy

Do not copy these OpenResearch-specific assumptions:

- benchmark-only work
- competitive mining as the default interaction
- Solana-first product identity
- token bonding curve as core ProofForge UI
- TEE validation as a required V1 trust model

ProofForge's defensible territory is broader:

> human-accepted proof for useful project work that cannot always be reduced to
> one benchmark number.
