import { Router } from "express";
const router = Router();

import { validateProduct } from "../middlewares/validateRequest.js";

import {
    getAllProducts,
    createOneProduct,
    getOneProduct,
    updateOneProduct,
    deleteOneProduct,
} from "../controllers/ProductController.js";

import VariantRouter from "./VariantRouter.js";

router.get("/", getAllProducts);
router.post("/", createOneProduct);

router.get("/:productHandle", validateProduct, getOneProduct);
router.patch("/:productHandle", validateProduct, updateOneProduct);
router.delete("/:productHandle", validateProduct, deleteOneProduct);

router.use("/:productHandle/variants", validateProduct, VariantRouter);

export default router;
