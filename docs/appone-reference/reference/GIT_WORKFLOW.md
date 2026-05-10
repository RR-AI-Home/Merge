# Git Workflow & Multi-Agent Rules

## Repository

* **Repo:** https://github.com/RR-AI-Home/CricketSim.git
* **Branch:** main
* **Conventions:** `feat:`, `fix:`, `refactor:`, `docs:`

## Commit Message Format

```
<type>: <description>

feat: Add new feature
fix: Fix bug
refactor: Refactor code
docs: Update documentation
```

## Multi-Agent Workflow Rules

### Ownership Rules

* Each task must have an "Assigned Agent":
  * `[frontend]` → client work
  * `[backend]` → server/sim work
  * `[shared]` → cross-cutting logic
* Agents MUST NOT modify files outside their domain unless explicitly required

### Task Flow Rules

1. **Pick & Move**: Select a task from "Next Tasks" and move it to "Current Work"
2. **Research & Design**: Systematically map the affected code and define a grounded implementation strategy
3. **Plan-Act-Validate**: For each sub-task, define the approach, apply surgical changes, and verify with tests/builds
4. **Doc Sync (MANDATORY)**: Immediately after validation, update:
    - **CHANGELOG.md**: Add user-facing feature/fix details with version bump if needed
    - **COMPLETED_WORK.md**: Add technical implementation details
    - **PROJECT_STATE.md**: Mark task as complete and move to archive
5. **Finalization**: Stage all affected files (including docs), commit with a semantic message, and push to the remote repository

### Conflict Prevention

* Before coding:
  * Check "Current Work" in PROJECT_STATE.md
  * DO NOT duplicate active tasks
* If conflict detected:
  * Log it in "Decisions & Notes"

### Git Rules (STRICT)

* Every meaningful change must:
  * Update "Last Commit" in PROJECT_STATE.md
  * Reflect current branch
* If branch changes:
  * Update "Active Branch" in PROJECT_STATE.md
* Use proper commit prefixes: `feat` / `fix` / `refactor` / `docs`

### Update Rules (MANDATORY)

After EVERY change:

1. Update "Current Work" in PROJECT_STATE.md
2. Move completed items → "Completed Work"
3. Add new tasks → "Next Tasks"
4. Update Git section
5. Log decisions
6. Log bugs/issues

### Continuity Rules

* Assume another agent takes over immediately after you
* Be explicit:
  * What was done
  * What remains
  * Where to continue
* Never leave ambiguous state
