# Cricket Rivals Mobile App

React Native + Expo mobile application for Cricket Rivals.

## Purpose

The mobile app is the primary player experience. It handles local presentation, navigation, cached state, offline-friendly UI patterns, and calls the shared backend API for authoritative game actions.

## Project Structure

```text
mobile_cricket_rivals/
├── src/
│   ├── api/           # API client and sync helpers
│   ├── navigation/    # Bottom tab and stack navigation
│   ├── screens/       # Mobile screens
│   ├── shared/        # Shared mobile UI components
│   ├── store/         # Redux store and slices
│   └── types/         # TypeScript type definitions
├── App.js             # Root component
└── app.json           # Expo configuration
```

## Current Baseline

- Expo + React Native app shell is in place.
- Redux Toolkit, persistence, API client, navigation, and shared UI foundations are in place.
- Cricket Rivals branding is active in app config and UI surfaces.
- Local development currently points at the local Node/Postgres stack. See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md).

## Common Commands

Run these from `mobile_cricket_rivals/`:

```bash
npm run check:syntax
npm run lint
npm run android
npm run ios
npm run web
```

`check:syntax` is the fast parser gate for JSX/JavaScript edits. `lint` runs ESLint with React, React Hooks, and React Native rules; it currently exits successfully while reporting existing mobile lint debt as warnings so agents can use it during incremental fixes.

## Related Docs

- [SESSION_START.md](../SESSION_START.md) - current handoff
- [PROJECT_STATE.md](../PROJECT_STATE.md) - active path and remaining work
- [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) - local stack setup
- [RELEASE/LAUNCH_PREP_STATUS.md](../RELEASE/LAUNCH_PREP_STATUS.md) - final release blockers
