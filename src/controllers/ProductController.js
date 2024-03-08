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
    const { id, title, description, vendor } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const newProduct = Product.build({ title, description, vendor });
        if (id) newProduct.id = id;
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        next({ error, publicError: "Failed to create one product" });
    }
}

export async function getOneProduct(req, res, next) {
    const handle = req.params.handle;
    try {
        const product = await Product.findOne({ where: { handle } });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ product });
    } catch (error) {
        next({ error, publicError: "Failed to get one product" });
    }
}

export async function updateOneProduct(req, res, next) {
    const handle = req.params.handle;
    const { title, description, vendor } = req.body;

    try {
        const product = await Product.findOne({ where: { handle } });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

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

        res.status(200).json(updatedProduct);
    } catch (error) {
        next({ error, publicError: "Failed to update one product" });
    }
}

export async function deleteOneProduct(req, res, next) {
    const handle = req.params.handle;

    try {
        const isDeleted = Product.destroy({ where: { handle } });
        if (!isDeleted) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(204).json();
    } catch (error) {
        next({ error, publicError: "Failed to delete one product" });
    }
}
