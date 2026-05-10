# Cross-Platform Smoke Checklist

> Scope: the minimum release-confidence pass for web, Android, and iOS before submission.

## Version Verification
- [ ] `npm run version:report` matches the intended local release commit
- [ ] `https://api.lineupgames.co.za/version` matches the intended backend release commit and DB migration
- [ ] Hosted web `version.json` matches the intended web release commit when a public web build is published
- [ ] Mobile About screen shows the intended commit short SHA, app version, and build number on the release candidate build

## Security Regression Baseline
- [x] `npm run verify:security:all` passed on 2026-05-10 for the destructive-target safety guard plus Challenge, Tower, live-match control/WebSocket, player/injury reads, injury mutation, and league mutation denial paths
- [x] `npm audit --omit=dev --json` returned 0 vulnerabilities in `server/`, `client/`, and `mobile_cricket_rivals/` on 2026-05-10
- [x] Live API and HostAfrica public-site security headers were observed on 2026-05-10
- [ ] Re-run `npm run verify:security:all` if backend authz, Tower, Challenge, injury, or live-match ownership code changes before release

## Auth / Account
- [x] Register a fresh account
- [x] Confirm registration with emailed 6-digit verification code
- [ ] Resend verification code from the auth screen
- [x] Log out and log back in
- [ ] Password reset request flow
- [ ] Weak password rejected on register/reset/change
- [ ] Unsafe display name rejected on register/profile edit
- [ ] Profile update
- [ ] Notification preference save
- [ ] Data export
- [ ] Account deletion flow

## Onboarding
- [ ] Draft a legal squad
- [ ] Save Playing XI
- [ ] Save strategy
- [ ] Complete guided first challenge
- [ ] Complete the first swap flow

## Core Loops
- [ ] Challenge quick sim
- [ ] Challenge live match
- [ ] Cup preview / bracket view
- [ ] Tower quick match
- [ ] Tower live match
- [ ] Training async job start -> ready -> view
- [ ] Scouting async job start -> ready -> view

## Squad / Club Management
- [ ] Squad management save
- [ ] Player long-press / hover details
- [ ] Team Stats screen
- [ ] Club Identity customize / progress flows
- [ ] Owned items equip flow

## Retention Surfaces
- [ ] Dashboard Ready Now counts are sane
- [ ] Best Next Action opens the right screen
- [ ] Objectives display progress correctly
- [ ] Challenge featured-rival / return-cue copy looks valid

## Release / Legal
- [x] Privacy Policy URL loads
- [x] Terms URL loads
- [x] Account deletion help URL loads
- [ ] In-app support request submits

## Platform-Specific Checks

### Web `:8081`
- [ ] No blocking console errors in core loops
- [ ] No broken navigation traps

### Android / Expo / Build
- [ ] Safe-area / footer CTA spacing is correct
- [ ] Physical-device push permission prompt behaves correctly
- [ ] No blocked sub-screen navigation

### iOS / Build
- [ ] Safe-area spacing is correct
- [ ] Push permission prompt behaves correctly
- [ ] External legal/support links open correctly
