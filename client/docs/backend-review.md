# Backend inspection and approved repairs

The existing working tree was inspected before creating the client. Its prior edits were preserved. After approval, the existing authentication and account handling were repaired. The frontend remains inside client/.

## Existing endpoints connected

Base: http://localhost:8000/api/v1/users. The browser uses Vite's /api/v1/users proxy.

| Method | Path | Frontend use |
| --- | --- | --- |
| POST | /register | Registration: required avatar, optional coverImage |
| POST | /login | Username or email and password |
| POST | /logout | Profile sign out |
| POST | /refresh-token | Axios session renewal and one retry |
| POST | /change-password | Profile → Password & security |
| GET | /current-user | Restore account on startup/reload |
| PATCH | /update-account | Edit fullName/email |
| PATCH | /avatar | Profile avatar upload |
| PATCH | /cover-image | Profile → Change cover |
| GET | /c/:username | Real subscriber/subscription counts |
| GET | /history | History → From your account |

These routes already existed. No video or social endpoints were invented.

## Authentication repairs

1. In src/models/user.model.js, the save hook returns when password is unchanged. Registration/password changes still hash the password. Saving a refresh token preserves the password hash.
2. refreshAccessToken now reads `{ accessToken, refreshToken: newRefreshToken }`. Its response and cookie receive the actual token. A missing refresh cookie/body returns 401.
3. Cookies retain HttpOnly, use SameSite=Lax, and enable Secure in production. Local HTTP works without a Vite cookie rewrite. Logout uses the same cookie options.
4. Required fields are validated before database/bcrypt work. Username/email are normalized before lookup.
5. Profile update responses exclude password and refreshToken. React keeps only public display fields. Tokens are never stored in localStorage.

## Related account/upload handling

- src/middlewares/error.middleware.js returns JSON errors, including 409 for duplicate account fields and 400 for invalid/oversized images. Stack traces are not sent to the frontend.
- Multer accepts images up to 5 MB and uses unique temporary filenames.
- Cloudinary's temporary local files are removed after success/failure. Rejected request files are also cleaned up.
- Avatar/cover failures are checked without reading .url from null.
- Registration's body statusCode now matches HTTP 201.
- The root dev command watches only src, so frontend edits/test fixtures do not restart Express. npm test runs five isolated regression tests.

## Retained behavior and limits

- Root .env values, dependencies, token lifetimes, the single stored refresh token per user, route names, and MongoDB model structure were retained.
- Local Vite forwards /api to localhost:8000. Direct cross-origin production use needs the exact frontend CORS origin; same-origin HTTPS hosting is the simplest option.
- Passwords already double-hashed by the old bug cannot be reconstructed by this fix. An affected older account needs separate recovery; a fresh account works. There is no forgotten-password/reset API.
- Only the user router is mounted. Video feed/detail/upload, comments, likes, subscription mutations, and history writes remain unimplemented. Their UI is labeled demo behavior or an honest empty state.

See verification.md for actual MongoDB/Cloudinary and browser checks.
