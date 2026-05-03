# ProofForge Storyboard Alignment Map

Use this before implementation planning or UI redesign.

This document maps the current product storyboard against the user journey, architecture, Web3/bounty hook, value model, and acceptance gates. It answers:

```text
Does the storyboard make sense?
What is each screen for?
What does the user do next?
What data/state does it need?
Where do agents, Web3, bounties, payout, and credit appear?
What should be hidden?
What gaps remain before redesign?
```

## Verdict

The storyboard makes sense if ProofForge is treated as one guided contribution journey with outcome surfaces, not as a dashboard with every object exposed.

The correct product shape is:

```text
Connect source and identity
-> choose project-backed work
-> accept mission terms
-> run safe agent-assisted proof
-> submit Proof Pack
-> human accepts/revises/rejects
-> credit/value/receipt state updates
-> project and contributor histories improve
```

The current build should be redesigned around this storyboard. The main risk is overexposing internal objects too early:

```text
Proof Packets tab
Scoreboard as separate dashboard
permanent Runner nav
repeated proof/payout education cards
Web3/receipt details on screens where they do not affect a decision
```

## Primary Journey

### Narrative

```text
I connect existing work and identity.
ProofForge shows a useful opportunity tied to a project.
I see who accepts it and what value exists if accepted.
My agent/node runs safely and produces evidence.
A clean Proof Pack is submitted.
A human reviewer accepts it.
I can track credit, payout, receipt, and public proof.
The project ledger grows and ProofForge recommends better work.
```

### Flow

```text
Home
-> Connect Sources
-> Agent Setup
-> Project
-> Opportunities
-> Mission Detail
-> Runner
-> Proof Pack
-> Maintainer Review
-> My Work
-> Proof Ledger
-> Public Proof
-> Home / Project Recommendations
```

## Navigation Model

Primary navigation should stay small:

```text
Home
Projects
Opportunities
My Work
```

Contextual screens:

```text
Connect Sources
Agent Setup
Mission Detail
Runner
Proof Pack
Maintainer Review
Proof Ledger
Public Proof
Payout Settings
Builder Passport
```

Rule:

```text
Do not expose flow steps as permanent sidebar tabs.
Outcome surfaces appear when the user has an outcome.
```

## Screen Map

| Step | Screen            | User question                            | Primary action                     | State object                    | Web3/bounty presence                                                  | Hidden by default                          |
| ---- | ----------------- | ---------------------------------------- | ---------------------------------- | ------------------------------- | --------------------------------------------------------------------- | ------------------------------------------ |
| 1    | Home              | What should I do next?                   | Start safest proof / continue work | user state, recommended mission | connection status only                                                | protocol detail, full payout explainer     |
| 2    | Connect Sources   | Where does work/value come from?         | Import source                      | Source Record                   | GitHub, bounty URL, wallet/payout recipient, source requirements      | long adapter roadmap                       |
| 3    | Agent Setup       | Who/what produces proof for me?          | Confirm proof node                 | Agent/Node Identity             | owner/payout recipient only                                           | agent marketplace, autonomous swarm copy   |
| 4    | Project           | What project does this improve?          | Open opportunities                 | Project, Value Rules            | funding source or treasury reference summary                          | tx list, raw funding history               |
| 5    | Opportunities     | What work is worth reviewing?            | Review mission                     | Work Lead / Mission candidate   | source type, value path, sponsor                                      | full mission terms, raw diagnosis matrix   |
| 6    | Mission Detail    | Is it safe and worth running?            | Run in sandbox                     | Mission Contract                | reward asset, release method, custody status, submission requirements | long Web3 education                        |
| 7    | Runner            | What is happening and is it safe?        | Review Proof Pack                  | Run, policy, artifacts          | no spend / no external action state                                   | payment/ownership detail                   |
| 8    | Proof Pack        | Is this ready for review?                | Submit to maintainer               | Evidence Packet, Case File      | value if accepted, receipt refs if present, requirements checklist    | raw logs, private data                     |
| 9    | Maintainer Review | Does this proof hold?                    | Accept and mark earned             | Decision, Payout state          | credit recipient, payout impact                                       | agent chatter, public proof controls       |
| 10   | My Work           | What is my status across projects?       | Continue / release / view proof    | User Work Ledger                | earned/released/receipt state                                         | project admin detail                       |
| 11   | Proof Ledger      | What was accepted and what value exists? | View public proof / receipt        | Accepted Proof Record           | wallet/tx/receipt references                                          | unaccepted work                            |
| 12   | Public Proof      | What can others trust?                   | Share / view project               | Public-safe proof               | public-safe receipt/project refs                                      | private logs, local paths, payout settings |

## Object Lifecycle Map

The storyboard is valid only if these transitions are clear.

```text
Source Record
-> Work Lead
-> Mission Contract
-> Run
-> Evidence Packet
-> Proof Pack / Case File
-> Maintainer Decision
-> Accepted Proof
-> Credit Record
-> Earned Payout if defined
-> Released Payout if marked paid or receipt attached
-> Public Proof after redaction
```

Blocked transitions:

| Attempt                   | Block reason                                                                      |
| ------------------------- | --------------------------------------------------------------------------------- |
| Work Lead -> Mission      | missing project, source, acceptance owner, proof requirement, risk, or value path |
| Mission -> Run            | agent/node not ready or safety policy fails                                       |
| Run -> Submit             | no evidence, verifier failed, privacy/security review failed                      |
| Submitted -> Accepted     | unauthorized or unclear reviewer                                                  |
| Accepted -> Earned payout | payout/value terms not defined                                                    |
| Earned -> Released        | no manual release action or external receipt                                      |
| Any -> Public Proof       | not accepted or not redacted                                                      |

## Role Journey Map

### Contributor / Agent Owner

```text
Home
-> connect/import source
-> confirm proof node
-> choose mission
-> run safely
-> submit proof
-> track accepted credit and payout state
```

Must always understand:

- what work is from
- what the agent can do
- who accepts proof
- what value exists if accepted
- whether payout is earned or released

### Project Steward

```text
Project
-> define purpose and value rules
-> attach source links
-> publish opportunities
-> review accepted proof ledger
-> track contributors and agents
```

Must always understand:

- what work improves the project
- which opportunities are blocked
- what proof has been accepted
- what benefits or payouts exist

### Maintainer / Reviewer

```text
Review queue
-> inspect clean Proof Pack
-> accept, revise, or reject
-> value state updates only after acceptance
```

Must always avoid:

- raw agent chatter
- unclear payout consequences
- accepting proof without privacy/security state

### Sponsor / Funder

```text
Project value rules
-> funded opportunities
-> accepted proof
-> earned payout
-> release or external receipt
```

Must always see:

- committed, earned, released, available
- who accepted proof
- who receives value
- whether ProofForge controls funds

### Public Viewer

```text
Public Proof
-> project context
-> what was proven
-> who accepted it
-> public-safe artifacts and receipt refs
```

Must never see:

- raw private logs
- local paths
- secrets
- internal agent notes
- unreleased private payout settings

## Architecture Match

The storyboard maps cleanly to the current package architecture.

| Storyboard area         | Architecture dependency                |
| ----------------------- | -------------------------------------- |
| Connect Sources         | `packages/sources`, future adapters    |
| Work Lead qualification | `packages/sources`, `packages/mission` |
| Mission terms           | `packages/mission`, `packages/policy`  |
| Agent safety            | `packages/policy`, `apps/runner`       |
| Run artifacts           | `apps/runner`                          |
| Verification            | `packages/verifier`                    |
| Proof Pack              | `packages/evidence`                    |
| Storage refs            | `packages/storage`                     |
| Maintainer decision     | app state / future backend             |
| Payout state            | `packages/payments`                    |
| Project ledger          | `packages/projects`                    |
| Web prototype           | `apps/web`                             |

This means the storyboard is implementable without changing the architecture direction.

## Web3 / Bounty Match

Web3 and bounties should appear as a decision layer, not as product decoration.

### V1

```text
bounty URL / DAO proposal URL / grant URL
wallet or payout recipient
reward asset
release method
custody status
optional tx hash or receipt URL
source/bounty submission requirements
```

V1 UI locations:

| Location          | Web3/bounty content                                                            |
| ----------------- | ------------------------------------------------------------------------------ |
| Connect Sources   | source URL, wallet/payout recipient, bounty/source requirement import          |
| Mission Detail    | sponsor, reward asset, release method, custody status, submission requirements |
| Proof Pack        | value if accepted, receipt refs if any, requirements satisfied checklist       |
| Maintainer Review | credit recipient, payout impact                                                |
| My Work / Ledger  | earned, released, receipt reference                                            |
| Public Proof      | public-safe receipt/project references                                         |

V1 must not show:

```text
escrow
automatic settlement
automatic ownership
NFT issuance
agent-to-agent payment
live bounty marketplace sync
```

### V2

```text
wallet connection
GitHub account import
onchain receipt import
observed contribution history
bounty/funding signal adapters
```

### V3

```text
verified receipt graph
sponsor pools
optional settlement/escrow adapters
public credentials or proof badges
agent identity standards
```

## Information Hierarchy Rules

The redesign should not explain everything everywhere.

### Screen Copy Limit

Each screen should contain:

```text
one state headline
one primary action
one object or decision area
one secondary context area
one optional detail area
```

If a screen has more than three major panels above the fold, it probably needs compression.

### Card Pattern

Use:

```text
Object name
state/fact
one action
```

Avoid:

```text
object name
why this matters
process explanation
product philosophy
multiple CTAs
duplicated payout/proof copy
```

### Explanation Placement

| Explanation          | Placement                                          |
| -------------------- | -------------------------------------------------- |
| Proof before payout  | Mission Detail, Maintainer Review, Payout Settings |
| Web3 custody status  | Mission Detail and Value/Ledger only               |
| Agent safety         | Agent Setup, Mission Detail, Runner                |
| Project purpose      | Project page and Public Proof                      |
| Public/private split | Proof Pack and Public Proof                        |
| Full protocol detail | collapsed details or Working Proof                 |

## Does The Storyboard Make Sense?

Yes, with three corrections.

### Correction 1: Home And Scoreboard Merge

Home should absorb scoreboard behavior.

```text
Home = next action + current value/work state
Scoreboard = outcome state inside My Work / Ledger
```

Do not keep Home and Scoreboard as separate first-class surfaces in the redesign.

### Correction 2: Proof Packets Is Not Primary Nav

Proof Pack is a contextual artifact. Proof Ledger is an outcome.

```text
Before proof exists: no Proof Packets nav.
After proof exists: show Proof Ledger or My Work.
```

### Correction 3: Connect Sources And Agent Setup Need To Be Real First-Time Steps

If the user does not understand:

```text
what source they connected
who/what agent is working
where value will be tracked
```

then the proof loop feels abstract.

The redesign should expose setup as a guided first-run step, not as a settings-like afterthought.

## Remaining Gaps Before Implementation Planning

These do not block the storyboard, but they must be addressed in the implementation plan.

| Gap                        | Decision needed                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------ |
| Route cleanup              | primary nav should become Home, Projects, Opportunities, My Work                     |
| Home redesign              | merge current Home/Scoreboard behavior                                               |
| Connect Sources screen     | create or expose GitHub, source URL, bounty URL, wallet/payout state                 |
| Agent Setup screen         | create first-class setup surface with owner, permissions, verifier                   |
| My Work screen             | create cross-project status tracker                                                  |
| Proof Ledger outcome       | make it an outcome surface, not default navigation clutter                           |
| Web3 fields                | add V1 metadata fields without settlement claims                                     |
| Source/bounty intelligence | add ETHGlobal/GitHub prior-art lessons as source requirements, not live dependencies |
| Empty/blocked states       | define next action for no source, no agent, no value path, no reviewer               |
| Current UI density         | remove repeated explanatory cards and duplicate process loops                        |

## Implementation Readiness

The storyboard is ready for implementation planning when these questions are answered with "yes":

| Question                                             | Current answer               |
| ---------------------------------------------------- | ---------------------------- |
| Does the journey have a start, middle, and outcome?  | Yes                          |
| Does each screen have one job?                       | Yes, in this map             |
| Does the architecture support it?                    | Yes                          |
| Are Web3 and bounty bits explicit?                   | Yes                          |
| Are dependencies known?                              | Yes, with 0G risk documented |
| Are outcome surfaces separated from journey screens? | Yes                          |
| Are current UI risks identified?                     | Yes                          |
| Is the redesign scope clear enough to plan?          | Yes                          |

## Next Step After This Map

Create the implementation plan in slices:

```text
Slice 1: route/nav model and Home merge
Slice 2: Connect Sources + Agent Setup
Slice 3: Project and Opportunities compression
Slice 4: Mission -> Runner -> Proof Pack flow
Slice 5: Maintainer Review -> My Work -> Ledger value state
Slice 6: Web3/bounty metadata surfaces
Slice 7: Source/bounty requirements checklist
Slice 8: browser QA and copy/density cleanup
```

Do not start by polishing individual cards. Start by making the journey coherent.
