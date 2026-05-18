# ProofForge Documentation Map

Use this page to avoid doc sprawl.

## Follow These

| Doc                                                                                | Use it for                                                                             |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`PRODUCT_BLUEPRINT.md`](./PRODUCT_BLUEPRINT.md)                                   | Compact master journey, architecture, Web3/bounty hook, dependencies, and build order. |
| [`OPERATING_GUIDE.md`](./OPERATING_GUIDE.md)                                       | Current product, UX, integration, and build rules. Start here.                         |
| [`CONTRIBUTION_GRAPH.md`](./CONTRIBUTION_GRAPH.md)                                 | Connected contribution, project buckets, agent rollup, and cross-source credit model.  |
| [`CONTRIBUTION_FLYWHEEL.md`](./CONTRIBUTION_FLYWHEEL.md)                           | Circular product loop across source connection, project tracking, proof, and value.    |
| [`ETHEREUM_WEB3_BOUNTY_INTEGRATION.md`](./ETHEREUM_WEB3_BOUNTY_INTEGRATION.md)     | Ethereum, wallet, onchain receipt, bounty source, and V1/V2/V3 Web3 boundaries.        |
| [`JOURNEYS.md`](./JOURNEYS.md)                                                     | Detailed personas, journeys, edge cases, and UX done gates.                            |
| [`STORYBOARD_ALIGNMENT_MAP.md`](./STORYBOARD_ALIGNMENT_MAP.md)                     | Detailed storyboard-to-journey, architecture, Web3/bounty, and redesign gap map.       |
| [`GITHUB_MCP_DISCOVERY_EXERCISE.md`](./GITHUB_MCP_DISCOVERY_EXERCISE.md)           | Pre-implementation discovery plan for ETHGlobal/GitHub prior art and Ethereum MCPs.    |
| [`PRODUCT_STORYBOARD.md`](./PRODUCT_STORYBOARD.md)                                 | Screen-by-screen product mock and pre-code UI contract.                                |
| [`PRODUCT_ROADMAP_VERSIONS.md`](./PRODUCT_ROADMAP_VERSIONS.md)                     | V1/V2/V3 product journey split and build boundaries.                                   |
| [`LIFECYCLE_MAP.md`](./LIFECYCLE_MAP.md)                                           | Object state transitions and gates.                                                    |
| [`ACCEPTANCE_MATRIX.md`](./ACCEPTANCE_MATRIX.md)                                   | Journey-step acceptance criteria and required verification.                            |
| [`VALUE_AND_OWNERSHIP_MODEL.md`](./VALUE_AND_OWNERSHIP_MODEL.md)                   | Value, payout, credit, benefits, ownership, and distribution rules.                    |
| [`WORK_SOURCE_QUALIFICATION.md`](./WORK_SOURCE_QUALIFICATION.md)                   | Work-source discovery, qualification, proofability, and follow-up rules.               |
| [`SOURCE_MARKETPLACE_OPERATING_MODEL.md`](./SOURCE_MARKETPLACE_OPERATING_MODEL.md) | Source/marketplace lanes, Cell System import boundary, and real-work operating loop.   |
| [`PUBLICATION_PRIVACY_MODEL.md`](./PUBLICATION_PRIVACY_MODEL.md)                   | Private-by-default account model and scoped public proof rules.                        |
| [`AGENTOPS_LANE_STATE.md`](./AGENTOPS_LANE_STATE.md)                               | Current production lane, AgentOps hydration rules, and next execution gates.           |
| [`SUBMISSION_CHECKLIST.md`](./SUBMISSION_CHECKLIST.md)                             | Final hackathon submission gate.                                                       |
| [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md)                                               | Demo recording flow and talking points.                                                |
| [`DEPENDENCY_AUDIT.md`](./DEPENDENCY_AUDIT.md)                                     | Current dependency risk and mitigation notes.                                          |
| [`PRODUCTION_HARDENING.md`](./PRODUCTION_HARDENING.md)                             | Production-readiness boundaries and hardening checklist.                               |
| [`NETWORK_PERSISTENCE_V1.md`](./NETWORK_PERSISTENCE_V1.md)                         | Credential-light record sharing, acceptance verification, and sync boundaries.         |

## Reference Only

Older planning docs live in [`reference/`](./reference/). They preserve detail, but they are not the day-to-day source of truth.

| Doc                                                                                              | Status                                                                                                                    |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| [`reference/UX_JOURNEY_RULES.md`](./reference/UX_JOURNEY_RULES.md)                               | Folded into `OPERATING_GUIDE.md`; keep for deeper UX rationale.                                                           |
| [`reference/INTEGRATION_PRE_SUBMISSION_PLAN.md`](./reference/INTEGRATION_PRE_SUBMISSION_PLAN.md) | Folded into `OPERATING_GUIDE.md`; keep for detailed integration thinking.                                                 |
| [`reference/BOUNTY_ALIGNMENT.md`](./reference/BOUNTY_ALIGNMENT.md)                               | Folded into `OPERATING_GUIDE.md`; keep for bounty-specific claim gates.                                                   |
| [`reference/AGENT_ORCHESTRATION_RESEARCH.md`](./reference/AGENT_ORCHESTRATION_RESEARCH.md)       | External multi-agent framework, agent identity, credit pooling, and topic market fit; use as adapter strategy background. |
| [`reference/AI_NATIVE_STRATEGY_CROSSWALK.md`](./reference/AI_NATIVE_STRATEGY_CROSSWALK.md)       | Public-safe crosswalk from the private AI-native strategy memo to the active product docs.                                |
| [`reference/GITHUB_MCP_DISCOVERY_RESULTS.md`](./reference/GITHUB_MCP_DISCOVERY_RESULTS.md)       | Completed ETHGlobal/GitHub prior-art, bounty mechanics, and Ethereum MCP discovery results.                               |
| [`reference/BUILD_PLAN.md`](./reference/BUILD_PLAN.md)                                           | Historical implementation plan; use operating guide for current priorities.                                               |
| [`reference/VISUAL_WALKTHROUGH.md`](./reference/VISUAL_WALKTHROUGH.md)                           | Route-by-route reference; update only if used for recording.                                                              |

## Rule

If you are unsure what to follow, follow:

```text
PRODUCT_BLUEPRINT.md
OPERATING_GUIDE.md
PRODUCT_STORYBOARD.md
```

If an older reference doc conflicts with them, the operating guide wins.

## Production Proof Commands

Use these when checking whether ProofForge evidence is real, not just visible in
the UI:

```bash
npm run demo:packet
npm run intake:source -- --url https://github.com/owner/repo/issues/123 --owner @maintainer --proof "reproduction logs" --value "project credit"
npm run verify:packet -- demo-output/docs-install/packet/evidence-packet.json
npm run verify:acceptance -- <record.json>
```

`intake:source` is the normalized Source Registry gate. It records GitHub,
marketplace, bounty/grant, docs, or project-request URLs as Work Leads and marks
them as `ready_to_qualify`, `needs_triage`, or blocked until owner, proof,
value, and safety requirements are clear.

`verify:packet` is the PFEP-v0 packet verification gate. It validates the
explicit `pfepVersion` marker, schema, artifact hashes, verifier consistency,
privacy review, protocol references, and prints the packet digest used to
connect proof records to later acceptance, storage, ledger, and public-proof
surfaces.
