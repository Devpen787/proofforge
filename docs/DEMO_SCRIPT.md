# ProofForge Demo Script

## One-Line Pitch

ProofForge turns existing software work into safe missions, verified evidence packets, contributor credit, and earned payout records.

## Demo Goal

Show that the system does not invent a new work economy. It imports existing work, scopes it, runs a safe proof workflow, and produces reviewable artifacts.

## 2-4 Minute Flow

### 1. Open With The Problem

Developers now have agents, spare machines, and AI tools, but the output is noisy. Maintainers do not need more raw AI work. They need proof they can trust.

### 2. Import Existing Work

Run:

```bash
npm run import:github -- --url https://github.com/microsoft/vscode/issues/1
```

Point out:

- ProofForge reads public issue data.
- It creates a Work Lead.
- It does not post comments, open PRs, or trigger payment.
- Vague work stays in triage instead of becoming agent spam.

### 3. Generate The Proof Packet

Run:

```bash
npm run demo:packet
```

Point out the generated artifacts:

```text
demo-output/docs-install/packet/evidence-packet.json
demo-output/docs-install/packet/case-file.md
demo-output/docs-install/packet/public-packet.json
demo-output/docs-install/packet/payout.json
demo-output/docs-install/packet/project.json
```

### 4. Explain The Artifact Chain

The demo proves this loop:

```text
Project
-> Work Lead
-> Mission
-> Local Runner
-> Independent Verifier
-> Evidence Packet
-> Public-Safe Packet
-> Earned Payout
-> Project Credit
```

Important details:

- The runner captures logs and environment.
- The verifier checks the runner artifacts independently.
- The public packet strips local paths and private storage refs.
- The payout is earned, not automatically released.
- Project credit records who contributed useful accepted proof.

### 5. Show The Web Prototype

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/
```

Screens to show:

- Opportunity: useful work is visible.
- Work Queue: raw work is triaged before agents run.
- Projects: accepted proof grows a shared project.
- Runner: no external action happens without approval.
- Case Files: evidence is reviewed before submission.
- Maintainer: clean proof, not agent noise.
- Scoreboard: earned payout and reputation clarity.

Direct routes:

```text
/#work-queue
/#projects
/#run
/#case-file
/#maintainer
/#scoreboard
```

## Closing Line

ProofForge is a coordination layer for builders who already have agents and tools. The point is not more generated code. The point is useful work that holds.
