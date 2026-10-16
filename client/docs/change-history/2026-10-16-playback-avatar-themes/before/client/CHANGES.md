# StreamTube changes

Keep this file updated for every substantive change. Save original files before editing so a specific change can be undone without discarding unrelated work.

## 16 October 2026 — Red theme and creator credit

- Replaced purple branding with red play logos and red main actions, neutral black/charcoal surfaces, and white/gray text across the pages.
- Updated the favicon, image fallback artwork, profile placeholder color, and sample creator avatar.
- Added the small “StreamTube™ · Created by @Yash” footer to all main pages and both authentication pages.
- Saved the exact original versions of eight edited frontend files before making changes.
- Recorded the requirement to ask before every future backend change in the root AGENTS.md.
- Backend source, configuration, environment values, dependencies, and database content were not changed in this visual update.

Snapshot: `docs/change-history/2026-10-16-red-theme/`. Its files.json lists the saved files and hashes. Its backend-baseline.json records backend hashes for checking that this update stayed in the frontend.

### Undo this visual update

From ULTIMATE-BACKEND, preview the restore plan:

```powershell
pwsh -File client/docs/change-history/2026-10-16-red-theme/restore.ps1
```

To restore the previous purple theme and remove the new credit component:

```powershell
pwsh -File client/docs/change-history/2026-10-16-red-theme/restore.ps1 -Restore
```

The script restores only these frontend changes. It stops if an affected file has changed since this update, protecting later work. It keeps the history, backups, and backend-permission rule. Vite will reload; restart it if needed.

Verification: production build passed without warnings; desktop (1440px) and phone (390px) views checked; creator credit confirmed on Home, Login, and Register; no horizontal page overflow; restore-script preview passed. All 19 backend source/test/package files match the SHA-256 hashes recorded before this update. No backend file was edited.

## Earlier work — Backend account repairs (explicitly approved)

Fixed the password save guard and refresh-token field; connected and verified the existing account APIs. See docs/backend-review.md and docs/verification.md for the exact repairs and tests.

The red-theme snapshot keeps that working authentication code intact. Exact pre-repair backend snapshots were not captured, so the current restore script does not claim to undo those older repairs. A backend rollback requires your approval and a separate, focused change.
