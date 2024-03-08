import { Model, DataTypes } from "sequelize";
import slugify from "slugify";

import db from "../db.js";

export class Product extends Model {
    get handle() {
        return slugify(this.title, { lower: true, strict: true });
    }
}

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
        options: DataTypes.TEXT,
    },
    {
        sequelize: db,
        modelName: "Product",
    },
);
