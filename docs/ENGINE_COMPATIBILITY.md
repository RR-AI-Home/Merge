# Engine Compatibility

Engine updates must keep all completed themes working.

After changing a shared engine package, run this before considering the change safe:

```bash
npm run verify
```

The verification suite checks:

- shared engine behavior
- every theme contract
- every standalone app identity
- the foundation producer, merge, and order loop

## Rule

If a new theme needs engine behavior that does not exist, add the behavior to the shared engine deliberately and keep all existing completed themes passing.

Do not place theme-specific gameplay rules inside app shells or theme data loaders. Theme packages define content and tuning; shared packages define behavior.
