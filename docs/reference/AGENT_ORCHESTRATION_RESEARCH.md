# Agent Orchestration Research Fit

> Reference only. The current source of truth is
> [`../OPERATING_GUIDE.md`](../OPERATING_GUIDE.md).

This note maps existing multi-agent frameworks to ProofForge. The conclusion is simple: agent orchestration is not the differentiator by itself. It is the supply and coordination layer. ProofForge's differentiator is accepted proof, credit, benefits, payout records, and project growth.

## What The Feedback Confirms

The market already has strong tools for:

- persistent human-agent workspaces
- role-based agent teams
- stateful workflows
- human-in-the-loop review
- shared context and memory
- agent handoffs

That is good for ProofForge. It means we do not need to invent every agent runtime. We need to make agent work useful, verifiable, accepted, credited, and reusable.

## Strategic Takeaway

ProofForge should not compete as "yet another multi-agent framework."

ProofForge should become:

```text
the proof, credit, and payout layer for useful work produced by humans, agents, and nodes
```

External agent frameworks can plug in as:

- agent workspace providers
- runner backends
- verifier backends
- coordination trace sources
- project workrooms
- agent identity/discovery sources

They should not replace the ProofForge product loop:

```text
Project
-> Opportunity / Work Lead
-> Mission
-> Agent / Node Identity
-> Safe Run
-> Verifier
-> Coordination Trace
-> Evidence Packet
-> Maintainer Acceptance
-> Credit / Payout / Benefits
-> Proof Ledger
```

## Framework Fit

| Framework         | Verified fit                                                                                                                 | Where it could plug into ProofForge                                                      | Use before submission?                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| OpenAgents        | Shared persistent workspace where humans and agents collaborate with threads, files, browser, context, URLs, and @mentions.  | Project workroom, agent discovery, human-agent collaboration, coordination trace source. | Only if it can be demoed without distracting from proof loop.      |
| CrewAI            | Role-based agent crews with roles, tools, delegation, and collaborative task execution.                                      | Runner/verifier/packager internal implementation.                                        | Not necessary unless replacing our local trace is fast and stable. |
| AutoGen           | Multi-agent applications with autonomous or human-in-the-loop modes.                                                         | Human approval flow, reviewer/verifier conversation, agent handoff prototype.            | Not necessary unless we need a quick conversational agent demo.    |
| LangGraph         | Stateful, controllable, long-running agent workflows with human review paths.                                                | Future production workflow engine for mission states and gates.                          | Not necessary for MVP; useful later for reliability.               |
| MetaGPT / CAMEL   | Structured multi-agent roles and societies.                                                                                  | Inspiration for project teams and specialized agent roles.                               | No. Too broad for submission.                                      |
| Clawith           | Persistent agent identities, long-term memory, agent workspaces, org feed, delegation, and agent-to-agent updates.           | Future project workroom adapter, agent directory inspiration, identity and memory model. | No. Forking it now would pivot the prototype away from proof.      |
| HiClaw            | Controlled, auditable human-agent rooms with Manager/Worker orchestration, Matrix UI, MinIO shared files, and AI gateway.    | Future room adapter, shared-file trace source, credential gateway inspiration.           | No. Too infrastructure-heavy for the current local proof demo.     |
| Corellis          | OpenClaw fleet pattern with per-agent identity, shared memory, goal decomposition, Slack coordination, and secret injection. | Future proof-node fleet adapter and budget/key-routing inspiration.                      | No. Useful reference, not a hackathon dependency.                  |
| Polymarket Agents | AI-agent utilities for prediction markets, Polymarket APIs, RAG, market data, and autonomous trading.                        | Long-term inspiration for topic markets or external economic rails.                      | No. Legally risky and outside the accepted-proof MVP path.         |

Sources:

- OpenAgents GitHub and docs describe a shared workspace, persistent URL, shared context, files, browser, @mentions, and open collaboration principles: <https://github.com/openagents-org/openagents>, <https://openagents.org/docs/concepts/open-collaboration>
- CrewAI describes itself as an open-source multi-agent orchestration framework with role-based crews: <https://github.com/crewAIInc/crewAI>, <https://crewai.com/open-source>
- Microsoft AutoGen supports multi-agent applications and human-in-the-loop patterns: <https://github.com/microsoft/autogen>, <https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/human-in-the-loop.html>
- LangGraph is positioned for controllable agent workflows and human-in-the-loop review: <https://www.langchain.com/agents>
- Clawith describes persistent agent identity, long-term memory, dedicated workspace, Plaza-style knowledge feed, and local agent data storage: <https://github.com/dataelement/Clawith>
- HiClaw describes controlled auditable rooms, Manager/Worker orchestration, Matrix/Element communication, MinIO shared files, and Higress AI Gateway: <https://github.com/agentscope-ai/HiClaw>
- Corellis describes an OpenClaw-based coordinated fleet with shared memory, goal decomposition, Slack coordination, and secret injection: <https://github.com/CorellisOrg/corellis>
- Polymarket Agents describes a developer framework and utilities for AI agents that interact with Polymarket: <https://github.com/Polymarket/agents>

## May 2026 Feedback Cross-Reference

The latest feedback adds three important ideas:

1. Persistent agent companies and topic rooms are becoming common.
2. Credit/budget pooling is a real product angle, but risky if handled as raw API-key donation.
3. Topic markets and "build + bet" loops could become a future economic layer, but they are not the hackathon wedge.

The right response is not to fork a new agent OS before submission. The right response is to make ProofForge more clearly sit above those systems:

```text
agent workroom or runtime
-> proof-relevant trace
-> evidence packet
-> human acceptance
-> credit, benefits, payout record, and public proof
```

This keeps the project coherent. Clawith, HiClaw, Corellis, OpenAgents, CrewAI, AutoGen, and LangGraph can all become adapter sources later. ProofForge remains the product that turns their work into accepted proof.

## What Changes In The Product

### Agent Identity Must Be First-Class

The feedback is right that every useful agent needs an identity. ProofForge must show:

- agent or node name
- owner
- capability profile
- allowed actions
- blocked actions
- project attachment
- proof history
- budget or usage limit, once real costs are introduced

This belongs in Agent / Node Setup, project people-and-agents, runner trace, case file, and public proof.

### Agent Communication Must Be Captured, Not Exposed Raw

The user should not read chaotic agent chat. ProofForge should capture the proof-relevant communication:

```text
Runner produced artifact
Verifier checked artifact
Packager assembled case file
Human approved submission
```

If a future adapter provides a chat log or room transcript, the UI should summarize it into a coordination trace and keep the raw transcript behind an advanced disclosure.

### Project Workrooms Are Useful, But The UI Should Not Become Chat-First

Project pages should feel alive, but not like a group chat. The default project surface should show:

- open opportunities
- active work
- people and agents
- proof ledger
- benefits and unlocks
- funding and payout state when relevant

The live room/feed is useful later as a contextual workspace, not as the main navigation spine for first-time users.

### Credit Pooling Becomes Budgeting Before It Becomes Donation

The "unused credits" story is compelling, but raw API-key pooling creates security, billing, and trust problems. The MVP should not ask users to paste provider keys.

Safer sequence:

1. MVP: local modeled agent identity, no real spend.
2. Next: project run budget and usage receipts.
3. Later: provider-level spend limits through secure OAuth or a managed gateway.
4. Much later: pooled budgets, sponsor funds, or credit splits.

Product language should be:

```text
Set a run budget.
Track what your agent used.
Accepted proof credits the right people and agents.
```

not:

```text
Paste your API key so the group can use it.
```

### Topic Markets Are A Later Product, Not The Submission

Prediction markets and "build + bet" topics may be powerful, but they introduce legal, financial, and product risk. They should stay out of the MVP submission path.

If explored later, they must be framed as:

- project forecasts
- milestone commitments
- sponsor-backed outcomes
- non-custodial, compliance-reviewed market integrations

They must not dilute the current proof loop:

```text
Run useful work -> produce evidence -> human accepts -> credit/payout record
```

## Adopt / Defer / Avoid

| Decision            | Adopt now                                                                | Defer                                  | Avoid before submission                      |
| ------------------- | ------------------------------------------------------------------------ | -------------------------------------- | -------------------------------------------- |
| Agent identity      | Local proof node identity, owner, permissions, proof history             | ENS or other live identity adapters    | Anonymous or magical agents                  |
| Agent communication | Proof-relevant coordination trace                                        | AXL/OpenAgents/HiClaw room adapters    | Raw agent chat as the product                |
| Workrooms           | Project command room with open work, active work, people, agents, ledger | Persistent topic room/feed             | Dashboard full of internal process cards     |
| Credits             | Earned/released payout accounting, project ledger                        | Usage budgets and receipts             | Raw API-key donation or invisible spend      |
| Markets             | None in MVP                                                              | Forecasts or sponsor milestone markets | Trading/dividend claims without legal review |
| Frameworks          | Reference and adapter strategy                                           | Runtime adapter interface              | Forking Clawith/HiClaw/Corellis now          |

## Hard Guardrails

- Do not show chain-of-thought. Show rationale, sources, confidence, cost, artifacts, and decisions.
- Do not ask users to paste API keys into the MVP.
- Do not claim pooled credits, prediction markets, dividends, or crypto payouts unless they are implemented and compliance-reviewed.
- Do not make agent chat the main product surface.
- Do not replace the proof loop with an agent-orchestration demo.
- Do not add external frameworks unless they strengthen a working, end-to-end proof demo.

## How This Changes ProofForge

### 1. Agent Setup Becomes More Important

The app needs to answer:

```text
Which agent or node is mine?
What can it do?
What is blocked?
What projects can use it?
What proof has it produced?
How does accepted proof credit me?
```

This belongs in Agent / Node Setup and in project agent cards.

### 2. Coordination Trace Becomes A Product Asset

If existing frameworks already coordinate agents, ProofForge must capture the proof-relevant part:

```text
Runner captured evidence
Verifier checked it
Packager assembled the packet
Human approved submission
```

We do not need to show full agent chat. We need to show the trustworthy handoff.

### 3. Projects Should Feel Like Workrooms, Not Dashboards

The OpenAgents feedback reinforces the product direction:

```text
Project = persistent place where people and agents work on useful opportunities
```

But ProofForge should package this as:

- open opportunities
- active work
- attached agents/nodes
- accepted proof
- proof ledger
- benefits and payouts

not as a generic chat workspace.

### 4. Credit Pooling Is A Later Layer

The "unused AI credits" angle is compelling, but it is risky to implement literally before submission.

Do not ask users to paste or donate API keys in the MVP.

Safer product framing:

```text
Bring your own agent or node.
Accepted proof credits the owner.
Future project rules can split credit across humans, agents, nodes, and sponsors.
```

Later product:

- provider budget limits
- project-funded agent runs
- sponsor-funded missions
- node owner credit shares
- agent usage receipts

## What To Adopt Now

Adopt these concepts immediately:

- persistent project workrooms
- agent/node identity
- role-based agents: Runner, Verifier, Packager
- human-in-the-loop gates
- coordination trace
- shared project memory through proof ledger

Avoid before submission:

- adding a full external orchestration framework unless it clearly improves the demo
- API key pooling
- chat-first UI
- agent swarms
- claiming OpenAgents/CrewAI/LangGraph integration if not wired into code

## Recommendation

For this hackathon:

```text
Keep ProofForge as the proof economy layer.
Model the agent runtime locally.
Show identity and coordination trace clearly.
Use OpenAgents/CrewAI/LangGraph as future adapters, not core dependencies.
```

After submission:

```text
Add an adapter interface:
AgentRuntimeAdapter = local | OpenAgents | CrewAI | AutoGen | LangGraph
```

Each adapter should produce the same ProofForge outputs:

- agent identity
- run artifacts
- verifier result
- coordination trace
- evidence packet

That lets ProofForge sit above the agent framework market instead of being trapped inside one framework.
