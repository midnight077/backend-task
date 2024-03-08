import { Model, DataTypes } from "sequelize";
import slugify from "slugify";

import db from "../db.js";

const MAX_HANDLE_GENERATION_ATTEMPTS = 100;

export class Product extends Model {}

Product.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.TEXT,
        vendor: DataTypes.STRING,
        handle: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: db,
        modelName: "Product",
        hooks: {
            async beforeCreate(product) {
                product.handle = await generateUniqueHandle(product);
            },
            async beforeUpdate(product) {
                if (product.changed("title")) {
                    product.handle = await generateUniqueHandle(product);
                }
            },
        },
    },
);

async function generateUniqueHandle(product) {
    if (product.title) {
        const handleBase = slugify(product.title, { lower: true });
        let count = 1;
        while (count <= MAX_HANDLE_GENERATION_ATTEMPTS) {
            const handle = count === 1 ? handleBase : `${handleBase}-${count}`;
            const existingProduct = await Product.findOne({
                where: { handle },
            });
            if (!existingProduct || existingProduct.id === product.id) {
                return handle;
            } else {
                count++;
            }
        }
        throw new Error(
            "Maximum attempts reached while generating unique handle",
        );
    }
}
