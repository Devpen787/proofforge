# ProofForge Submission Checklist

Use this before final hackathon submission.

## Required Links

- Public GitHub repository: `https://github.com/Devpen787/proofforge`
- Local demo URL: `http://localhost:5173/#opportunity`
- Deployed demo URL: add after deployment
- Demo video URL: add after recording

## Demo Video Requirements

- Length: 2-4 minutes
- Resolution: at least 720p
- Audio: clear spoken narration, not music-only
- Show the repository and the working product
- Show at least one terminal proof command
- Show the browser proof loop from work to payout state

## Recommended Video Flow

1. State the problem: agents create more output, but maintainers need trusted proof.
2. Run `npm run demo:packet`.
3. Show generated artifacts under `demo-output/docs-install/packet/`.
4. Run `npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json`.
5. Open the web app at `http://localhost:5173/#opportunity`.
6. Click through:
   - Opportunity
   - First Run
   - Work Queue
   - Runner
   - Case File
   - Maintainer
   - Scoreboard
   - Public Proof
7. Close with: ProofForge turns existing work into safe missions, evidence packets, accepted proof, and credit.

## Judge Run Commands

```bash
npm install
npm test
npm run build
npm run demo:packet
npm run dev
```

Optional payout release command:

```bash
npm run release:payout -- --in demo-output/docs-install/packet/payout.json --out demo-output/docs-install/packet/released-payout.json
```

Optional public work import command:

```bash
npm run import:github -- --url https://github.com/microsoft/vscode/issues/1
```

## Browser Routes

```text
http://localhost:5173/#opportunity
http://localhost:5173/#first-run
http://localhost:5173/#projects
http://localhost:5173/#work-queue
http://localhost:5173/#run
http://localhost:5173/#case-file
http://localhost:5173/#maintainer
http://localhost:5173/#scoreboard
http://localhost:5173/#public-proof
```

## What Works Now

- GitHub issue import creates a local Work Lead from public issue data.
- Mission conversion blocks vague or incomplete work.
- Local runner creates deterministic proof artifacts.
- Independent verifier checks runner artifacts.
- Evidence Packet, Case File, Public Packet, Policy, Payout, and Project artifacts are generated.
- Earned payout and released payout are separate accounting states.
- Web prototype demonstrates the user journey and review surfaces.
- Route registration has automated test coverage.

## Known Limits

- The current runner is deterministic and local; Docker-backed sandboxing is a later step.
- The web app is a product prototype using seeded data, not a hosted backend.
- Payments are manual accounting artifacts only; no automatic transfer or escrow happens.
- 0G storage is adapter-gated and uses local storage unless credentials are configured.
- ProofForge does not post GitHub comments, open pull requests, or contact maintainers automatically.

## Final Pre-Submit Gate

Run:

```bash
npm test
npm run build
npm run demo:packet
```

Then verify the browser routes above and confirm the submission form has the repository, deployed demo URL, and demo video URL.
