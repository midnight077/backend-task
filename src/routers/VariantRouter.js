import { Router } from "express";
const router = Router({ mergeParams: true });

import { validateVariant } from "../middlewares/validateRequest.js";

import {
    getAllVariants,
    createOneVariant,
    getOneVariant,
    updateOneVariant,
    deleteOneVariant,
} from "../controllers/VariantController.js";

router.get("/", getAllVariants);
router.post("/", createOneVariant);
router.get("/:variantHandle", validateVariant, getOneVariant);
router.patch("/:variantHandle", validateVariant, updateOneVariant);
router.delete("/:variantHandle", validateVariant, deleteOneVariant);

export default router;
