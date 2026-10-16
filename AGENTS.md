# Project working rules

These preferences were explicitly requested by Yash.

- Ask for approval before changing any backend source, middleware, model, route, controller, backend test, server configuration, root package file, or backend environment setting. Explain the exact proposed change and wait for permission. Earlier approval for a particular repair is not permission for later backend edits.
- Frontend code belongs in `client/`. Keep it simple, readable JavaScript with React, Vite, Tailwind, React Router, Axios, and Lucide.
- Keep StreamTube's branding red with neutral black/charcoal surfaces and white text. Keep the small `Created by @Yash` credit.
- Maintain `client/CHANGES.md` for each substantive change. Record the date, affected files, behavior, verification, and undo instructions.
- Before editing existing files, save their exact contents under a new, descriptively named folder in `client/docs/change-history/`. Do not overwrite an older snapshot. Include only relevant source/configuration; exclude secrets, environment files, dependencies, uploads, and personal data.
- Preserve pre-existing uncommitted work. Never use a broad Git reset/checkout to undo a change.
- Any rollback that would change backend files also needs fresh approval. The red-theme restore script is intentionally limited to frontend files.
