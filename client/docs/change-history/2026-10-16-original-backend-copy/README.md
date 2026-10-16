# Original annotated backend: separate Desktop copy

Completed 16 October 2026 after the owner requested only a separate backup. The earlier move/VS Code cleanup proposal was cancelled before execution.

## Locations

- Source left untouched: `C:\Users\Yash\Desktop\ULTIMATE-BACKEND\ULTIMATE-BACKEND`
- Separate recovered copy: `C:\Users\Yash\Desktop\ULTIMATE-BACKEND-COHORT`
- Current StreamTube app left in place: `C:\Users\Yash\Desktop\ULTIMATE-BACKEND`

This was a copy, not a reset, move, repair, Git commit or deployment. Neither existing folder was removed. No file inside the recovered copy was edited. Its original authentication behavior is retained.

## What was preserved

The source's older `src/`, learning comments, `docs/`, `public/`, package files, README, formatting files, private `.env`, and complete local `.git` were copied without changing file contents. The older working edits remain uncommitted, exactly as in the source.

The unrelated `client/` scaffold and generated `node_modules/` were excluded. To run the recovered backend later, open its own folder in VS Code, run `npm ci`, then `npm run dev`. The two local backend projects both use port 8000 by default, so run only one at a time.

No private environment contents, upload contents, or Git object archives were added to this public change history. The recovered `.env` is a private local copy; do not share it.

## Evidence and limitations

- All 190 copied files were compared with their source using SHA-256; every comparison passed.
- All 17 older backend/package hashes match `cohort-backend-baseline.json`.
- All 22 current backend/package/test files retain their pre-operation hashes.
- The recovered Git HEAD remains `0c3940f9ee7d7a53b65a2eaa10165236d4500a42` (12 October 2026). Exporting HEAD alone would have lost nine files' uncommitted learning edits, so the working files were copied instead.
- Saved pre-frontend Git tree `ca824559568ee43273dfc0ae712bde679d206e93`, captured 16 October at 01:14 IST, has the same 25 nonpersonal source/documentation/configuration file contents. Twenty files differ only because Git stored LF line endings and the working files use CRLF; the copy preserves the working files' actual bytes.
- There is no verified complete snapshot tied to the exact first StreamTube request. The saved tree also contains no `.env`, so historical private settings cannot be confirmed. This recovery preserves the strongest available older annotated working copy without claiming otherwise.

No backend tests were run: this operation copied older files without changing or repairing them. Hash comparison directly checks the requested preservation.

## Undo

No existing backend needs restoring: neither was edited. The only new backend directory is the Desktop copy. If it is no longer wanted, preserve any learning edits made there before removing that copy yourself. Do not reset either original repository.

`before/client/CHANGES.md` is the exact history file saved before recording this operation; `before-files.json` records its checksum. Keep the cumulative change history during later work instead of restoring an older history over newer entries. Any future backend modification or rollback still requires the owner's permission.
