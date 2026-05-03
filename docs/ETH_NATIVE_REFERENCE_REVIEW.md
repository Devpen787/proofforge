# ETH-Native Implementation Reference Review

This note tracks open-source and hackathon references that overlap with
ProofForge's V1 target:

```txt
source-backed work -> bounded proof node -> evidence packet -> human acceptance -> credit/payout state -> public proof
```

No reviewed project implements that exact contribution-proof layer end to end.
The useful path is to borrow narrow implementation patterns, not product scope.

## References To Borrow From

### 0G BuildProof

- Repo: https://github.com/TS-mfon/0g-buildproof
- Useful pattern: GitHub repo submission, agent review pipeline, evidence report,
  0G Storage upload, public passport, judge-facing review surface.
- Best fit for ProofForge: Case File, 0G packet reference, reviewer screen, and
  public proof structure.
- Do not copy: hackathon-submission scoring as the main product model.
  ProofForge is broader contribution coordination, not only judge review.

### RepoRewards

- Repo: https://github.com/Krane-Apps/repo-rewards-superhack-2024
- Useful pattern: GitHub-backed contribution tracking and wallet payout after a
  contribution is accepted.
- Best fit for ProofForge: accepted-proof ledger, contributor wallet identity,
  payout receipt tracking, and project-level value rollup.
- Do not copy: automatic payout as a V1 default. ProofForge V1 should track
  manual/external release unless settlement is explicitly configured.

### Proofrun

- Repo: https://github.com/rokabytedev/proofrun
- Useful pattern: agents should prove work with captured evidence, screenshots,
  steps, judgments, and a human review loop.
- Best fit for ProofForge: Runner trace, verifier state, evidence artifacts,
  and the principle that agents create reviewable proof rather than unchecked
  claims.
- Do not copy: app UI verification as the only proof type. ProofForge missions
  cover docs, repos, source tasks, bounties, and project work.

### Signet

- Repo: https://github.com/Prismer-AI/signet
- Useful pattern: cryptographically signed agent actions and portable
  attestation bundles.
- Best fit for ProofForge: future proof-node action signatures, hash-chained
  evidence packets, and provider-independent audit trails.
- Do not copy for V1: full cryptographic attestation infrastructure unless it
  can be added without slowing the core proof journey.

### 0G Storage Client

- Repo: https://github.com/0gfoundation/0g-storage-client
- Useful pattern: upload files to 0G Storage, retain Merkle root / transaction
  references, and retrieve proof artifacts.
- Best fit for ProofForge: durable proof packet storage and public proof links.
- Do not copy: node operation or hot-storage complexity into the frontend V1.

### Polar / GitPay / Bountysource

- Polar: https://github.com/polarsource/polar
- GitPay: https://github.com/worknenjoy/gitpay
- Bountysource: https://github.com/bountysource/core
- Useful pattern: funded issue/workflow, maintainer acceptance, and payout
  tracking.
- Best fit for ProofForge: project value rules, manual payout receipts, and
  maintainer-owned acceptance.
- Do not copy: marketplace positioning. ProofForge is the proof and
  coordination layer between source work and recognized value.

## V1 Implementation Choices

ProofForge V1 should stay local-first and ETH-native:

- GitHub issue import creates a real mission.
- Wallet/ENS identify contributor and proof node.
- The bounded proof node shows source assessment, permissions, run output, and
  verifier result.
- Case File exports a portable proof packet.
- 0G stores proof packet artifacts when configured.
- Maintainer acceptance creates credit and earned payout state.
- My Work records manual wallet payout receipts.
- Public Proof shows accepted source, proof node, storage reference, value, and
  payout state.

## Later Upgrades

- Signed proof-node action bundles inspired by Signet.
- Proofrun-style screenshot/report artifacts for UI-oriented missions.
- 0G Chain anchoring for accepted proof summaries.
- GitHub App/OAuth for private repos and maintainer review links.
- Optional automatic settlement, only after manual payout tracking is reliable.
