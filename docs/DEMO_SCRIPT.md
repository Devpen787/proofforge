# ProofForge 2-Minute Demo Script

Use this script for the hackathon video. It is written as a recording plan:
what to show, what to click, and what to say.

## Five-Second Pitch

ProofForge turns real GitHub and open-source work into bounded agent missions,
verified evidence packets, maintainer acceptance, and tracked credit or payout.

## Pre-Recording Setup

Do this before recording so the video stays tight.

```bash
cd "/Users/devinsonpena/Documents/New project 6/proofforge"
npm test
npm run build
npm run ens:check -- --name <your-agent.eth> --address <agent-wallet>
npm run demo:packet
npm run sync:web-proof
npm run dev
```

Optional if showing payout release in the browser:

```bash
npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json
npm run sync:web-proof
```

Optional if the browser is already in a completed state and you want a clean
first-run recording, run this in the browser console before recording:

```js
localStorage.removeItem("proofforge.v1.demo-state");
location.hash = "opportunity";
location.reload();
```

Open the app:

```text
http://localhost:5173/#opportunity
```

## Recording Script

### 0:00-0:10 - Open On Home

Screen:

- Show Home at `/#opportunity`.
- Keep the profile, wallet state, project status, tracker, and activity visible.

Voiceover:

> ProofForge turns real software work into safe agent missions. A developer
> connects a proof node, finds sourced work, runs a bounded agent, and gets an
> evidence packet a maintainer can accept.

Click:

- If the primary button says `Set up proof node`, click it.
- If the primary button says `Start sourced proof`, click it and continue from
  `First Run`.

### 0:10-0:25 - Register The Agent

Screen:

- Show Agent Setup.
- Point at proof node identity, owner, skills, and blocked actions.

Voiceover:

> The agent angle is not hidden. The product starts by registering a proof node:
> who owns it, what it can do, and what it is blocked from doing. In V1, it can
> inspect, run local checks, and package evidence. It cannot spend funds, open
> PRs, or post externally without a human step.

Click:

- Click `Register proof node`.
- Click `Find source-backed work`.

### 0:25-0:40 - Show Work Inventory

Screen:

- Show Opportunities at `/#work-queue`.
- Show the imported GitHub issue field and the mission list.

Voiceover:

> ProofForge does not ask agents to freestyle. Work starts from a source: a
> GitHub issue, project backlog, marketplace task, or maintainer request. The
> inventory separates ready missions from work that needs clarification.

Click:

- Click `Assess` on `Validate installation docs`.
- On Mission Detail, pause on source, reward, proofability, agent fit, and
  acceptance owner.

### 0:40-0:55 - Accept One Mission

Screen:

- Show Mission Detail at `/#mission-detail`.

Voiceover:

> Before the agent runs, the user sees what will be proven, which proof node
> will run it, what value is attached, and what the acceptance path is. This is
> the coordination layer: source, agent, proof, acceptance, value.

Click:

- Click `Authorize agent run`.

### 0:55-1:15 - Run The Bounded Agent

Screen:

- Show Runner at `/#run`.
- Keep Live output visible.
- Show the proof trace if it fits cleanly; otherwise keep focus on the top run
  summary and terminal-like output.

Voiceover:

> Now the proof node runs inside the allowed boundary. It checks the source,
> runs the local proof command, captures logs and environment, blocks external
> actions, and writes the artifacts that become the evidence packet.

Click:

- Click `Review evidence packet`.

### 1:15-1:30 - Submit The Case File

Screen:

- Show Case File at `/#case-file`.
- Show result, decision recommendation, artifacts, privacy, security, and 0G
  storage reference if present.

Voiceover:

> The output is not just a screenshot or chat transcript. It is a case file with
> runner output, verifier checks, privacy review, security boundaries, and a
> public-safe packet. When configured, ProofForge can anchor the packet through
> 0G Storage so the proof has a durable reference.

Click:

- Click `Submit to maintainer`.

### 1:30-1:45 - Maintainer Accepts

Screen:

- Show Maintainer Review at `/#maintainer`.

Voiceover:

> The maintainer gets the decision surface, not agent noise. They can accept,
> request revision, or reject. Acceptance creates the earned record, project
> credit, and payout state.

Click:

- Click `Review Packet` if needed.
- Click `Accept & Mark Earned`.

### 1:45-2:05 - Show Earned Value And Public Proof

Screen:

- Show My Work at `/#scoreboard`.
- Show accepted proof, earned payout, release state, reputation, and activity.

Voiceover:

> This is what makes it usable today: the work can be sourced, bounded, proven,
> reviewed, and credited. V1 tracks payout manually, so it does not pretend to
> be automatic settlement. It gives teams an auditable record they can use now.

Click:

- If visible, click `Release payout`.
- Click `View public proof`.

### 2:05-2:20 - Close On Proof And Prize Relevance

Screen:

- Show Public Proof at `/#public-proof`.
- Then briefly show terminal output or generated files:

```text
demo-output/docs-install/packet/evidence-packet.json
demo-output/docs-install/packet/case-file.md
demo-output/docs-install/packet/public-packet.json
demo-output/docs-install/packet/submission-evidence.md
```

Voiceover:

> For 0G, ProofForge is agent infrastructure: a proof node, skill and permission
> boundary, durable evidence storage, and a working example agent mission. The
> ENS can resolve the agent identity attached to the packet. The next versions
> make source ingestion live, add stronger sandboxing, add peer agent
> coordination such as AXL, and move payout release from tracked/manual to real
> on-chain settlement.

Final line:

> ProofForge is the missing coordination layer between sourced work, bounded
> agents, maintainer trust, and portable proof of value.

## Fast Version If You Need 90 Seconds

1. Home: say the five-second pitch.
2. Agent Setup: register proof node and name the permissions.
3. Opportunities: show sourced inventory and choose one mission.
4. Runner: show bounded execution and artifacts.
5. Case File: submit the evidence packet.
6. Maintainer: accept and mark earned.
7. My Work/Public Proof: show credit, payout state, and shareable proof.

## Proof Shots To Include

Use at least one terminal shot so judges see this is not only a clickable mock.

```bash
npm test
npm run build
npm run ens:check -- --name <your-agent.eth> --address <agent-wallet>
npm run demo:packet
npm run sync:web-proof
```

If 0G credentials are configured, show readiness first:

```bash
npm run 0g:check
```

Then show the `Storage provider`, `Storage URI`, and `0G tx` lines printed by:

```bash
npm run demo:packet
```

If showing a real 0G testnet payout settlement instead of only manual release:

```bash
npm run settle:payout -- --in demo-output/docs-install/packet/payout.json
```

If showing manual payout release only:

```bash
npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json
```

## What To Say If Asked What Is Real Today

Real in V1:

- GitHub/source work can be imported into local Work Lead artifacts.
- Mission conversion can reject vague work and keep it in triage.
- A local proof node runs a bounded mission and writes artifacts.
- ENS identity can be resolved into an agent identity receipt and carried into
  the proof packet when configured.
- Verifier checks run against the generated artifacts.
- Evidence packet, case file, public packet, project credit, and payout records
  are generated.
- The web app demonstrates the full role flow from contributor to maintainer to
  public proof.
- 0G integration is usable when credentials are configured and the command
  returns a real storage reference or transaction hash.

Honest limits:

- Payout is tracked/manual in V1, not automatic wallet settlement.
- Maintainer review is an in-product role flow, not a live GitHub PR/comment
  workflow unless the GitHub submit command is run and succeeds.
- The web app uses seeded/generated product data, not a hosted backend.
- Production sandboxing, live OAuth ingestion, AXL agent messaging, KeeperHub
  execution, and Uniswap settlement are future tracks unless implemented and
  shown with real proof.

## Prize Positioning

Primary fit:

- `0G - Best Agent Framework, Tooling & Core Extensions`: ProofForge provides a
  reusable pattern for agent work intake, permissions, proof runs, evidence
  packets, and durable proof storage.
- `0G - Best Autonomous Agents, Swarms & iNFT Innovations`: the demo includes a
  working proof agent mission with persistent evidence and a clear path to more
  capable agent coordination.

Secondary/future fit:

- ENS: now credible if the video shows `npm run ens:check` resolving an agent
  name and the packet/public proof carrying that identity.
- Gensyn AXL: peer-to-peer agent coordination.
- KeeperHub: reliable execution and payment release.
- Uniswap: agentic settlement only if a real API integration is added.

Do not present secondary tracks as completed unless the video shows them working.
