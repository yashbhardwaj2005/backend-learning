# New domain and Gemini Ask AI — 16 October 2026

The owner separately approved (1) changing Render's CORS_ORIGIN to https://yashstreamtube.vercel.app and (2) applying the reviewed Ask AI backend patch and supporting a server-only GEMINI_API_KEY. The owner chose real AI and asked Codex to select the provider. Gemini Flash-Lite was selected using Google's current model/pricing documentation.

Before edits, the new domain served the correct bundle and its API rewrite returned backend JSON 401/400. Render still advertised the previous frontend domain in Access-Control-Allow-Origin. A browser login with a made-up username returned the expected backend “User does not exist” message on the new domain. This proves that tested request path, not a complete signup with a personal image.

The change adds a responsive Ask AI dialog and one authenticated backend route. It reuses cookie authentication, Axios, React Router and Node fetch. No new dependency, database model or port change is included. Questions use public demo metadata, not transcripts or uploaded footage. Backend tests stub Google; real-provider validation requires the owner's private Render key.

Exact originals are under before/. The frontend restore script previews by default, preserves CHANGES.md, and refuses to overwrite later edits. It does not restore backend source or hosted environment settings. Those need fresh permission; backend originals and hashes are saved for a reviewed manual rollback. Never copy actual .env files or API keys into this folder.

For the approved Render setting, the prior public value was https://backend-learning-phi-rust.vercel.app and the saved new value is https://yashstreamtube.vercel.app (no trailing slash). The Render deployment succeeded, and POST requests through both Render and Vercel verified that new Access-Control-Allow-Origin value with the expected backend JSON 400 validation response. A hosted rollback requires fresh approval, updating that setting in Render and redeploying; a local source rollback cannot change Render.

Validation so far: production frontend build passed; npm test passed all 15 tests. The local video-page Ask AI trigger opened the correct listing panel and invited signed-out visitors to log in. AI source/route/test creation was applied only after the owner's explicit approval. src/index.js and the existing auth source are unchanged. Final published deployment and real-provider results will be recorded after verification.

The owner asked for help obtaining the Gemini key. Google AI Studio was opened and manual key-creation/Render setup instructions were provided. Codex did not create, read, export or store a provider key. A missing key produces a truthful setup message rather than a fake answer.
