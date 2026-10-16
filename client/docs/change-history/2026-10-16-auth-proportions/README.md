# Authentication proportions snapshot

This update changes layout only: smaller, grouped registration upload controls and a sticky photo panel whose height matches the viewport. Existing upload controls, events, API requests and auth logic are preserved.

`before/` contains exact original copies of Auth.jsx, styles.css and CHANGES.md. `files.json` records original/current hashes for Auth.jsx and styles.css. Change history is backed up for reference and deliberately preserved during rollback. The restore script previews by default, only writes frontend files, and stops if later edits changed them. Undo newer snapshots before older ones.

Validation:

- Production build passed.
- At 1280×720, registration page height changed from about 1,119px to 768px; Create Account is visible at y≈633 rather than below the screen at y≈925.
- The photo stays 720px tall and at top=0 while the form scrolls. It uses object-fit: cover with no image stretching.
- Dark/light registration and Login were visually checked. Phone checks at 390px and 320px found no horizontal page overflow; the narrow-phone upload rows both measured approximately 110px tall.
- The temporary viewport override was reset. Screenshot: client/.qa/streamtube-registration-proportions.jpg.
- Backend source/test/package hashes match the pre-edit baseline. No backend environment, source, dependency, account, credential or upload was modified by this layout check.
