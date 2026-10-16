# StreamTube

A React frontend for ULTIMATE-BACKEND. All frontend files live in this `client` directory. With your approval, the existing backend authentication and account handling were repaired and tested against MongoDB and Cloudinary. Backend environment values and dependencies were preserved.

See [verification notes](docs/verification.md) for completed browser/build checks and the remaining manual checks.

## Run locally

Use Node 22.12+ or Node 24. Two terminals:

```powershell
# Terminal 1 — existing backend, from ULTIMATE-BACKEND
npm run dev
```

```powershell
# Terminal 2 — frontend, from ULTIMATE-BACKEND
cd client
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. The frontend can be explored without the backend; real account requests need the backend and its MongoDB/Cloudinary configuration. `npm run build` produces `client/dist`.

`client/.env` is already set up locally. On a fresh checkout, copy `.env.example` to `.env`. Restart Vite after changing environment variables. Never put backend secrets into a `VITE_` variable: Vite exposes those values to the browser.

## Stage 1 — understanding the backend

See [docs/backend-review.md](docs/backend-review.md) for the exact implemented endpoints, response shapes, and existing authentication issues.

- All actual routes are mounted at `/api/v1/users`.
- Users, videos, and subscriptions have MongoDB models.
- Only the user router is implemented and mounted. A model does not mean a feature has an HTTP API.
- Login sets `accessToken` and `refreshToken` HTTP-only cookies. Tokens returned in JSON are deliberately ignored by the frontend.
- Registration requires a multipart `avatar` file. The UI also accepts an optional `coverImage`.

**Test:** an unauthenticated GET `/api/v1/users/current-user` should return 401. Register a fresh account, log in, sign out, and log in again with the same password. Run `npm test` from the backend root for five regression tests that need no database connection.

## Stage 2 — foundation and layout

```text
client/
  .env.example              API URL and development proxy target
  index.html                Title, fonts, favicon, React entry point
  vite.config.js            React, Tailwind, local API proxy
  src/
    main.jsx                React, Router, context providers, CSS
    App.jsx                 Routes for all pages
    styles.css              Theme, shared styles, responsive layouts
    api/client.js           Axios instance and actual user API calls
    context/
      AuthContext.jsx       In-memory user state and cookie-based session
      LibraryContext.jsx    Device-only demo bookmarks, likes, history
    components/
      Layout.jsx            Header, search, sidebar, common empty state
      VideoCard.jsx         Video card, avatar, loading skeletons
      PasswordForm.jsx      Existing password-change API and confirmation form
    data/mockVideos.js      All fictional video listings in one place
    pages/
      Home.jsx              Search, categories, sorting, discovery feed
      Watch.jsx             HTML video player, related videos, local actions
      Auth.jsx              Login and registration using actual APIs
      Profile.jsx           Account, avatar/cover editing, channel statistics
      Upload.jsx            Local file selection and video preview
      Library.jsx           Demo collections and actual account history
```

React Context holds the signed-in user. This is a small shared state container, not Redux. Native `FormData`, HTML form validation, and a native `<video>` player keep the code approachable. The CSS includes the Tailwind import and Vite integration; named CSS classes keep the custom visual design readable.

**Test:** visit Home, collapse the sidebar, resize to a phone width, and navigate with the mobile menu. Search “React” or select Music. Use the sorting select to change order. A search with no matches shows an empty state.

## Stage 3 — video discovery and playback

Video routes do not exist in Express yet. `src/data/mockVideos.js` contains clearly marked sample metadata and public sample clips. No requests are made to invented video endpoints. The feed footer and watch page identify demo content. Titles, creators, artwork, views, and durations are illustrative; the sample footage may differ from the listing. Credits are available under Show more.

The hero, cards, and categories all navigate or filter. Bookmarks and likes work on the current device, using only demo IDs in localStorage. Demo history records a video when playback starts. No authentication tokens or profile data go into localStorage.

**Test:** open a card, play its sample clip, toggle Like and Save, then visit Liked videos, Watch later, and History. Toggle the bookmark again to remove it. Refresh to confirm demo collections persist. External images, fonts, and sample playback need internet access; a local image fallback handles unavailable card artwork.

When video APIs are implemented, add a service in `src/api`, then replace the mock import in Home/Watch with real requests. Do not enable upload publishing until an actual video route exists.

## Stage 4 — connecting real accounts

Request flow:

```text
React form
  → authApi function in src/api/client.js
  → Axios base URL /api/v1, withCredentials: true
  → Vite forwards /api to http://localhost:8000
  → Express user route → controller → MongoDB / Cloudinary
  → { statusCode, data, message, success }
  → React updates its user state and page
```

Axios unwraps `response.data`, and the backend's payload is inside **another** `.data`. Login therefore uses `response.data.data.user`; current-user uses `response.data.data`. Only public profile fields enter React state.

Registration sends fullName, email, username, password, avatar, and optionally coverImage using multipart FormData. Axios/browser set the boundary automatically. Success redirects to Login. Profile editing sends fullName/email or multipart avatar/coverImage. Channel counts come from GET `/users/c/:username`. PasswordForm sends oldPassword/newPassword to POST `/users/change-password`; the confirmation field stays in React.

The frontend tries current-user on startup. A 401 can trigger one refresh attempt and one retry; concurrent requests share that refresh attempt. A failed initial session request leaves you signed out while the demo still works. Forms show network and backend errors, prevent duplicate submissions, and show loading feedback.

**Authentication repaired:** the password hook returns unless the password changed, and refresh reads the actual returned token. Missing input receives validation errors; failures return JSON. Account/avatar/cover responses exclude password and refreshToken. Passwords already damaged by the old bug cannot be restored automatically, so use a fresh account for testing. There is no forgotten-password/reset API yet.

**Test:** register with an avatar smaller than 5 MB; sign in; refresh Profile; edit name/email, avatar, or cover. Use Password & security, then sign out and log in with the new password. History shows real backend history separately from the demo trail. Never share screenshots containing passwords, cookies, or token response bodies.

Backend development now watches only `src/`, so React edits do not restart Express. Image uploads use unique temporary filenames and remove temporary files after success or failure. The pre-existing temporary image was preserved.

## Stage 5 — upload studio and real history

`Upload.jsx` selects or accepts a dropped local video, edits its title/description, optionally selects a thumbnail, and plays a local preview using `URL.createObjectURL`. Object URLs are revoked when no longer needed. The form explicitly explains that nothing is uploaded or published. It sends no backend request and does not retain files after leaving the page.

`Library.jsx` calls the existing authenticated GET `/users/history` when you are signed in and visit History. It displays backend history separately from the local demo trail; real history entries can play their existing videoFile directly. There is no backend route for adding history, so demo playback never writes to your account.

**Test:** choose a small MP4 in Create, edit the title and description, choose an image thumbnail, and click Preview your video. Check that the player works and no upload request appears in Network.

## CORS and deployment

The backend uses `CORS_ORIGIN=*` with credentials, which browsers reject for **direct cross-origin cookie requests**. Local Vite proxies `/api` so browser requests are same-origin. The backend sets HttpOnly and SameSite=Lax cookies, with Secure enabled when NODE_ENV=production. Vite now forwards cookies normally, without rewriting their attributes.

`npm run preview` is for inspecting the built UI and does not provide this development API proxy. For real account functionality in production, serve frontend and backend behind the same HTTPS origin with `/api` forwarded to Express, or configure the exact frontend origin in backend CORS and appropriate HTTPS cookie settings. An absolute `VITE_API_BASE_URL` needs those cross-origin settings. HTTPS production cookies must keep Secure and HttpOnly. Do not deploy Vite's development proxy as a production server.

Reference: [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite), [Vite configuration](https://vite.dev/config/server-options#server-proxy).
