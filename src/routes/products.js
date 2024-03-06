import { Router } from "express";
const router = Router();

import { getAllProducts, getProductById } from "../controllers/Product.js";

router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
