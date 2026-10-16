// One master flow to remember :-

// COMMON REQUEST FLOW

// Client sends request
//   ↓
// src/index.js: server has started and DB is connected
//   ↓
// src/app.js: Express middleware + router mounting
//   ↓
// src/routes/user.routes.js: matches endpoint
//   ↓
// Optional middleware: verifyJWT / Multer
//   ↓
// src/controllers/user.controller.js: business logic
//   ↓
// src/models/user.model.js: database-related methods/hooks
//   ↓
// MongoDB / Cloudinary as required
//   ↓
// Controller sends HTTP response to client