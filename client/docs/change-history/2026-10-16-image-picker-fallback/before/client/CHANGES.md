# StreamTube changes

Keep this file updated for every substantive change. Save original files before editing so a specific change can be undone without discarding unrelated work.

## 16 October 2026 — Playback, avatar picker, and theme switch

- Bundled two sample clips under public/demo/ with source/license credits, WebM sources and native MP4 fallbacks. The player now uses local files, avoiding external media-host interruptions. Replaced the failing Bunny MP4 sample with Sintel. The nine cards show actual clip lengths (0:05, 0:52), rather than fictional full-length runtimes.
- Added VideoPlayer.jsx with a visible Play/Replay button, native controls, buffering feedback, and a reload action for errors or a long wait. Watch.jsx explains that these are short samples.
- Replaced the transparent avatar input with a visible native Choose File control, image preview, file name, and immediate image/5 MB validation. The existing multipart registration API and field names are preserved.
- Added ThemeContext.jsx and ThemeToggle.jsx. Dark is the default; an explicit light/dark preference is saved locally. The switch is in the main header and on Login/Register. Shared CSS colors support both appearances while artwork stays readable.
- Updated main.jsx, index.html, Layout.jsx, styles.css, Auth.jsx, Watch.jsx, mockVideos.js, and README.md. Added docs/backend-testing.md with all implemented user endpoints, expected results, failure cases, Postman assertions, and DevTools instructions.
- Saved nine exact frontend originals before editing (including this history file for reference). Kept the earlier red-theme snapshot and @Yash credit.
- No backend source, tests, root package files, or environment values were edited. Live QA created one disposable development account and its tiny avatar asset; pre-existing accounts were preserved.

Snapshot and undo: `docs/change-history/2026-10-16-playback-avatar-themes/`. Preview from ULTIMATE-BACKEND:

```powershell
pwsh -File client/docs/change-history/2026-10-16-playback-avatar-themes/restore.ps1
```

Apply this frontend rollback by adding `-Restore`. The script checks hashes before writing, restores only this update, and preserves change history. Undo newer snapshots before older ones; the old red-theme restore correctly refuses to overwrite these later changes.

Verification: production build and five existing backend regression tests passed. Browser registration accepted a PNG and redirected to Login; the new account could sign in and display its uploaded Cloudinary avatar. A separate session check through the Vite proxy passed login, current-user, refresh, channel profile, history, logout, and expected post-logout 401 responses. Theme switching and reload persistence were checked. Final playback/responsive results are recorded in the snapshot README.

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
