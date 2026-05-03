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
- `npm run 0g:upload-record -- --in <record.json>` can publish the network
  record to 0G Storage from runner tooling, keeping private keys out of the
  browser.
- `npm run sync:publish-record -- --record <record.json> --receipt <0g-receipt.json>`
  writes a share manifest with the 0G root, transaction reference, content hash,
  and acceptance-signature verification status.
- `npm run sync:pull-record -- --manifest <sync.json>` can pull the immutable
  record from 0G by root hash, verify the content hash, and verify the
  acceptance signature before browser import. For offline checks, add
  `--record <local-record.json>` to validate an already downloaded copy.
- Settings can export a ProofForge project record. It carries project metadata,
  source URLs, mission state, accepted proof refs, payout refs, and local
  workspace state.
- `npm run sync:publish-project -- --record <project-record.json> --receipt <0g-receipt.json>`
  writes a project sync manifest with the 0G root and content hash.
- `npm run sync:pull-project -- --manifest <project-sync.json>` can pull and
  verify that project snapshot before browser import.
- Settings can publish or pull a mutable shared project through an optional GUN
  peer URL and project sync key. Without a peer URL, it remains local-first in
  the browser. This is the first realtime/open-source sync adapter; 0G project
  records remain the verifiable snapshot fallback.
- The network record includes the packet identity, project, verifier, storage
  reference, authority posture, and explicit boundaries.

This means a judge, maintainer, or contributor can open a hosted ProofForge URL
and see the relevant proof state without needing a ProofForge account. They can
also move the same state across machines as a 0G-backed proof record or project
record plus sync manifest.

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

## Shared Sync Boundary

The V1 sync model is immutable-record sync, not realtime collaborative editing.
ProofForge publishes accepted proof records and project snapshots, then other
users pull and verify those records. For mutable workspace coordination, the app
can also publish a project record through GUN using a shared sync key and
optional peer URL. This solves cross-machine proof and project state sharing
without turning ProofForge into a custodial marketplace, repo permission system,
or payment processor.

## What Remains For Full Network Production

A later network layer can add mutable project/review collaboration on top of
the same record shape through one or more of:

- Ceramic streams for mutable project/review state
- GUN or OrbitDB for local-first peer sync
- EVM events for accepted credit anchors and payout receipt references

The product should keep the same authority boundary: ProofForge should not
become a custodial marketplace or repository permission system.
