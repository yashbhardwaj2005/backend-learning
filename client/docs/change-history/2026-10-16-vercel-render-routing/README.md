# Vercel/Render routing repair

Confirmed before editing: frontend homepage 200, direct /register 404, frontend /api/v1/users/current-user 404, Render current-user JSON 401, Render empty login JSON 400. The deployed bundle used the relative /api/v1 base URL. Vercel Root Directory is client.

The new vercel.json forwards API requests to the existing Render URL and serves index.html for React routes. Existing cookie/CORS policies and backend files are unchanged. Production Axios allows time for an idle Render service to start; error messages distinguish timeouts and do not instruct public visitors to run a local backend.

Saved originals are in before/. The manifest and restore script preserve change history, limit restoration to frontend files, and stop if later edits changed a file. This restores local source; changing a live deployment also needs a new commit/redeploy. No credentials or actual environment files are included.

Validation before deployment: npm run build passed (Vite 6.4.4, 1664 modules). All 19 saved backend, package and backend-test hashes match. The restore script preview validated all four managed frontend files without applying a rollback. The GitHub preflight found no private environment values or forbidden uploads in the publishable files.

Production verification requires Vercel to deploy the new commit. Check direct React routes, anonymous current-user JSON 401, empty-login JSON 400, then browser registration, login, reload persistence and logout. The final task report records live results after deployment; do not treat a successful local build as proof the live deployment has updated.
