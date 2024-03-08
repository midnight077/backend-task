import { Router } from "express";
const router = Router();

import UserRouter from "./UserRouter.js";
import TokenRouter from "./TokenRouter.js";
import ProductRouter from "./ProductRouter.js";

import { verifyAccessToken } from "../middlewares/authenticateRequest.js";

router.use("/user", UserRouter);
router.use("/token", TokenRouter);
router.use("/products", ProductRouter);

router.get("/protected", verifyAccessToken, (req, res) => {
    res.send({ email: req.email, message: "hi" });
});

export default router;
