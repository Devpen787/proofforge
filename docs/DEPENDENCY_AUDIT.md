# Dependency Audit Status

Last checked during the hackathon build.

## Current Command

```bash
npm audit --audit-level=high
```

## Current Finding

The audit reports a high-severity upstream dependency chain:

```text
@0gfoundation/0g-storage-ts-sdk
-> open-jsonrpc-provider
-> axios
```

The report currently says there is no fix available for that chain.

## MVP Mitigation

ProofForge does not use live 0G upload by default.

Default demo behavior:

- uses the local storage adapter
- writes generated proof artifacts under `demo-output/`
- does not mount secrets
- does not post to GitHub
- does not contact maintainers
- does not move money

The 0G adapter only activates when these environment variables are configured:

```text
ZERO_G_EVM_RPC
ZERO_G_INDEXER_RPC
ZERO_G_PRIVATE_KEY
```

Until the upstream chain has a fix or the integration is isolated behind a hardened service boundary, the live 0G path should remain credential-gated and optional.

## Vite / Dev Server Note

The audit can also report moderate findings through Vite development server dependencies.

Mitigation:

- the web app now emits a production build with `npm run build`
- the hosted demo should serve the built `apps/web/dist` output
- the dev server is for local demo only

## Submission Language

Use:

> The demo uses local storage by default. 0G upload is implemented behind an adapter and only activates with explicit credentials.

Do not claim:

- live 0G storage is used by default
- the storage path is production hardened
- credentials are required for the deterministic local proof demo
