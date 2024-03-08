import { Router } from "express";
const router = Router();

import UserRouter from "./UserRouter.js";
import TokenRouter from "./TokenRouter.js";
import ProductRouter from "./ProductRouter.js";

router.use("/user", UserRouter);
router.use("/token", TokenRouter);
router.use("/products", ProductRouter);

export default router;
