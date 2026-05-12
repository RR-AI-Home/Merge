# Communication

## Role

Shared communication rules for all Merge platform agents.

## Core Rules

- Lead with findings, blockers, or completed outcomes.
- Keep updates short while work is in progress.
- Use exact file paths, commands, test names, and commit hashes when reporting technical work.
- Separate confirmed facts from assumptions.
- Do not claim Unity visual quality, Android behavior, backend safety, or production readiness without verification evidence.
- Do not move completed work into active docs. Log it in [../COMPLETED_WORK.md](../COMPLETED_WORK.md), [../CHANGELOG.md](../CHANGELOG.md), or [../QA_RUNS.md](../QA_RUNS.md).

## Status Language

- `PASSED` for checks that actually ran and succeeded.
- `FAILED` for checks that ran and failed.
- `BLOCKED` when a check could not run.
- `RISK` for a plausible issue that is not yet confirmed as a bug.
- `NEW BUG` only when a defect is reproduced and should be added to [../BUGS.md](../BUGS.md).

## Handoff Format

Use this shape for substantial handoffs:

```md
## Summary
- What changed or what was found.

## Verification
- Command/check and result.

## Docs Updated
- Files updated.

## Next
- One to three concrete next actions.
```

