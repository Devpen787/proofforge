# AgentOps Lane State

This file keeps ProofForge hydrated when the broader AutoBots AgentOps lane
overview does not yet list this worktree.

## Active Lane

`ProofForge production hardening / product-systems`

## Current Mission

Make ProofForge a production-level contribution and proof layer:

```text
source-backed work
-> qualified mission
-> bounded agent/proof-node run
-> verifiable PFEP Proof Pack
-> maintainer or steward acceptance
-> private credit / payout / reputation history
-> optional scoped public proof
```

## Operating Rules

- Proof Pack verification is the lowest-level product primitive.
- Source intake creates Work Leads first; it does not create fake work,
  fake payouts, or automatic external submissions.
- ProofForge is private by default. Accepted proof does not automatically
  publish a profile, wallet, payout, income history, or full agent-work log.
- Public Proof is an explicit scoped receipt after privacy review.
- Cell System and marketplace research are source/reference inputs only.
  ProofForge is the working surface.
- Hackathon OS lessons are quality discipline, not the product goal.

## Recommended Skills / Lenses

Use these AutoBots/skills lenses when the task needs them:

| Lens                            | Use for                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| `product-ux-reference-review`   | Compare product quality, structure, and user journey quality. |
| `repo-intelligence-flywheel`    | Turn external repos/sources into reusable product inputs.     |
| `coding-agent-reference-review` | Review proof-node, agent, runner, and verifier references.    |
| `browser-flow-reference-review` | Click through user flows and catch visual/UX regressions.     |

## Current Execution Gate

Before a larger build pass:

1. Preserve the verified privacy/source-intake baseline.
2. Keep `README_PROPOSAL.md` out of commits unless explicitly requested.
3. Run the production gates after changes:

```bash
npm run format:check
npm run typecheck
npm test
npm run smoke:web
npm run build
npm run lint
```

## Next Product Slices

1. Source Registry / Work Lead intake.
2. Real project workspace persistence and account boundaries.
3. Maintainer reviewer links backed by durable state.
4. External source writeback/handoff integrations.
5. Public proof publication controls and audit history.
