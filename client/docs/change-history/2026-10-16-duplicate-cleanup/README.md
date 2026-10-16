# Remove only the nested duplicate

Completed 16 October 2026 after the owner explicitly requested a clean project folder matching the GitHub structure while preserving website behavior.

## Final layout

```text
C:\Users\Yash\Desktop\
├── ULTIMATE-BACKEND\               Working StreamTube project
│   ├── client\                    Frontend
│   ├── src\                       Current backend
│   ├── tests\
│   ├── docs\
│   ├── public\
│   ├── node_modules\              Working backend dependencies
│   └── package.json
└── ULTIMATE-BACKEND-COHORT\        Separate original annotated backend backup
```

Only `C:\Users\Yash\Desktop\ULTIMATE-BACKEND\ULTIMATE-BACKEND` was removed. `src/` and `client/src/` are intentionally different folders: one is Express and the other is React. Their dependencies also belong to separate packages.

VS Code's filesystem watcher should remove the deleted nested directory from Explorer. If an old listing remains, use Explorer's Refresh button. Continue opening the outer `C:\Users\Yash\Desktop\ULTIMATE-BACKEND` for StreamTube. No workspace settings were changed.

## Preservation and verification

- Git ignored the nested directory and tracked none of its files. Working scripts/configuration had no reference to it.
- The exact resolved target was checked before recursive deletion. Neither it nor its descendants contained symbolic links or junctions.
- All 190 files in the existing separate cohort backup matched their source in the duplicate before removal. The backup remains byte-for-byte unchanged afterward.
- Before removal, all 198 non-dependency files from the duplicate were archived and read back with SHA-256 verification. This also preserves the eight old frontend scaffold files omitted from the cohort backup. Reinstallable `node_modules` was excluded from the archive.
- All 57 active application source/config/package/test files match `active-files-baseline.json` after cleanup. Private working environment files were compared in memory and are unchanged; their values and hashes are not published here.
- Frontend production build passed. The first sandboxed build failed on Windows directory access; the same build passed with approved normal-user access. All 15 existing backend tests passed.
- No backend code, package declaration, port, CORS/cookie policy, environment value or deployment setting was edited. No Git commit, push or live redeployment was performed for this cleanup.

`cleanup.json` records the exact paths and verification counts. `before/client/CHANGES.md` is the exact previous history; `before-files.json` records its checksum. The cumulative history is kept rather than rolled back over future entries.

## Private undo archive

The local archive is:

`C:\Users\Yash\Desktop\ULTIMATE-BACKEND\client\.qa\2026-10-16-duplicate-cleanup\nested-copy-private.zip`

It is excluded from Git by `client/.gitignore`. It contains private environment configuration and Git metadata, so do not publish or share it. The separate Desktop cohort folder remains the convenient source for learning.

The working application requires no restoration. If the removed nested copy is ever needed again, ask for recovery to a new empty directory; verify the archive and destination first. Do not extract over the working app or the existing cohort backup. Its generated dependencies can be recreated with `npm ci`. Any backend restoration still needs fresh owner approval.
