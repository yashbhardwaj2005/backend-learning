# Vercel/Render routing repair

Confirmed before editing: frontend homepage 200, direct /register 404, frontend /api/v1/users/current-user 404, Render current-user JSON 401, Render empty login JSON 400. The deployed bundle used the relative /api/v1 base URL. Vercel Root Directory is client.

The new vercel.json forwards API requests to the existing Render URL and serves index.html for React routes. Existing cookie/CORS policies and backend files are unchanged. Production Axios allows time for an idle Render service to start; error messages distinguish timeouts and do not instruct public visitors to run a local backend.

Saved originals are in before/. The manifest and restore script preserve change history, limit restoration to frontend files, and stop if later edits changed a file. This restores local source; changing a live deployment also needs a new commit/redeploy. No credentials or actual environment files are included.

Validation before deployment: npm run build passed (Vite 6.4.4, 1664 modules). All 19 saved backend, package and backend-test hashes match. The restore script preview validated all four managed frontend files without applying a rollback. The GitHub preflight found no private environment values or forbidden uploads in the publishable files.

Production verification passed after GitHub commit f97d51e deployed to Vercel:

- Homepage, /register, /login and /watch/demo-alpine returned 200. The new JavaScript asset returned application/javascript, not the React HTML fallback.
- Anonymous /api/v1/users/current-user returned backend JSON 401. Empty POST /api/v1/users/login returned backend JSON 400 with Cache-Control: no-store, private.
- Browser registration succeeded with an avatar and optional cover image. Both loaded from Cloudinary on the profile. Login succeeded and remained authenticated after a full page reload.
- Logout succeeded. Opening /profile afterward displayed the signed-out account prompt without account details.
- One synthetic test account named Deployment Check (username deploymentqa_mvarbxak, example.com email) and its two tiny test images remain in the deployed database/Cloudinary; no existing account was edited or deleted. No test password or token was saved in this snapshot.

The Git snapshot check verified 31 exact saved originals across the change history. The frontend production build passed, and all 19 backend/package/test baseline hashes were unchanged. Future backend edits or backend rollbacks still require separate permission.
