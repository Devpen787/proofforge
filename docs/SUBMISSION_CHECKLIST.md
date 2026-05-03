# ProofForge Submission Checklist

Use this before final ETHGlobal submission.

## Required Links

- Public GitHub repository: `https://github.com/Devpen787/proofforge`
- Deployed demo: `https://proofforgehub.vercel.app`
- Local demo: `http://localhost:5175/#opportunity`
- Demo video URL: add after recording
- Contract deployment address: add if you deploy `ProofRegistry` during the
  final recording
- 0G receipt/root: add if you run a live 0G upload during the final recording

## Final Verification Gate

Run from the repository root:

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run smoke:web
npm run smoke:web:prod
npm audit --audit-level=moderate
```

Proof artifact commands:

```bash
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

## Demo Video Requirements

- Length: 2-4 minutes
- Target: around 2 minutes so the final edit stays under 4 minutes
- Resolution: at least 720p
- Audio: spoken human narration
- Show the hosted app, not only localhost
- Show at least one terminal proof command
- Show the browser proof loop from sourced work to public proof

Use [DEMO_SCRIPT.md](DEMO_SCRIPT.md) as the recording script.

## Exact Video Flow

1. Open with the problem: agents create output, but projects need accepted proof.
2. Show Home and Agent Setup.
3. Show Opportunities and run the sourced docs mission.
4. Approve the packet and submit it.
5. On Maintainer Review, record the GitHub post URL.
6. Sign acceptance with wallet or demo signer.
7. Optionally deploy/anchor with `ProofRegistry` if MetaMask is ready.
8. Accept as maintainer.
9. Show Public Proof.
10. Show Settings handoffs:
    - Prepare 0G upload
    - Record 0G receipt/root
    - Prepare payout handoff
    - Publish shared project
    - Pull shared project
11. Close with ProofForge as the contribution proof and coordination layer.

## Browser Routes

```text
Home: https://proofforgehub.vercel.app/#opportunity
Agent Setup: https://proofforgehub.vercel.app/#agent-setup
Projects: https://proofforgehub.vercel.app/#projects
Opportunities: https://proofforgehub.vercel.app/#work-queue
Mission Detail: https://proofforgehub.vercel.app/#mission-detail
Runner: https://proofforgehub.vercel.app/#run
Case File: https://proofforgehub.vercel.app/#case-file
Maintainer Review: https://proofforgehub.vercel.app/#maintainer
My Work: https://proofforgehub.vercel.app/#my-work
Builder Passport: https://proofforgehub.vercel.app/#builder-passport
Public Proof: https://proofforgehub.vercel.app/#public-proof
Settings: https://proofforgehub.vercel.app/#settings
```

## What Works Now

- Public GitHub issue import creates local Work Leads.
- Mission conversion blocks vague work.
- Local runner creates deterministic proof artifacts.
- Independent verifier checks runner artifacts.
- Case File creates a maintainer-ready packet.
- GitHub handoff copies a maintainer comment and opens the source issue.
- Maintainer Review records the posted GitHub comment URL.
- Wallet acceptance uses MetaMask when available.
- `ProofRegistry` can be deployed and used to anchor accepted proof.
- Settings prepares 0G upload commands and records returned receipts.
- Settings prepares Safe/Splits/Drips payout handoff commands.
- Settings publishes and pulls shared project state through GUN.
- Public Proof shows source, maintainer post, artifacts, onchain anchor,
  0G receipt, payout receipt, and credit state.
- Production and local smoke tests cover the full proof journey.

## Partner Prize Claims To Keep

Only name prizes that match real product behavior.

- **0G**: ProofForge uses 0G as durable evidence-record storage through
  credential-gated runner upload and browser receipt recording.
- **ENS**: only claim if final build uses a verified ENS identity/subname in the
  submitted product. Otherwise describe it as roadmap/identity direction.
- **Agent framework/tooling**: ProofForge provides bounded proof-node workflow,
  skills/permissions, verifier checks, evidence packets, and accepted proof
  records.

Do not claim Uniswap, KeeperHub, or Gensyn AXL unless separately implemented and
verified before submission.

## Known Boundaries

- ProofForge does not custody funds.
- ProofForge does not automatically settle payouts.
- ProofForge does not store GitHub OAuth tokens.
- ProofForge does not put private 0G keys in the browser.
- GitHub posting is user-owned handoff, not automatic bot posting.
- Shared GUN sync is a V1 adapter, not a hardened enterprise permission system.
- Payout receipts are value references only when linked to accepted proof.

## Final Pre-Submit Evidence

Attach or reference:

- latest commit hash
- Vercel deployment URL
- demo video URL
- optional deployed `ProofRegistry` address
- optional onchain proof anchor transaction
- optional 0G receipt/root
- proof command outputs from the final verification gate
