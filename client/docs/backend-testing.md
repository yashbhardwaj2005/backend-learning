# How to know your backend endpoints work

A page looking correct does not prove its backend works. Check **the request, the response, and the saved result**. Postman and React are two clients of the same Express API.

## Test directly in Postman

Start Express with `npm run dev` from ULTIMATE-BACKEND. Prefix the paths below with `http://localhost:8000/api/v1/users`. Use a disposable test account for changes.

| Action | Method and path | Body | Expected success |
| --- | --- | --- | --- |
| Register | POST /register | form-data: fullName, username, email, password (Text); avatar (File); optional coverImage (File) | 201; data._id and avatar URL; user exists in MongoDB |
| Login | POST /login | JSON: username **or** email, password | 200; data.user; accessToken and refreshToken cookies |
| Current user | GET /current-user | None; login cookies | 200; your account's public fields |
| Refresh session | POST /refresh-token | None; refresh cookie | 200; new cookies; current-user still succeeds |
| Edit account | PATCH /update-account | JSON: fullName, email | 200; values persist in a fresh GET and MongoDB |
| Change avatar | PATCH /avatar | form-data: avatar (File) | 200; new image URL persists after GET current-user |
| Change cover | PATCH /cover-image | form-data: coverImage (File) | 200; new image URL persists after GET current-user |
| Change password | POST /change-password | JSON: oldPassword, newPassword | 200; after logout, old password fails and new one logs in |
| Channel profile | GET /c/your_username | None; login cookies; replace your_username | 200; channel and subscriber/subscription counts |
| Watch history | GET /history | None; login cookies | 200; database history array (empty can be correct) |
| Logout | POST /logout | None; login cookies | 200; cookies cleared; protected requests fail afterward |

For images, select **File**, not Text, in Postman's form-data type dropdown. Do not manually set Content-Type for multipart: Postman/browser must generate the boundary. For JSON use Body → raw → JSON. Keep Postman's cookie jar enabled and use `localhost` consistently throughout your sequence.

Responses have `{ statusCode, data, message, success }`. Check the **HTTP status**, not only statusCode inside JSON. Never share raw login/refresh replies or cookie screenshots; they contain tokens.

## Check failure cases too

- Missing required registration fields/avatar → 400.
- Duplicate username/email → 409.
- Wrong password → 401.
- Current-user without valid cookies → 401.
- Empty refresh without a refresh cookie → 401.
- Protected request after logout without valid credentials → 401.

A deliberate 401 proves the authentication guard works. A 500 is a server failure; inspect the backend terminal. MongoDB/Cloudinary connectivity failures are different from invalid form data.

Example registration assertion for Postman's Tests / Post-response tab:

```javascript
pm.response.to.have.status(201);
const body = pm.response.json();
pm.expect(body.success).to.eql(true);
pm.expect(body.data._id).to.be.a("string");
pm.expect(body.data).not.to.have.property("password");
```

## See the real requests from React

1. Open StreamTube, press F12, choose **Network → Fetch/XHR**, and enable Preserve log.
2. Register/login and select the request named `register`/`login`.
3. **Headers** shows method, URL and HTTP status. **Payload** shows your field names. **Response** shows Express's actual reply.
4. After login, open Profile and reload. `GET /api/v1/users/current-user` should return 200. The name/avatar should survive reload.
5. **Application → Cookies** shows the session cookies. HttpOnly cookies are intentionally unreadable with document.cookie. The browser sends them automatically; the frontend does not save tokens in localStorage.

You will see `127.0.0.1:5173/api/v1/...` in the browser. Vite forwards `/api` to `localhost:8000`, the same backend you call directly in Postman. On an initially signed-out visit, current-user/refresh may return 401. That alone does not mean login is broken.

If Submit creates **no request**, check required inputs, file selection, and frontend validation. If it creates a request, read the response before guessing. To prove a successful write persisted, make a fresh GET or inspect MongoDB instead of trusting only the success toast.

## Real features versus demo

Registration, login, refresh, logout, account edits, avatar/cover uploads, password change, channel profile, and history reads use your actual endpoints. Home/watch listings and short local clips are demo content. Likes, bookmarks and demo history stay on this device. Upload Studio only previews files; it cannot publish videos yet. A MongoDB video model alone does not create an HTTP endpoint.

## Existing tests

Run `npm test` from the backend root. Five existing tests check password-save behavior, refresh-token handling, empty/revoked refresh rejection, and missing account fields. These do **not** replace live Postman checks against MongoDB, cookies and Cloudinary. Earlier full endpoint checks are recorded in [verification.md](verification.md).
