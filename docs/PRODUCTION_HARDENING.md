# Production Hardening

ProofForge V1 is credential-light and local-first. It can be used as an
operational proof flow without a hosted database, but a larger public network
needs these controls before broad production use.

## Already In V1

- Source authority stays with GitHub, bounty platforms, or project owners.
- GitHub writeback is user-owned: ProofForge copies comments and records posted
  URLs, but does not hold GitHub tokens.
- Wallet acceptance can be signed through MetaMask.
- Accepted proof can be anchored through the `ProofRegistry` contract.
- 0G upload uses runner tooling so private keys stay out of the browser.
- Payout handoff creates Safe, Splits, and Drips metadata without moving funds.
- Mutable project sync is optional through a shared GUN key and peer URL.
- Public proof only shows public-safe references and receipts.

## Before A Public Multi-User Network

- Add rate limits and abuse controls for any hosted relay, indexer, or helper.
- Add signed project invitations and explicit project role records.
- Add conflict policy for shared project sync beyond last-writer import.
- Add read-only chain receipt verification for payout references.
- Add contract verification and deployment addresses per supported network.
- Add 0G receipt verification in the browser or a local helper.
- Add privacy review for all public proof fields and imported URLs.
- Add backup/export reminders for local-first users.

## Boundaries To Preserve

- Do not custody funds.
- Do not store private 0G keys in the browser.
- Do not store GitHub OAuth tokens in the browser.
- Do not treat payment receipts as proof unless linked to accepted proof.
- Do not replace GitHub or project owner permissions.
