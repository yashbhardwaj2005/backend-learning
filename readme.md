# StreamTube · MERN learning project

A React/Vite video-streaming interface connected to the existing Express/MongoDB account APIs. Frontend code lives in `client/`; backend code lives in `src/`.

## Run from VS Code

Open the top-level project folder that contains **both `src/` and `client/src/`**. The latest application is in this checkout. Do not open a second copy nested inside it.

Vite runs this React app. VS Code Live Server's **Go Live** button does not run Vite or the Express API. Use two terminals instead.

Terminal 1, from the project root:

```powershell
npm install
npm run dev
```

Terminal 2, from the project root:

```powershell
cd client
npm install
# A fresh clone needs this file; keep an existing local .env intact.
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm run dev
```

Open **[StreamTube](http://127.0.0.1:5173/)**. Port **5173 is the website**; port **8000 is the API**. Keep both terminals running for account features.

The backend needs your local `.env` with MongoDB, Cloudinary and JWT configuration. Required setting names are `PORT`, `CORS_ORIGIN`, `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRY`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Use port 8000 for the existing development proxy. Actual credentials and environment files are excluded from Git. Never put backend secrets in frontend `VITE_` variables.

## What works

- Real registration with avatar/optional cover image, login, cookie sessions, logout, profile edits, password changes, channel profile and history reads.
- Responsive red/dark branding with optional light mode, search/categories, demo playback, local bookmarks/likes, and the @Yash creator credit.
- Video listings use credited local demo clips. Video publishing and other missing APIs remain separate demo features until their backend routes exist.

## Checks and learning notes

```powershell
# Existing backend regression checks
npm test

# Frontend production build
cd client
npm run build
```

- [Frontend setup and architecture](client/README.md)
- [Test every implemented backend endpoint](client/docs/backend-testing.md)
- [Change history and saved undo snapshots](client/CHANGES.md)

Uploading source to GitHub does not host the running MERN website. Friends need their own local setup or a separate frontend/backend deployment. Localhost links only point to the computer opening them.

---

## Original backend learning notes

This is a video series on backend development with JavaScript.

- [Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj?origin=share)

---

# Summary of this Project

This project is a complex backend application built with Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, and many more technologies.

We are building a complete video hosting platform similar to YouTube, with features such as login, signup, video uploads, likes, dislikes, comments, replies, subscriptions, and more.

The project follows standard backend practices, including JWT authentication, access tokens, refresh tokens, bcrypt for password hashing, and more.

---
