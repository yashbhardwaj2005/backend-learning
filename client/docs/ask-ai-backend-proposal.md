# Ask AI — reviewed backend proposal

Prepared on 16 October 2026, then explicitly approved and applied by Yash in this chat. The patch preserves the exact reviewed change. Its four backend files are now implemented and all 15 backend tests pass. The approved Render CORS update was separate. The owner's Gemini key and a real-provider check are still required to enable live AI answers. See the dated change-history snapshot for final deployment results.

## Proposed behavior

Add `POST /api/v1/ai/ask`, protected by the existing `verifyJWT` middleware and HTTP-only session cookies. Express calls Google's Gemini API with built-in Node `fetch`; the browser receives only the answer. No packages, database models, authentication changes, port changes, or root package edits are needed.

The provider request uses `https://generativelanguage.googleapis.com/v1beta/interactions`, the `x-goog-api-key` header, `store: false`, a fixed `system_instruction`, a string `input`, and `generation_config.max_output_tokens: 1024`. The default model is `gemini-3.5-flash-lite`. Its name can be changed with the optional server setting described below. Only text from `steps` whose type is `model_output` is returned; thought steps and other content types are excluded. These fields follow the current [Interactions REST reference](https://ai.google.dev/api/interactions-api) and [text generation guide](https://ai.google.dev/gemini-api/docs/text-generation).

The assistant helps explain public listing descriptions, suggest related demo videos, and answer basic StreamTube questions. Its instructions explicitly say that all current listings are samples, their footage may differ from the descriptions, and no transcripts or footage analysis are available. It cannot operate accounts, upload videos, control the player, or execute commands. It does not claim missing feed, upload, comment, or subscription APIs exist.

## Exact files requiring backend approval

| File | Proposed change |
| --- | --- |
| `src/controllers/ai.controller.js` | New controller: validate context, limit requests, call Gemini, return a bounded plain-text answer or safe error. |
| `src/routes/ai.routes.js` | New router with `POST /ask`, using `verifyJWT` before the controller. |
| `src/app.js` | Add one router import and mount it at `/api/v1/ai`, before the existing error handler. |
| `tests/ai.test.js` | New isolated tests using a stubbed `fetch`; no real Google requests or database access. The existing `npm test` command already discovers this file. |

## Server settings requiring approval

- `GEMINI_API_KEY`: required secret on the Render backend, obtained from the owner's Google AI Studio project. Never put it in `client/`, a `VITE_` variable, Git, or a browser request.
- `GEMINI_MODEL`: optional; defaults to `gemini-3.5-flash-lite` when unset. Check model access and quota for the owner's project before enabling the feature. See the [model information](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite).

The patch contains no secret values and does not change any environment file. `store: false` disables retrievable interaction storage; it does not replace [Google's API terms and data handling policies](https://ai.google.dev/gemini-api/docs/interactions-overview#data-storage-and-retention).

## Request and response

The frontend sends only these fields:

```json
{
  "message": "Find a beginner coding listing",
  "history": [{ "role": "user", "content": "I am learning React" }],
  "catalog": [{
    "id": "demo-code",
    "title": "React example",
    "creator": "Demo creator",
    "category": "Technology",
    "description": "A demo listing; its player uses a sample clip."
  }],
  "currentVideoId": "demo-code"
}
```

- Message: a nonempty string of at most 1,000 characters.
- History: at most four entries; each has role `user` or `assistant` and nonempty `content` of at most 800 characters.
- Catalogue: at most nine entries; string limits are ID 40, title 140, creator 60, category 30, description 350. ID and title cannot be empty.
- `currentVideoId`: optional string, at most 40 characters; a nonempty ID must appear in this request's catalogue.
- The validated context is limited to 12,000 UTF-8 bytes, leaving space below the existing Express 16 KB JSON limit. History, catalogue, and current ID may be omitted for general site questions.

The controller copies allowed fields into a new object. Extra account fields, cookies, private IDs, images, and arbitrary objects are not forwarded. The authenticated user ID is used only inside Render for the rate limit. A visitor can still type personal information into their own message, so the UI should tell them that messages go to Google and ask them to avoid passwords or private details.

Success uses the existing `ApiResponse` shape: `200` with `data: { reply: "..." }`. Replies are capped at 6,000 characters. Safe failures use the existing API envelope fields with statuses `400` invalid input, `401` no session, `503` missing server key, `429` local limit or provider quota, `502` provider/network/response failure, and `504` a 30-second timeout. No raw provider error bodies or keys are logged or returned.

A small in-memory counter allows ten provider requests per signed-in user per minute and removes expired counters during requests. It resets when the server restarts and is separate for each server process; it is a student-project limit, not a shared billing cap. Google project quota still applies.

## Verification and application after approval

Before applying anything, save an exact snapshot of the affected backend files and add the approved changes to `client/CHANGES.md`, following the project rules. Then check and apply the reviewed patch from the repository root:

```powershell
git apply --check client/docs/ask-ai-backend-proposal.patch
# Run the next command only after Yash explicitly approves the backend changes.
git apply client/docs/ask-ai-backend-proposal.patch
npm test
```

Preparation checks already completed: the patch passes `git apply --check`; all ten proposed tests pass when the proposed modules are loaded from the patch into memory. No backend files were created to run those checks and no provider was contacted. Tests cover field and byte limits, authentication, missing configuration, data projection, response text extraction, quota errors, safe network errors, timeout cancellation, reply length, and rate-limit expiry.

Real-provider verification remains pending approval, the owner's API key, and deployment: signed-out requests should return `401`; signed-in requests should return a genuine model answer; missing configuration should return `503`; quota failures should remain readable. Until then, the UI must identify the service as awaiting setup and must not substitute fabricated AI replies.

Undo after application would remove the AI mount/import and the three new backend files using the saved snapshot. **That rollback also needs fresh backend approval.** Deleting these two proposal documents before application does not alter the backend.
