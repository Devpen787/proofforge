# ProofForge Demo Script

## Before Recording

Use production for the video:

```text
https://proofforgehub.vercel.app/#opportunity
```

Start clean:

```text
Settings -> Reset demo state -> #opportunity
```

## Final 2-3 Minute Script

### 0:00-0:20 - Intro

Say:

> Hi, I'm Devinson, and this is ProofForge, built for the Open Agents
> hackathon. We created ProofForge because agents are making it easier to
> produce work, but useful contributions still get scattered across GitHub
> issues, unfinished projects, bounties, and chats. Maintainers do not need more
> noise. They need accepted proof of what actually helped.

Show:

```text
https://proofforgehub.vercel.app/#opportunity
```

### 0:20-0:35 - Product

Say:

> ProofForge turns useful software work into accepted proof. It is the layer
> between messy work and recognized value: source-backed work, bounded agent
> assistance, evidence packets, maintainer review, credit, and payout tracking.

### 0:35-0:50 - Agent Setup

Say:

> First, I register a bounded proof node. It has an owner, skills, and limits.
> It can run local checks and capture evidence, but it cannot post PRs,
> comments, access secrets, or move funds without approval.

Click:

```text
Set up proof node
-> Register proof node
-> Find source-backed work
```

### 0:50-1:10 - Mission

Say:

> Now I pick sourced work. This mission comes from an existing project issue:
> validate the install docs. ProofForge turns that into a narrow mission with
> success criteria, risk, value, and an acceptance owner.

Click:

```text
Run this mission
-> Accept and run
```

### 1:10-1:30 - Evidence

Say:

> The proof node runs the check in evidence mode. It captures logs,
> environment, verifier status, and artifacts. The result is not agent chatter.
> It becomes a maintainer-ready packet.

Click:

```text
Approve Packet
```

Optional terminal flash:

```bash
npm run demo:packet
npm run sync:web-proof
```

### 1:30-1:55 - Review

Say:

> Now the maintainer reviews the packet. GitHub stays the source authority:
> ProofForge prepares the comment and records the posted source URL. The
> reviewer can also sign acceptance with a wallet. Only after that does accepted
> proof create earned credit and payout state.

Click:

```text
Submit Packet
-> Connect MetaMask or demo signer
-> paste GitHub URL
-> Record GitHub post
-> Sign acceptance
-> Accept & Mark Earned
```

Use:

```text
https://github.com/Devpen787/proofforge/issues/1#issuecomment-proof
```

### 1:55-2:15 - Public Proof

Say:

> This is the public proof: source, bounded agent run, verifier result,
> artifacts, maintainer acceptance, wallet/onchain-ready state, 0G-ready
> evidence storage, and payout tracking.

Click:

```text
View public proof
```

### 2:15-2:35 - 0G And Handoffs

Say:

> For 0G, ProofForge prepares the durable evidence upload from the runner
> environment and lets the reviewer record the returned 0G receipt or root. That
> keeps private keys out of the browser while still making proof packets
> portable and storage-verifiable.

Click if time:

```text
Settings
-> Prepare 0G upload
-> Prepare payout handoff
-> Publish shared project
```

If a live 0G upload is not recorded, show the prepared command and describe 0G
as credential-gated rather than claiming a live receipt.

### 2:35-2:55 - Why I Would Use It Now

Say:

> I would use ProofForge today for my own projects: to turn unfinished repo
> tasks into clear missions, let agents safely help with checks or evidence,
> and keep track of what was actually accepted. Other builders can use it the
> same way for open-source projects, hackathon teams, grant work, bounties, or
> community backlogs.

### 2:55-3:15 - Future

Say:

> The bigger vision is a contribution layer for the agent economy. People bring
> projects, work becomes missions, agents help safely, evidence proves the work,
> humans accept it, and contributors earn credit, payout, reputation, access, or
> ownership-like benefits.

### 3:15-3:25 - Close

Say:

> ProofForge is not another marketplace. It is the proof and coordination layer
> for people, agents, and projects to build useful things together and keep
> value attached to the work.

## Exact Browser Click Path

```text
Settings
-> Reset demo state
-> Home / #opportunity
-> Set up proof node
-> Register proof node
-> Find source-backed work
-> Run this mission
-> Accept and run
-> Approve Packet
-> Copy reviewer link
-> Copy GitHub comment
-> Open GitHub issue
-> Submit Packet
-> Connect MetaMask or demo signer
-> paste GitHub acceptance URL
-> Record GitHub post
-> Sign acceptance
-> Accept & Mark Earned
-> View public proof
-> Settings
-> Prepare 0G upload
-> Prepare payout handoff
-> Publish shared project
-> optionally Pull shared project
```

If MetaMask is ready and you want to show the onchain beat, do it after the
proof is accepted:

```text
Maintainer Review
-> Deploy proof registry
-> Anchor onchain
```

Skip this optional beat if MetaMask or the network causes friction.

## Terminal Proof Commands

Run these before recording:

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run smoke:web
npm run demo:packet
npm run sync:web-proof
```

Optional, if 0G credentials are configured:

```bash
npm run 0g:check
npm run 0g:upload-record -- --in <proof-network-record.json>
```

Optional payout handoff:

```bash
npm run payout:handoff -- --payout demo-output/docs-install/packet/payout.json --record <proof-network-record.json> --recipient <wallet>
```

Optional production smoke:

```bash
npm run smoke:web:prod
```

## Show These Generated Files

```text
demo-output/docs-install/packet/evidence-packet.json
demo-output/docs-install/packet/case-file.md
demo-output/docs-install/packet/policy.json
demo-output/docs-install/packet/public-packet.json
demo-output/docs-install/packet/payout.json
demo-output/docs-install/packet/project.json
demo-output/docs-install/packet/submission-evidence.json
demo-output/docs-install/packet/submission-evidence.md
```

## Prize-Relevant Proof Points

- 0G: evidence records can be uploaded through credential-gated runner tooling,
  and the app records the returned receipt.
- ENS: wallet/identity direction is visible through signer identity; only claim
  live ENS if the submitted build uses a verified ENS record.
- Agent tooling: ProofForge defines bounded proof nodes, allowed/blocked
  actions, skills, verifier checks, and evidence packets.
- GitHub/open-source work: source issue, maintainer post, and public proof are
  linked without holding GitHub credentials.
- Payout rails: Safe, Splits, and Drips handoff metadata exists without custody.

## Do Not Claim

- automatic payment settlement
- automatic PR creation
- automatic GitHub posting
- hosted multi-user backend
- private 0G key in the browser
- live ENS, AXL, KeeperHub, or Uniswap integrations unless separately verified
- payment receipt as proof unless linked to accepted proof
