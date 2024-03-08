import db from "../db.js";

import { Variant } from "../models/index.js";

export async function getAllVariants(req, res, next) {
    const { product } = req;
    try {
        const variants = await product.getVariants();

        res.status(200).json({ variants });
    } catch (error) {
        next({ error, publicError: "Failed to get all variants" });
    }
}

export async function createOneVariant(req, res, next) {
    const { product } = req;
    const { price, availableQuantity, availableForSale, options } = req.body;

    if (!options?.length) {
        return res
            .status(400)
            .json({ error: "Options are the key info and hence required" });
    }

    const transaction = await db.transaction();
    try {
        const newVariant = Variant.build({
            price,
            availableQuantity,
            availableForSale,
        });
        newVariant.variantPosition =
            (await product.countVariants({ transaction })) + 1;
        newVariant.variantTitle = options.map((o) => o.value).join(" / ");
        await newVariant.save({ transaction });
        await newVariant.setProduct(product, { transaction });

        const currOptions = product.options ? JSON.parse(product.options) : [];
        options.forEach((option) => {
            const i = currOptions.findIndex((co) => co[0] === option.name);
            if (i > -1) {
                const j = currOptions[i].findIndex(
                    (cov) => cov === option.value,
                );
                if (j < 0) {
                    currOptions[i].push(option.value);
                }
            } else {
                currOptions.push([option.name, [option.value]]);
            }
        });
        product.options = JSON.stringify(currOptions);
        await product.save({ transaction });

        await transaction.commit();

        res.status(201).json({ variant: newVariant });
    } catch (error) {
        await transaction.rollback();
        next({ error, publicError: "Failed to create one variant" });
    }
}

export async function getOneVariant(req, res, next) {
    const { variant } = req;

    try {
        res.status(200).json({ variant });
    } catch (error) {
        next({ error, publicError: "Failed to send one variant" });
    }
}

export async function updateOneVariant(req, res, next) {
    const { product, variant } = req;
    const { price, availableQuantity, availableForSale, options } = req.body;

    if (!options?.length) {
        return res
            .status(400)
            .json({ error: "Options are the key info and hence required" });
    }

    const transaction = await db.transaction();
    try {
        if (price) {
            variant.price = price;
        }
        if (availableQuantity) {
            variant.availableQuantity = availableQuantity;
        }
        if (availableForSale !== undefined && availableForSale !== null) {
            variant.availableForSale = availableForSale;
        }
        variant.variantTitle = options.map((o) => o.value).join(" / ");
        const updatedVariant = await variant.save({ transaction });

        const currOptions = product.options ? JSON.parse(product.options) : [];
        options.forEach((option) => {
            const i = currOptions.findIndex((co) => co[0] === option.name);
            if (i > -1) {
                const j = currOptions[i].findIndex(
                    (cov) => cov === option.value,
                );
                if (j < 0) {
                    currOptions[i].push(option.value);
                }
            } else {
                currOptions.push([option.name, [option.value]]);
            }
        });
        product.options = JSON.stringify(currOptions);
        await product.save({ transaction });

        await transaction.commit();

        res.status(200).json({ variant: updatedVariant });
    } catch (error) {
        await transaction.rollback();
        next({ error, publicError: "Failed to update one variant" });
    }
}

export async function deleteOneVariant(req, res, next) {
    const { variant } = req;

    const transaction = await db.transaction();
    try {
        await variant.destroy({ transaction });

        await transaction.commit();

        res.status(204).json();
    } catch (error) {
        await transaction.rollback();
        next({ error, publicError: "Failed to delete one product" });
    }
}
