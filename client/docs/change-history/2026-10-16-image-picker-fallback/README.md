# Registration image picker repair

The website is on port 5173. Port 8000 serves Express API routes; the user router root is not a website or a GET endpoint.

The original native image input worked through automation that directly supplied a file, but the user reported that the file window did not open in Codex's embedded browser. The frontend now offers a direct picker button plus drop/paste alternatives for both registration images. It does not claim to change or repair the desktop host's native dialog implementation. Ordinary Chrome/Edge can be used for a native file chooser.

`before/` contains exact original copies of Auth.jsx, styles.css, README.md and CHANGES.md. `files.json` and restore.ps1 cover the changed frontend files and new ImagePicker component. CHANGES.md is backed up for reference and kept during rollback. Hash checks prevent overwriting later work. Undo this snapshot before the earlier playback/theme snapshot.

No backend edits were made. Backend hash checks, final build and browser results are recorded below after validation. No environment values, credentials or user-uploaded files are included in this snapshot.

Validation:

- Both localhost:5173 and 127.0.0.1:5173 returned HTTP 200. Anonymous current-user on port 8000 returned the expected 401.
- Pasted a generated PNG into each rendered upload group using Ctrl+V, without using a native file dialog or setting the file input through automation. Both previews loaded and showed clipboard.png. Restored the clipboard after testing.
- Submitted a disposable account with both pasted images. Registration completed, redirected to Login, and login reached Profile. Both the avatar and cover image loaded from Cloudinary. Signed out afterward.
- One disposable “StreamTube Picker QA” account and its two tiny test image assets remain in the development services. No existing account was changed. No password file was written.
- Production build passed. Backend file hashes match all 19 baseline source/test/package files. Restore preview passed.
- Screenshot: client/.qa/streamtube-image-picker.jpg, captured before entering account fields.
- The native file window inside Codex was not verified as repaired; this update provides a tested image-paste alternative and normal native picker invocation for standard browsers. A frontend cannot alter its desktop host's file-dialog implementation.
