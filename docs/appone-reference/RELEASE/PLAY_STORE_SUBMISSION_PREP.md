# Play Store Submission Prep

> Repo-side prep checklist for the Android submission pass.

## Identifiers
- App name: `Cricket Rivals`
- Android package: `com.cricketrivals.app`
- Version source: `mobile_cricket_rivals/app.json`
- EAS production profile: `mobile_cricket_rivals/eas.json`

## Legal / Support URLs
- Privacy Policy: `https://lineupgames.co.za/privacy/`
- Terms of Service: `https://lineupgames.co.za/terms/`
- Account Deletion Help: `https://lineupgames.co.za/account-deletion/`
- Support: `support@lineupgames.co.za`

## Submission Pack Checklist
- [ ] Google Play Developer account created later this month
- [ ] One-time US$25 Play Console registration fee paid
- [ ] Developer identity / organization verification completed in Play Console
- [ ] Final icon and feature graphic signed off
- [ ] Phone screenshots captured from release candidate
- [ ] Tablet screenshots captured if needed
- [ ] Short description and full description copied from `STORE_METADATA_PACK.md`
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed against current integrations
- [x] Account deletion URL ready
- [x] Privacy Policy URL ready
- [ ] Release AAB/APK generated from production profile

## Pre-Developer-Account Work
These can be completed before the Play Console account exists:
- [x] Production backend deployed with `NODE_ENV=production`, `DB_ENABLED=true`, strong `AUTH_JWT_SECRET`, and specific `CORS_ORIGIN`
- [x] Prisma migrations applied to the hosted database with `prisma migrate deploy`
- [x] Resend sender/domain verified and auth email flows smoke-tested
- [x] Mobile production API target verified through `EXPO_PUBLIC_API_URL=https://api.lineupgames.co.za`
- [ ] Release candidate AAB generated locally/EAS from the production profile
- [ ] Fresh-account auth smoke: register, verify email code, log out, log in, forgot-password request
- [ ] Account controls smoke: profile update, password change, data export, account deletion
- [ ] Core gameplay smoke completed from `CROSS_PLATFORM_SMOKE_CHECKLIST.md`
- [ ] Store screenshots and feature graphic captured from the release candidate
- [ ] Data Safety answers drafted from current app behavior
- [ ] Content rating answers drafted
- [x] Privacy, terms, and account-deletion URLs live and reachable

## Play Console Gate
These require the Google Play Developer account:
- Create the app record in Play Console
- Enable Play App Signing / upload signing key setup
- Enter App Content forms: privacy policy, data safety, ads, content rating, target audience, account deletion
- Upload AAB to internal/closed testing
- Invite testers / complete any required testing period
- Submit for review

## Notes
- Google's Play Console signup currently lists a one-time US$25 registration fee.
- The repo contains the package identifier and EAS build config, but the actual Play Console submission still requires external console work.
