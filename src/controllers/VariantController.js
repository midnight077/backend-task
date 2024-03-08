import db from "../db.js";

import { OptionName, OptionValue, Product, Variant } from "../models/index.js";

export async function getAllVariants(req, res, next) {
    const { handle } = req.params;
    try {
        const product = await Product.findOne({ where: { handle } });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        const variants = await product.getVariants();

        res.status(200).json({ variants });
    } catch (error) {
        next({ error, publicError: "Failed to get all variants" });
    }
}

export async function createOneVariant(req, res, next) {
    const { handle } = req.params;
    const { options } = req.body;
    const { id, price, availableQuantity, availableForSale } = req.body;
    if (!options?.length) {
        return res
            .status(400)
            .json({ error: "Options are the key info and hence required" });
    }
    if (!price || !availableQuantity || !availableForSale) {
        return res
            .status(400)
            .json({ error: "Price and availability info is required" });
    }

    const transaction = await db.transaction();
    try {
        const product = await Product.findOne({
            where: { handle },
            transaction,
        });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({ error: "Product not found" });
        }

        const newVariant = Variant.build({
            price,
            availableQuantity,
            availableForSale,
        });
        if (id) newVariant.id = id;
        newVariant.variantPosition =
            (await product.countVariants({ transaction })) + 1;
        newVariant.variantTitle = options.map((o) => o.value).join(" / ");
        await newVariant.save({ transaction });
        await newVariant.setProduct(product, { transaction });

        for (const option of options) {
            const { name, value } = option;

            const [optionName] = await OptionName.findOrCreate({
                where: { name },
                transaction,
            });

            const [optionValue] = await OptionValue.findOrCreate({
                where: { value },
                transaction,
            });
            await optionValue.setOptionName(optionName, { transaction });

            await optionValue.addVariant(newVariant, { transaction });
        }

        await transaction.commit();

        res.status(201).json(newVariant);
    } catch (error) {
        await transaction.rollback();
        next({ error, publicError: "Failed to create one variant" });
    }
}

export async function getOneVariant(req, res, next) {
    const { handle, id } = req.params;
    try {
        const product = await Product.findOne({ where: { handle } });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const variant = await Variant.findOne({ where: { id } });
        if (!variant) {
            return res.status(404).json({ error: "Variant not found" });
        }

        res.status(200).json({ variant });
    } catch (error) {
        next({ error, publicError: "Failed to get one variant" });
    }
}

export async function updateOneVariant(req, res, next) {
    const { handle, id } = req.params;
    const { options } = req.body;
    const { price, availableQuantity, availableForSale } = req.body;

    const transaction = await db.transaction();
    try {
        const product = await Product.findOne({ where: { handle } });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({ error: "Product not found" });
        }

        const variant = await Variant.findOne({ where: { id } });
        if (!variant) {
            await transaction.rollback();
            return res.status(404).json({ error: "Variant not found" });
        }

        if (
            !options?.length &&
            !price &&
            !availableQuantity &&
            availableForSale !== undefined &&
            availableForSale !== null
        ) {
            await transaction.rollback();
            return res.status(400).json({ error: "Nothing to update" });
        }

        if (options?.length) {
            // get current names and values
            const currOptionValues = await variant.getOptionValues({
                transaction,
            });
            const currOptionNames = await Promise.all(
                currOptionValues.map(
                    async (cov) => await cov.getOptionName({ transaction }),
                ),
            );

            // remove options which are not given
            // loop over current options
            for (let ind = 0; ind < currOptionNames.length; ind++) {
                // current name name not found in given names
                if (
                    !options.find((o) => o.name === currOptionNames[ind].name)
                ) {
                    const notFoundName = currOptionNames[ind];
                    const notFoundValue = currOptionValues[ind];

                    // check if not found name is being used in other variants
                    if (
                        (await notFoundValue.countVariants({ transaction })) > 1
                    ) {
                        // being used, so remove value from current variant only
                        await notFoundValue.removeVariant(variant, {
                            transaction,
                        });
                    } else {
                        // not in use, destroy
                        await notFoundValue.destroy({ transaction });

                        if (!(await notFoundName.countOptionValues())) {
                            await notFoundName.destroy({ transaction });
                        }
                    }
                }
            }

            // add or update given option
            // loop on given options
            for (const option of options) {
                const { name, value } = option;

                // find given name in current names
                const foundNameInd = currOptionNames.findIndex(
                    (con) => con.name === name,
                );
                // name found
                if (foundNameInd > -1) {
                    const foundName = currOptionNames[foundNameInd];
                    const foundValue = currOptionValues[foundNameInd];

                    // value is different
                    if (foundValue.value !== value) {
                        // check if it is being used in other variants
                        if (
                            (await foundValue.countVariants({ transaction })) >
                            1
                        ) {
                            // being used, so remove from current variant only
                            await foundValue.removeVariant(variant, {
                                transaction,
                            });
                        } else {
                            // not in use, destroy
                            await foundValue.destroy({ transaction });
                        }
                        // find in existing values or create a new value
                        const [optionValue] = await OptionValue.findOrCreate({
                            where: { value },
                            transaction,
                        });
                        // check to see if it is found and not created
                        const haveName = await optionValue.getOptionName({
                            transaction,
                        });
                        // if found
                        if (haveName) {
                            // but already in use with different name
                            if (haveName.id !== foundName.id) {
                                // send error
                                await transaction.rollback();
                                return res.status(400).json({
                                    error: `Option value "${optionValue.value}" is already is use with option name "${haveName.name}"`,
                                });
                            } else {
                                await optionValue.addVariant(variant, {
                                    transaction,
                                });
                            }
                        }
                        // if created new value
                        else {
                            // add new value to name
                            await optionValue.setOptionName(foundName, {
                                transaction,
                            });
                            // add new value to current variant
                            await optionValue.addVariant(variant, {
                                transaction,
                            });
                        }
                    }
                }
                // name not found
                else {
                    // find in existing names or create a new name
                    const [optionName] = await OptionName.findOrCreate({
                        where: { name },
                        transaction,
                    });
                    // find value in existing values or create a new value
                    const [optionValue] = await OptionValue.findOrCreate({
                        where: { value },
                        transaction,
                    });
                    // check to see if it is found and not created
                    const haveName = await optionValue.getOptionName({
                        transaction,
                    });
                    // if found
                    if (haveName) {
                        // but already in use with different name
                        if (haveName.id !== optionName.id) {
                            // send error
                            await transaction.rollback();
                            return res.status(400).json({
                                error: `Option value "${optionValue.value}" is already is use with option name "${haveName.name}"`,
                            });
                        } else {
                            // add new value to name and current variant
                            await optionValue.setOptionName(optionName, {
                                transaction,
                            });
                            await optionValue.addVariant(variant, {
                                transaction,
                            });
                        }
                    }
                    // if created new value
                    else {
                        // add new value to name and current variant
                        await optionValue.setOptionName(optionName, {
                            transaction,
                        });
                        await optionValue.addVariant(variant, { transaction });
                    }
                }
            }

            // update title based on updated options
            variant.variantTitle = (
                await variant.getOptionValues({
                    order: [["optionNameId", "ASC"]],
                    transaction,
                })
            )
                .map((ov) => ov.value)
                .join(" / ");
        }

        if (price) {
            variant.price = price;
        }
        if (availableQuantity) {
            variant.availableQuantity = availableQuantity;
        }
        if (availableForSale !== undefined && availableForSale !== null) {
            variant.availableForSale = availableForSale;
        }
        const updatedVariant = await variant.save({ transaction });

        await transaction.commit();

        res.status(200).json(updatedVariant);
    } catch (error) {
        await transaction.rollback();
        next({ error, publicError: "Failed to update one variant" });
    }
}

export async function deleteOneVariant(req, res, next) {
    const { handle, id } = req.params;

    const transaction = await db.transaction();
    try {
        const product = await Product.findOne({ where: { handle } });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({ error: "Product not found" });
        }

        const variant = await Variant.findOne({ where: { id } });
        if (!variant) {
            await transaction.rollback();
            return res.status(404).json({ error: "Variant not found" });
        }

        // get current names and values
        const currOptionValues = await variant.getOptionValues({
            transaction,
        });
        const currOptionNames = await Promise.all(
            currOptionValues.map(
                async (cov) => await cov.getOptionName({ transaction }),
            ),
        );

        await variant.destroy({ transaction });

        // remove options
        // loop over current options
        for (let ind = 0; ind < currOptionNames.length; ind++) {
            // check if not found name is being used in other variants
            if (!(await currOptionValues[ind].countVariants({ transaction }))) {
                // not in use, destroy
                await currOptionValues[ind].destroy({ transaction });

                if (
                    !(await currOptionNames[ind].countOptionValues({
                        transaction,
                    }))
                ) {
                    await currOptionNames[ind].destroy({ transaction });
                }
            }
        }

        await transaction.commit();

        res.status(204).json();
    } catch (error) {
        await transaction.rollback();
        next({ error, publicError: "Failed to delete one product" });
    }
}
