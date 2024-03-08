import { Router } from "express";
const router = Router();

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
router.get("/:handle", getOneProduct);
router.patch("/:handle", updateOneProduct);
router.delete("/:handle", deleteOneProduct);

router.use("/:handle/variants", VariantRouter);

export default router;
