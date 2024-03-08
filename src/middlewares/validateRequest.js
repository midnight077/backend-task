import { Product, Variant } from "../models/index.js";

export async function validateProduct(req, res, next) {
    const { productHandle } = req.params;
    const { productId } = req.query;

    try {
        if (!productId) {
            return res.status(400).json({ error: "Product id is required" });
        }

        const product = await Product.findByPk(productId);
        if (!product || product.handle !== productHandle) {
            return res.status(404).json({ error: "Product not found" });
        }

        req.product = product;
        next();
    } catch (error) {
        next({ error, publicError: "Failed to validate product" });
    }
}

export async function validateVariant(req, res, next) {
    const { variantHandle } = req.params;
    const { variantId } = req.query;

    try {
        if (!variantId) {
            return res.status(400).json({ error: "Variant id is required" });
        }

        const variant = await Variant.findByPk(variantId);
        if (!variant || variant.handle !== variantHandle) {
            return res.status(404).json({ error: "Variant not found" });
        }

        req.variant = variant;
        next();
    } catch (error) {
        next({ error, publicError: "Failed to validate variant" });
    }
}
