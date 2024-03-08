import { Router } from "express";
const router = Router();

import UserRouter from "./UserRouter.js";

router.use("/user", UserRouter);

export default router;
