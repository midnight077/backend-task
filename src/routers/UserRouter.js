import { Router } from "express";
const router = Router();

import { verifyRefreshToken } from "../middlewares/authenticateRequest.js";

import {
    userLogin,
    userLogout,
    userRegister,
} from "../controllers/UserController.js";

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", verifyRefreshToken, userLogout);

export default router;
