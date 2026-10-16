# Playback, avatar, and theme snapshot

- `before/` holds exact copies of nine existing frontend files made before editing.
- `before-files.json` records original hashes. `files.json` records original/final hashes for the files the restore script manages, including new source, documentation and media assets.
- CHANGES.md has an original copy for reference, but is deliberately excluded from automatic restore so the complete change history survives rollback.
- `backend-baseline.json` contains 19 backend source/test/package hashes. No secrets, environment files, dependencies, user uploads or credentials are backed up here.
- `restore.ps1` previews by default. Add `-Restore` to apply. It only touches files within client/, stops if later work changed an affected file, and preserves the history/backups.

Undo this snapshot before attempting an older one. Vite reloads frontend edits automatically. A backend rollback always requires fresh permission.

Validation:

- Final production build passed. The five existing backend regression tests passed.
- Browser PNG registration completed, redirected to Login, and the new account signed in with a loaded Cloudinary avatar. Invalid non-image avatar selection displayed an immediate error; valid image selection displayed a preview.
- Live session checks through the Vite proxy: login 200, current-user 200, refresh 200, current-user after refresh 200, channel 200, history 200, logout 200, current-user after logout 401, refresh after logout 401. These used the new disposable QA account, not a pre-existing account. The generated credential file was removed afterward.
- The local Bunny MP4 still stopped around three seconds in this browser. It was replaced with the Sintel sample, with WebM preferred. Both final WebM clips reached their ends in the browser: Flower 5.059 seconds and Sintel 52.663 seconds. Native MP4 alternatives remain available for browsers that do not support WebM; the failing Bunny file was removed.
- Complete HTTP downloads of both WebM assets matched their local files byte-for-byte. Range requests returned 206 with video/webm, supporting seeking.
- Checked dark and light content/account pages and theme persistence after reload. At 390px, the header controls do not overlap or overflow, and the registration upload input remains visible. The temporary viewport override was reset afterward.
- Screenshot: client/.qa/streamtube-avatar-theme.jpg (ignored by Git). The normal local development servers remain available on ports 5173 and 8000.
- Final backend hashes match all 19 baseline files. Restore-script preview passed. No backend source/configuration/dependency/environment file was edited.

One disposable account named “StreamTube Avatar Check” and its tiny uploaded PNG were created during live testing. They remain in the development database/Cloudinary; no existing account was modified or deleted. This frontend restore script does not change database records.
