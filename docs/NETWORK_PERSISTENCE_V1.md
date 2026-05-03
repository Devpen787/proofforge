# Network Persistence V1

ProofForge V1 uses credential-light persistence. It does not need GitHub OAuth,
a central app account, or custody over funds to move proof records between
people.

## What Works Now

- The browser keeps the active workspace locally.
- Reviewer links carry the proof state in the URL hash.
- Public proof links carry the accepted proof state in the URL hash.
- Settings can export the current workspace as JSON.
- Settings can export a ProofForge network record as JSON.
- MetaMask can sign an accepted proof when a browser wallet is available.
- Demo/local signing remains explicit when no browser wallet provider exists.
- `npm run verify:acceptance -- <record.json>` can recover and check browser
  wallet signatures from exported records.
- The network record includes the packet identity, project, verifier, storage
  reference, authority posture, and explicit boundaries.

This means a judge, maintainer, or contributor can open a hosted ProofForge URL
and see the relevant proof state without needing a ProofForge account.

## Authority Model

ProofForge prepares and records proof. Existing authority systems still execute
the authoritative action:

- GitHub owns repo permissions, comments, issues, and PRs.
- Wallets own identity signatures and payment receipts.
- Maintainers own acceptance decisions.
- 0G or another storage network owns durable packet storage when configured.
- ProofForge records links, hashes, signatures, receipts, and proof state.

## Why This Is V1

This is enough for a usable operational V1 because the product can prove the
core contribution loop across machines:

```text
source work -> mission -> bounded agent proof -> evidence packet
-> reviewer link -> acceptance -> public proof / credit record
```

## What Remains For Full Network Production

The current V1 does not yet provide automatic decentralized sync. A later
network layer should persist the same network record shape to one or more of:

- 0G Storage for durable proof packets and record roots
- Ceramic streams for mutable project/review state
- GUN or OrbitDB for local-first peer sync
- EVM events for accepted credit anchors and payout receipt references

The product should keep the same authority boundary: ProofForge should not
become a custodial marketplace or repository permission system.
