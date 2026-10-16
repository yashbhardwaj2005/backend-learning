# StreamTube changes

Keep this file updated for every substantive change. Save original files before editing so a specific change can be undone without discarding unrelated work.

## 16 October 2026 — Separate copy of the original annotated backend

- At the owner's narrowed request, copied the older nested working backend into C:\Users\Yash\Desktop\ULTIMATE-BACKEND-COHORT. Both existing project folders remain in place; no cleanup, move, backend repair, deployment or remote update was performed.
- Preserved the older src files and learning comments, docs, package files, README, formatting files, public files, private local configuration and Git history. Excluded only the unrelated client scaffold and reinstallable node_modules. No file inside the recovered folder was rewritten.
- Verified all 190 copied files byte for byte, including 17 backend/package files. All 22 current backend/package/test files also match their pre-operation hashes.
- The older annotated source matches saved pre-frontend Git tree ca82455 in content, allowing only Git's line-ending normalization. This supports the recovery choice; an exact snapshot tied to the first frontend request is unavailable, and historical private environment values cannot be proven.
- Recovery evidence and copy-only undo instructions: docs/change-history/2026-10-16-original-backend-copy/. The prior folder-separation proposal was cancelled before execution. The current README, VS Code project structure, backend sources, ports and live service settings were not changed.
- Saved the exact previous version of this history file before recording the recovery. Keep the recovered private environment file local and out of shared archives or GitHub.

## 16 October 2026 — New domain and real Ask AI

- Updated the documented production domain to https://yashstreamtube.vercel.app. The owner approved changing Render's CORS_ORIGIN from the old Vercel domain to this new origin. Port configuration in src/index.js is unchanged. The existing Vercel API rewrite still targets the same Render service.
- Added components/AskAI.jsx and AskAI.css, with header/video-page buttons in Layout.jsx and Watch.jsx. The responsive panel uses real Gemini replies, existing cookie login, in-memory chat, loading/errors, safe internal video links, and visible limits about demo metadata and unavailable transcripts.
- After separate explicit backend approval, added src/controllers/ai.controller.js, src/routes/ai.routes.js, tests/ai.test.js and the AI router mount in src/app.js. POST /api/v1/ai/ask is authenticated, validates bounded public context, limits requests, calls Gemini with a server-only key and never exposes raw provider errors. No packages or database models were added.
- Default provider/model: Gemini / gemini-3.5-flash-lite. GEMINI_API_KEY must be added privately in Render by the owner. No actual environment file or secret is saved in this change history. No fake AI responses replace missing configuration.
- Saved exact originals, approved scope, public CORS setting history, manifests and undo instructions in docs/change-history/2026-10-16-domain-ask-ai/. Frontend restore is separate; any backend or Render rollback needs fresh approval.
- Verification: frontend build passed; all 15 backend tests passed (five existing auth tests plus ten isolated AI tests). Final browser and live deployment results are recorded in the snapshot README.

## 16 October 2026 — Vercel/Render production routing

- Live diagnosis: Vercel homepage returned 200, but `/register` and `/api/v1/users/current-user` returned Vercel 404. Render returned JSON 401 for anonymous current-user and JSON 400 for an empty login request. The deployed Axios base was `/api/v1`. These failures were missing production routing, not a port clash.
- Added client/vercel.json with API forwarding to the existing Render service before the React SPA fallback. API responses opt out of CDN caching. Vercel Root Directory was confirmed as client.
- Kept relative `/api/v1` requests, withCredentials and existing cookie authentication. Updated client/src/api/client.js to allow 90 seconds in production for idle Render startup and to show production-appropriate connection errors; local timeout stays 20 seconds.
- Updated frontend environment-example comments and README deployment instructions. No backend source, backend environment value or cookie/CORS policy was changed.
- Saved exact originals in docs/change-history/2026-10-16-vercel-render-routing/. Preview restore.ps1 there, or add `-Restore` to apply the frontend rollback. Change history is preserved. Rollback of a published fix needs a new commit/redeploy.
- Final build, backend-hash checks and deployment results are recorded in the snapshot README.

## 16 October 2026 — GitHub upload preparation and VS Code instructions

- Added clear root README instructions for opening the correct top-level project folder and starting Express/Vite in separate terminals. VS Code Go Live serves static files and does not start this application.
- Recorded the working website URL on port 5173, the API port 8000, current real/demo features, required environment variable names (no values), build/test commands, and links to the learning/undo guides.
- Added Git ignore rules for environment variants, the extra nested ULTIMATE-BACKEND checkout, and temporary backend uploads while retaining public/temp/.gitkeep. The nested checkout and existing test image were preserved locally.
- Added Git attributes that preserve exact frontend and saved-snapshot bytes, so Windows checkout line-ending conversion does not invalidate undo hashes. Backend file handling is unchanged.
- Saved exact README, ignore-file, and history originals under docs/change-history/2026-10-16-github-upload/. This snapshot can undo documentation/ignore/attribute changes only; code changes retain their earlier snapshots.
- Prepared the current client plus existing backend/auth fixes and tests for the configured GitHub repository. No backend source, environment value, package dependency or API behavior was changed during this publishing step.
- Final verification and publication details are recorded in the snapshot README. GitHub stores the source; a live public website needs a separate deployment.

## 16 October 2026 — Balanced registration proportions

- Grouped avatar and cover-image controls into a compact two-column row, with smaller previews/buttons and tighter registration spacing. Narrow phones use two balanced horizontal rows instead. Long filenames are truncated visually to avoid expanding the controls.
- Made the authentication photo a sticky, viewport-height panel. It keeps its natural object-fit framing while longer forms scroll instead of growing to the whole form height. Short desktop windows use more compact photo captions.
- Changed only presentation in Auth.jsx and styles.css; ImagePicker selection/paste/drop logic, form submission, authentication requests, and backend files were not edited.
- At 1280×720, registration page height decreased from 1,119px to 768px, the photo height became 720px, and the Create Account button moved from below the viewport to approximately y=633. The photo stays at top=0 while scrolling.
- Checked dark/light registration, Login, 390px phones, and 320px narrow phones. Upload controls stay within the viewport and both narrow-phone rows have matching heights. Production build passed.
- Saved exact originals of Auth.jsx, styles.css and this history file. Undo snapshot: docs/change-history/2026-10-16-auth-proportions/. Preview with `pwsh -File client/docs/change-history/2026-10-16-auth-proportions/restore.ps1`; add `-Restore` to apply. Change history is preserved. Undo this snapshot before earlier ones.
- All backend source/test/package hashes match the baseline. No account or upload was created during this layout-only check.

## 16 October 2026 — Registration picker fallback and correct website URL

- Verified the website responds at http://127.0.0.1:5173/ and http://localhost:5173/. Port 8000 is the Express API; GET /api/v1/users/ is not an implemented route and is not the website.
- Added ImagePicker.jsx for both avatar and optional cover image. A direct Choose button invokes the browser picker synchronously. Drop and user-initiated Ctrl+V paste provide alternatives when an embedded browser does not display the native file window. Both images have previews, filenames, replace/remove actions, and 5 MB/image validation.
- Auth.jsx now explicitly appends both selected image File objects to multipart FormData, so dropped/pasted images work without a populated native file input. Existing backend field names and routes are unchanged.
- Replaced obsolete registration picker CSS and updated README with exact website/API addresses and upload instructions.
- Saved four existing frontend files before edits; CHANGES.md is preserved during rollback. Undo snapshot: docs/change-history/2026-10-16-image-picker-fallback/. Preview with `pwsh -File client/docs/change-history/2026-10-16-image-picker-fallback/restore.ps1`; add `-Restore` to apply. Undo this snapshot before older ones.
- The prior automated chooser test supplied files directly; it did not prove that Codex displayed a native dialog to a person. This repair separately verifies clipboard paste in the actual rendered page. Native file-dialog behavior inside the Codex host remains outside React's control.
- No backend source/configuration/environment/dependency file was edited. Final validation and any disposable test account are recorded in the snapshot README.

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
