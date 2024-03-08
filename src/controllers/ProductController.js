import { Product } from "../models/index.js";

export async function getAllProducts(req, res, next) {
    try {
        const products = await Product.findAll();

        res.status(200).json({ products });
    } catch (error) {
        next({ error, publicError: "Failed to get all products" });
    }
}

export async function createOneProduct(req, res, next) {
    const { title, description, vendor } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const product = await Product.create({ title, description, vendor });

        res.status(201).json({ product });
    } catch (error) {
        next({ error, publicError: "Failed to create one product" });
    }
}

export async function getOneProduct(req, res, next) {
    const { product } = req;

    try {
        res.status(200).json({ product });
    } catch (error) {
        next({ error, publicError: "Failed to send one product" });
    }
}

export async function updateOneProduct(req, res, next) {
    const { product } = req;
    const { title, description, vendor } = req.body;

    try {
        if (!title && !description && !vendor) {
            return res.status(400).json({ error: "Nothing to update" });
        }

        if (title) {
            product.title = title;
        }
        if (description) {
            product.description = description;
        }
        if (vendor) {
            product.vendor = vendor;
        }
        const updatedProduct = await product.save();

        res.status(200).json({ product: updatedProduct });
    } catch (error) {
        next({ error, publicError: "Failed to update one product" });
    }
}

export async function deleteOneProduct(req, res, next) {
    const { product } = req;

    try {
        await product.destroy();

        res.status(204).json();
    } catch (error) {
        next({ error, publicError: "Failed to delete one product" });
    }
}
