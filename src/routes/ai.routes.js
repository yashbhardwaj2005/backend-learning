import { Router } from "express";
import { askAI } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Reuse the existing HTTP-only cookie session. This endpoint is not public.
router.post("/ask", verifyJWT, askAI);

export default router;
