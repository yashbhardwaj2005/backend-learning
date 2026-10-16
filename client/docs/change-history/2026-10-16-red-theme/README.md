# Red theme snapshot

- `before/` contains the exact eight frontend files saved before the visual update.
- `files.json` records their original and updated SHA-256 hashes, plus the newly added CreatorCredit component.
- `backend-baseline.json` records the 19 backend source/test/package hashes checked before and after the update. All matched.
- `restore.ps1` previews a frontend-only restore by default. Add `-Restore` to apply it. It checks file hashes before writing, so later edits are not silently overwritten.

Run the commands from ULTIMATE-BACKEND, as shown in `client/CHANGES.md`. No environment files, dependencies, uploads, passwords, or database records are included in this snapshot. The project approval rule and change history are preserved during restore.

Validation: frontend build passed; desktop and phone layouts inspected; creator credit confirmed on main and authentication pages; restore preview completed successfully. The screenshot is saved locally at `client/.qa/streamtube-red-theme.jpg`.
