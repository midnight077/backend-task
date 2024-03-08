import { Router } from "express";
const router = Router();

import {
    getAllProducts,
    createOneProduct,
    getOneProduct,
    updateOneProduct,
    deleteOneProduct,
} from "../controllers/ProductController.js";

router.get("/", getAllProducts);
router.post("/", createOneProduct);
router.get("/:handle", getOneProduct);
router.patch("/:handle", updateOneProduct);
router.delete("/:handle", deleteOneProduct);

export default router;
