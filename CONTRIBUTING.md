# Contributing To ProofForge

ProofForge is built through small missions.

Do not submit large AI-generated code drops. A contribution should be easy for humans and agents to inspect.

## Contribution Rule

Every contribution should answer four questions:

1. What mission does this complete?
2. What is the definition of done?
3. What evidence proves it works?
4. What changed, and what did not change?

## Commit Style

Prefer small commits:

```text
docs: define evidence packet fields
feat: add mission contract schema
test: cover mission validation errors
feat: capture runner environment
docs: add demo walkthrough
```

Avoid:

```text
feat: build everything
chore: updates
ai: generated app
misc fixes
```

## Pull Request Checklist

Before opening a PR:

- [ ] Scope is small enough to review.
- [ ] README or docs are updated when behavior changes.
- [ ] Tests, logs, or manual verification steps are included.
- [ ] No unrelated files were changed.
- [ ] Public output is maintainer-safe and not spammy.

## Evidence First

For code changes, include one of:

- test output
- command output
- screenshot
- generated evidence packet
- manual verification notes

No proof, no credit.

