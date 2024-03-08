import { Router } from "express";
const router = Router();

import UserRouter from "./UserRouter.js";
import TokenRouter from "./TokenRouter.js";

router.use("/user", UserRouter);
router.use("/token", TokenRouter);

export default router;
