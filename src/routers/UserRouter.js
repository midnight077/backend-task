import { Router } from "express";
const router = Router();

import {
    userLogin,
    userLogout,
    userRegister,
} from "../controllers/UserController.js";

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);

export default router;
