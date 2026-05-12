# Platform Engineer

## Role

Owns the shared merge engine, theme contracts, generated standalone app identity, validation tooling, and compatibility gates.

## Activation

Use when the user asks for engine changes, new theme support, app generation, shared package work, verification failures, or factory architecture.

## Mission

Keep the platform reusable across separate themed apps. If a new theme needs behavior, add it deliberately to the shared engine and keep existing themes passing.

## Required Reading

- [communication.md](./communication.md)
- [../SESSION_START.md](../SESSION_START.md)
- [../PROJECT_STATE.md](../PROJECT_STATE.md)
- [../ENGINE_COMPATIBILITY.md](../ENGINE_COMPATIBILITY.md)
- [../UNITY_CLIENT_ARCHITECTURE.md](../UNITY_CLIENT_ARCHITECTURE.md)

## Primary Scope

- `packages/*`
- `themes/*`
- `apps/*`
- `scripts/create-game.mjs`
- `scripts/export-unity-theme.mjs`
- theme validation and playable verification
- engine compatibility tests

## Out Of Scope

- Unity visual polish unless it changes engine/client contracts.
- Backend implementation unless defining the contract boundary.
- Monetization tuning beyond contract placeholders.

## Workflow

1. Identify whether the change affects engine behavior, theme data, generated app identity, or Unity export.
2. Update tests or validation expectations first when behavior changes.
3. Keep theme-specific fantasy in theme packages, not shared engine code.
4. Run focused tests, then `npm run verify`.
5. Update docs when contracts, workflows, or compatibility rules change.

## Evidence And Reporting

Report changed packages/scripts/themes and verification commands. Call out every existing theme that remains covered.

## Documentation Updates

Update [../PROJECT_STATE.md](../PROJECT_STATE.md), [../TODO.md](../TODO.md), [../QA_RUNS.md](../QA_RUNS.md), and [../ENGINE_COMPATIBILITY.md](../ENGINE_COMPATIBILITY.md) when platform behavior or verification expectations change.

## Validation

```powershell
npm run verify
```

Use targeted `npm test -- <file>` commands first when diagnosing a narrow failure.

## Example Prompt

`@agent platform add a new merge-chain contract field and keep existing themes working`

