# File Structure

```
/client
  /src
    /components
      PitchView.jsx
      CricketRivals.jsx
      /screens
        AuthScreen.jsx
        Dashboard.jsx
        DebugMatch.jsx
        LiveMatch.jsx
        PlayerProfile.jsx
        TeamManagement.jsx
        LeagueStandings.jsx
        ChallengeScreen.jsx (NEW)
        TrainingScreen.jsx (NEW)
        InjuryList.jsx (NEW)
        Settings.jsx
    /hooks
      useWebSocket.js
    App.jsx
    AppLayout.jsx (UPDATED)
    main.jsx
    index.css
  package.json
  tailwind.config.js
  postcss.config.js
  vite.config.js
/server
  /src
    /db
      /prisma.js
      /repositories
        authRepo.js
        fixtureRepo.js
        leagueRepo.js
        matchRepo.js
        simConfigRepo.js
        dailyLeagueRepo.js (NEW)
        dailyStandingsRepo.js (NEW)
        dailyChallengeRepo.js (NEW)
        trainingSessionRepo.js (NEW)
        playerInjuryRepo.js (NEW)
    /runtime
      eventsBus.js
    /services
      MatchService.js
    /sim
      /baseline
      /contracts
      /harness
      /models
        attributes.js (UPDATED - Bowling Variations)
        archetypes.js (UPDATED - Bowling Variations)
        bowlingVariations.js (NEW - Bowling Variations)
        pitchProfiles.js
        roles.js
        tactics.js
      /presentation
        commentary.js (UPDATED - Bowling Variations)
        scorecard.js
        wagon.js
      /rules
        conditionsFielding.js
        deliverySelector.js (NEW - Bowling Variations)
        fatigue.js
        morale.js
        momentum.js
        partnerships.js
        pitchDeterioration.js
        probability.js (UPDATED - Bowling Variations)
        smartBowlingAI.js
      /state
        inningsFlow.js
        matchFactory.js
        scoreboard.js
        teamBuilder.js (UPDATED - Bowling Variations)
      /tuning
        probability.js
    config.js
    index.js (UPDATED with league APIs)
    pubsub.js
  /prisma
    schema.prisma (UPDATED)
  /scripts
    seedLeagues.js (NEW)
    createTestUser.js (NEW)
  package.json
/docs                               (PROJECT DOCUMENTATION)
  SESSION_START.md            (current handoff - START HERE)
  PROJECT_STATE.md            (active phase and release state)
  TODO.md                     (current backlog only)
  BUGS.md                     (confirmed active defects only)
  QA_RUNS.md                  (QA evidence and fixed confirmations)
  CHANGELOG.md                (user-facing feature announcements)
  COMPLETED_WORK.md           (completed implementation history)
  DOCS_INDEX.md               (documentation navigation)
  DOCS_CLEANUP_AUDIT_2026-05-07.md
  /reference                  (stable project references)
    FILE_STRUCTURE.md         (this file)
    ARCHITECTURE_MAP.md
    ENGINE.md
    LOCAL_DEVELOPMENT.md
    MOBILE_APP.md
    TECH_STACK.md
  /specs                      (product and technical specs)
    TOWER_SPEC.md
    LEAGUE_DESIGN.md
    REFACTOR_CHALLENGES.md
    RATING_SYSTEM_PLAN.md
    BOWLING_VARIATIONS_PLAN.md
  /FEATURES                   (feature plans and product design docs)
  /roadmaps                   (forward-looking product sequencing)
  /sprints                    (active and completed sprint records)
  /RELEASE                    (launch prep and store submission docs)
  /ROLES                      (AI agent role definitions)
  /LEGAL                      (legal drafts)
  /qa                         (detailed QA reports)
  /security                   (security reports)
  /archive                    (historical docs only)
```
