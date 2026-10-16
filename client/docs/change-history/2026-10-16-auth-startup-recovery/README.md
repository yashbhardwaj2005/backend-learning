# Authentication startup recovery — 16 October 2026

The owner reported intermittent live login failure, then confirmed login worked once Render finished waking. The owner approved finishing and deploying the small frontend wait improvement. No backend change was requested or applied.

## Cause observed live

Render's Free service showed “Service waking up” at its real current-user URL. Render logs then recorded a new process at 19:02:05 IST and MongoDB connection/server readiness at 19:02:10. After startup, the API returned its normal JSON 401 for anonymous access, the existing Vercel browser session loaded Profile, and the owner confirmed their usual-browser login succeeded.

The old generic message meant an HTTP 500-or-higher response, including hosting gateway failures. No exact original failing request status was captured, so these notes do not assert a particular 502/503 code for it. The observed unavailable service and recovery establish the startup issue; there is no evidence that port changes, credentials or the local duplicate cleanup caused this incident.

Render Free sleeps after 15 minutes without traffic and usually takes about a minute to restart: [Render documentation](https://render.com/docs/free#spinning-down-on-idle). The frontend fix handles normal startup delays; an always-on compute plan is required to remove idle sleep entirely. No plan or billing setting was changed.

## Small frontend change

- `src/api/serverConnection.js`: one bounded readiness helper, sharing in-progress checks and caching success for 15 seconds. It retries only the supplied GET check, up to 120 seconds, with at most 12 seconds per request and three seconds between attempts.
- `src/api/client.js`: production authentication first checks existing GET `/users/current-user`. JSON 200/401 proves readiness. It then performs the existing session/login/register request. Cookies and API base URL are unchanged; no endpoint was invented.
- `src/context/AuthContext.jsx` and `src/pages/Auth.jsx`: show the connecting state and prevent submission while the initial session check is in progress. Form data remains in the page. Login and registration are submitted only once, so account creation/uploads are never blindly replayed.
- `tests/serverConnection.test.js`: nine isolated tests with simulated time; no new dependency or root package script.
- README/history: setup, limitations and undo instructions.

No backend source, test, configuration, environment, dependency, port or hosting plan was edited. `backend-baseline.json` checks the 22 pre-existing backend/package/test files. No tokens were added to localStorage.

## Verification

- Production frontend build passed before publication.
- All nine recovery tests passed: readiness envelopes, transient failure/recovery, HTML rejection, deadline, concurrent callers, late listeners, fatal API errors, cancellation and cache expiry.
- Production-build browser fixture used only a local simulated API, with two temporary 503 responses followed by a healthy anonymous response. The connecting notice and disabled submission were visible. After recovery the form submitted once and reached the simulated Profile. `browser-test-results.json` records five GET checks, one normal failed anonymous refresh request, one login submission, and no login while unavailable. No real account or upload was created.
- Live production availability was checked separately, as described above; the owner confirmed successful real login. The unit/browser fixture tests do not test production MongoDB or guarantee hosting uptime.

Publication: code commit `aa78aa3` was pushed to `origin/main`. The live Vercel domain served the new production asset `assets/index-BxO7Mz8y.js`, matching the tested build, and the existing signed-in Profile loaded correctly after a fresh page load. All 22 backend hashes still matched the saved baseline. The disposable local test server was stopped. A cropped live verification screenshot is saved privately as `client/.qa/auth-recovery-live-verified.jpg`.

## Undo

From the project root, preview:

```powershell
pwsh -File client/docs/change-history/2026-10-16-auth-startup-recovery/restore.ps1
```

Add `-Restore` to apply this frontend-only rollback. It checks all saved/current hashes first, refuses to overwrite newer changes, restores four existing frontend/documentation files and removes the two files added for this fix. Cumulative change history is preserved. A published rollback also needs a commit/redeploy. It never restores or modifies backend files.

Exact originals are under `before/`; `before-files.json` and `files.json` record their checksums. Private screenshots and the disposable frontend fixture stay in ignored `client/.qa/`. The prior cohort recovery/duplicate-cleanup records remain available, and private recovery archives are not published.
