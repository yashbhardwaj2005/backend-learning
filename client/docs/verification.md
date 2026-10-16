# Verification — 16 October 2026

After approval, authentication was repaired and all existing user endpoints were exercised against the actual MongoDB and Cloudinary configuration. Unrelated prior edits and pre-existing accounts were preserved.

## Automated regression checks: 5/5

Run `npm test` from ULTIMATE-BACKEND. These run without a live database:

1. Creating/changing a password hashes it; repeated token saves preserve its hash.
2. Refresh returns the actual token in the response and cookie.
3. Empty refresh requests return 401 instead of crashing.
4. Revoked refresh tokens cannot renew a session.
5. Missing account fields fail before database work.

## Real API lifecycle: 23/23

The checks used a newly created QA account:

- Anonymous current-user and empty refresh rejection.
- Actual multipart registration and Cloudinary avatar upload; no password/refreshToken in registration data.
- Login by username and email, with both HttpOnly cookies.
- Cookie-authenticated current-user and repeated login using the original password.
- Two refresh requests followed by authenticated requests using the returned cookies.
- Account details, avatar, and cover-image updates.
- Channel profile with subscriber counts and real watch history.
- Password change, rejection of the old password, and login with the new password.
- Logout clears cookies; protected requests and refresh fail afterward.

## Browser checks

- Registration selected an avatar, submitted to Express, and redirected to Login with success feedback.
- Login with that newly registered account reached its real Profile.
- Another test login persisted across a full reload.
- Editing the full name persisted across another reload.
- Avatar and cover controls selected files, uploaded through Cloudinary, and displayed success feedback.
- Channel counts loaded from the existing channel API.
- History displayed real account history separately from the demo trail.
- Profile Sign out returned the UI to its signed-out state.
- Previous discovery checks passed: desktop/phone layouts, mobile navigation, search/empty results, categories, sorting, persistent local bookmarks/likes, sample playback, and local video preview.

The password-change form is wired to the endpoint verified by the API lifecycle test. Actual browser password entry is left for the user. Optional registration coverImage uses the same multipart field supported by the tested API.

## Build and runtime

- Updated frontend production build passed without warnings.
- Backend files passed JavaScript syntax checks.
- Backend: http://localhost:8000. Frontend: http://127.0.0.1:5173.
- Backend watcher is limited to src.
- Connected-profile screenshot: client/.qa/streamtube-connected-profile.jpg (ignored by Git).

## Limits and test data

- No missing video/social APIs were added. Feed, publishing, likes, subscriptions, comments, and history writes remain demo features or unavailable.
- Older accounts affected by the previous password bug may need separate recovery.
- Demo upload thumbnail selection was not rechecked in this account-focused pass. Real registration avatar selection and profile avatar/cover selection were verified.
- Tests created two named QA accounts and small Cloudinary image assets. They were signed out; no pre-existing account was modified. Temporary local credential files are removed after QA.
- No deployment was performed. Production HTTPS/CORS configuration is in README.md.
