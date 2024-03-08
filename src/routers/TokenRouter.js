import { Router } from "express";
const router = Router();

import { verifyRefreshToken } from "../middlewares/authenticateRequest.js";

import { refreshToken } from "../controllers/TokenController.js";

router.post("/refresh", verifyRefreshToken, refreshToken);

export default router;
