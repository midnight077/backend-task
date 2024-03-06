import { Router } from "express";
const router = Router();

import productsRouter from "./products.js";

router.use("/products", productsRouter);

export default router;
