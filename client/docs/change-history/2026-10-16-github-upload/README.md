# GitHub publication preparation

Configured repository: https://github.com/yashbhardwaj2005/backend-learning, branch main.

This step documents VS Code startup and protects local environment files, temporary uploads and a nested duplicate checkout with Git ignore rules. It publishes the current working project, including previously authorized backend fixes, without changing backend source during publication.

Saved originals: root readme.md, root .gitignore, and client/CHANGES.md. The new .gitattributes preserves frontend/backup bytes so Windows line-ending conversion does not invalidate saved hashes. The history file is preserved during rollback. The restore script only permits the three exact root documentation/Git-metadata files; it cannot restore backend source or environment settings. It previews by default and checks hashes before writing. Restoring local files after publication requires a new commit/push to update GitHub; this script does not rewrite Git history.

Environment files, node_modules, built output, private QA files, temporary uploads and the nested checkout are excluded. The frontend's public demo clips and undo snapshots are included deliberately.

Validation:

- Frontend production build passed; all five existing backend tests passed.
- Website returned HTTP 200 on port 5173. Anonymous current-user returned the expected HTTP 401 on port 8000.
- Publication candidates were checked for ignored/private paths and exact sensitive values from the local backend environment, without printing those values. No matches were found. Media assets total about 9 MB, with public source/license credits retained.
- All 19 backend source/test/package hashes match the baseline captured before the documentation/Git-ignore edits.
- Restore-script preview passed. Only root README, Git ignore rules and the new attributes file are covered by this snapshot's automatic restore.

Publication target: origin/main in the configured repository. The upload uses a normal commit/push, preserving prior history. Git history and the GitHub commit list record the resulting commit. Publishing the source does not deploy a live website.
