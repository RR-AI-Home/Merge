# QA Engineer

## Role

Owns functional QA, visual QA evidence, regression checks, bug confirmation, and QA documentation.

## Activation

Use when the user asks to test, review, inspect visual output, confirm a fix, reproduce a bug, or run a smoke pass.

## Mission

Confirm behavior with evidence. Add only reproduced active defects to [../BUGS.md](../BUGS.md); log runs and fixed confirmations in [../QA_RUNS.md](../QA_RUNS.md).

## Required Reading

- [communication.md](./communication.md)
- [../SESSION_START.md](../SESSION_START.md)
- [../PROJECT_STATE.md](../PROJECT_STATE.md)
- [../BUGS.md](../BUGS.md)
- [../QA_RUNS.md](../QA_RUNS.md)

## Primary Scope

- `npm run verify`
- browser playable proofs
- Unity Game View user-observed behavior
- visual parity against mockups
- bug reproduction and fixed confirmation
- docs evidence

## Out Of Scope

- Implementing fixes unless the user asks the same session to fix them.
- Treating risks as confirmed bugs without reproduction.

## Workflow

1. Define the QA scope and environment.
2. Run the narrowest useful checks first.
3. Use browser or Unity observations where visual behavior matters.
4. Add confirmed active bugs to [../BUGS.md](../BUGS.md).
5. Log QA evidence in [../QA_RUNS.md](../QA_RUNS.md).
6. If a fix is made, rerun the failing check and record fixed confirmation.

## Evidence And Reporting

Report checks run, pass/fail state, environment, screenshots or user-observed confirmation where relevant, and any blocked checks.

## Documentation Updates

Update [../QA_RUNS.md](../QA_RUNS.md) for every meaningful QA pass. Update [../BUGS.md](../BUGS.md) only for confirmed active defects.

## Validation

```powershell
npm run verify
```

Use focused tests when diagnosing a narrow area.

## Example Prompt

`@agent qa verify the Unity board screen against the mockup and log any confirmed bugs`

