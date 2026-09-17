# M00 Tutorial Run Evidence — 2026-09-17

Mission: **M00 — Dogfood current Logos Basecamp module creation/loading path**

Evidence status: `locally-verified-with-known-doctest-friction`

## Frozen upstream source

- Repository: `logos-co/logos-tutorial`
- Commit: `c58b7c9ea71269ca9383dcbd6eaba78f7ec66cc8`

## Official doctest execution

Command:

```bash
nix run github:logos-co/logos-doctest -- run \
  tests/tutorial-qml-ui-app.test.yaml \
  --output-dir ./m00-output \
  --report ./m00-qml-report.html \
  --continue-on-fail \
  2>&1 | tee ./m00-qml-terminal.log
```

Observed summary:

```text
Results: 50 passed, 7 failed, 0 skipped (of 57 run)
```

## Important passes

The LP-0018-relevant path passed:

- QML UI-only preview;
- local dependency override / flake lock;
- UI tests;
- core module build verification;
- core + UI full-functionality tests;
- dev + portable LGX packaging;
- logos-basecamp build;
- `lgpm` CLI build;
- isolated Basecamp data directory creation;
- core module install via `lgpm`;
- UI plugin install via `lgpm`;
- Basecamp launch and calculator interaction;
- portable Basecamp build;
- UI integration tests;
- module unit tests.

This is strong local evidence that the current macOS Apple Silicon environment can build, package, install, discover, and exercise a Logos core + QML module through Basecamp.

This is **not** yet LP-0018 macOS support evidence for our future implementation.

## Doctest failure chain

Seven reported failures:

```text
./logos/bin/logoscore load-module calc_module
Inspect methods and events
Call methods
./logos/bin/logoscore call calc_module factorial 5
./logos/bin/logoscore call calc_module fibonacci 10
./logos/bin/logoscore call calc_module libVersion
./logos/bin/logoscore stop
```

All seven collapsed into the same causal condition:

```json
{"code":"NO_DAEMON","message":"No client config at .../.logoscore/client/config.json. Start a daemon in this session (it writes one on boot)...","status":"error"}
```

The tutorial daemon step is:

```bash
./logos/bin/logoscore -D -m ./modules &
sleep 3
```

The background launch was marked PASS even though the daemon had not produced the client config required by the next command.

## Reproduction A — explicit `--config-dir`

The same generated module was then tested manually with an isolated explicit config directory:

```bash
./logos/bin/logoscore \
  --config-dir "$PWD/m00-logoscore-repro" \
  -D \
  -m ./modules \
  > ./m00-logoscore-daemon.log 2>&1 &
```

Observed:

- daemon process remained alive;
- `daemon/state.json` created;
- `daemon/tokens.json` created;
- `daemon/tokens/auto.json` created;
- `client/config.json` created;
- `client/auto.json` created;
- `status` reported daemon running;
- `capability_module` loaded;
- `modules_state` loaded;
- `calc_module` discovered as `not_loaded`.

The client path then passed end-to-end:

```text
load-module calc_module          -> Loaded module: calc_module (v1.0.0)
module-info calc_module          -> methods/events correctly visible
call calc_module factorial 5     -> 120
call calc_module fibonacci 10    -> 55
call calc_module libVersion      -> 1.0.0
stop                             -> clean shutdown initiated
```

## Reproduction B — environment-only config directory

To match the config mechanism used by `logos-doctest`, a fresh daemon was launched using only:

```bash
export LOGOSCORE_CONFIG_DIR="$PWD/m00-logoscore-env-repro"
./logos/bin/logoscore -D -m ./modules > ./m00-logoscore-env.log 2>&1 &
```

Observed after three seconds:

- daemon alive;
- daemon state and token files created;
- client config and local token created;
- `logoscore status` found the daemon using only `LOGOSCORE_CONFIG_DIR`;
- `calc_module` discovered correctly.

This rules out environment-variable config resolution as the cause of the original doctest failure.

## Reproduction C — Python `subprocess.run(..., shell=True)` + background `&`

To mimic the generic `run:` execution style used by `logos-doctest`, Python launched:

```text
./logos/bin/logoscore -D -m ./modules > ./m00-doctest-shell.log 2>&1 &
```

via:

```python
subprocess.run(cmd, shell=True, cwd=cwd, env=env)
```

with `LOGOSCORE_CONFIG_DIR` set in `env`.

Observed:

- shell return code `0`;
- daemon remained alive;
- daemon state/token files created;
- client config/token files created;
- daemon log showed successful boot;
- `status` reported the daemon running;
- `calc_module` discovered.

Therefore the generic Python `subprocess.run(..., shell=True)` plus background-process pattern is not, by itself, sufficient to reproduce the original failure on this machine.

## Classification

The following are locally verified and no longer considered blockers:

- Nix installation and flakes;
- Logos module-builder resolution;
- macOS Apple Silicon Logos builds;
- universal/core module build;
- LGX packaging;
- `lgpm` local install;
- Basecamp build/load/use;
- QML integration;
- logoscore daemon startup;
- explicit `--config-dir` behavior;
- `LOGOSCORE_CONFIG_DIR` behavior;
- logoscore module load / introspection / method calls / shutdown;
- generic Python shell-background execution.

The unresolved anomaly is restricted to the **specific original `logos-doctest` chain/run context**. Evidence is not yet sufficient to claim the exact upstream root cause. Possible remaining factors include per-spec state, chain-specific orchestration, reporting/capture interaction, or another run-context difference.

This friction is tracked internally in ProofForge issue #3 and is **non-blocking for LP-0018 implementation work**.

## Evidence paths on test machine

- `~/Developer/logos-m00/logos-tutorial/m00-qml-report.html`
- `~/Developer/logos-m00/logos-tutorial/m00-qml-terminal.log`
- `~/Developer/logos-m00/logos-tutorial/m00-output/`
- `~/Developer/logos-m00/logos-tutorial/m00-output/logos-calc-module/m00-logoscore-daemon.log`
- `~/Developer/logos-m00/logos-tutorial/m00-output/logos-calc-module/m00-logoscore-repro/`
- `~/Developer/logos-m00/logos-tutorial/m00-output/logos-calc-module/m00-logoscore-env.log`
- `~/Developer/logos-m00/logos-tutorial/m00-output/logos-calc-module/m00-logoscore-env-repro/`
- `~/Developer/logos-m00/logos-tutorial/m00-output/logos-calc-module/m00-doctest-shell.log`
- `~/Developer/logos-m00/logos-tutorial/m00-output/logos-calc-module/m00-doctest-shell-repro/`

## M00 conclusion

M00's project objective is satisfied: we can build and operate the current Logos module/Basecamp stack locally on the target macOS Apple Silicon lane, and we have documented the principal developer-experience friction encountered.

Truth label: **`locally-verified`**.

Do not convert the unresolved doctest anomaly into an upstream bug claim without a tighter reproduction or additional evidence.
