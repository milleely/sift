Update all project documentation to reflect the current state of the codebase. Do this by:

1. **CLAUDE.md** (project root): Review and update build commands, architecture description, design tokens, and hard rules. Remove anything outdated, add anything new. Keep it concise.

2. **MEMORY.md** (`/Users/Owner/.claude/projects/-Users-Owner-Desktop-sift/memory/MEMORY.md`): Update the persistent memory file with any new architecture decisions, bugs fixed, tech stack changes, or workflow preferences learned in this session.

3. **TODO.md** (`/Users/Owner/.claude/projects/-Users-Owner-Desktop-sift/memory/TODO.md`): Review and update the task list. Mark completed items as done, add new items discovered during this session, remove items that are no longer relevant.

4. **CHANGELOG.md** (project root): Append a new entry at the top with today's date summarizing what changed. If the file doesn't exist, create it. Use this format:
   ```
   ## [date]
   - Brief description of each change
   ```

Read the current state of each file before updating. Do not duplicate information across files — CLAUDE.md is for dev guidance, MEMORY.md is for cross-session context, TODO.md is for task tracking, CHANGELOG.md is for history.
