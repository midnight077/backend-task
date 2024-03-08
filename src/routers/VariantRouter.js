import { Router } from "express";
const router = Router({ mergeParams: true });

import {
    getAllVariants,
    createOneVariant,
    getOneVariant,
    updateOneVariant,
    deleteOneVariant,
} from "../controllers/VariantController.js";

router.get("/", getAllVariants);
router.post("/", createOneVariant);
router.get("/:id", getOneVariant);
router.patch("/:id", updateOneVariant);
router.delete("/:id", deleteOneVariant);

export default router;
