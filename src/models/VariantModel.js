import { Model, DataTypes } from "sequelize";
import slugify from "slugify";

import db from "../db.js";

export class Variant extends Model {
    get handle() {
        return slugify(this.variantTitle, { lower: true, strict: true });
    }
}

Variant.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        variantTitle: DataTypes.STRING,
        price: DataTypes.STRING,
        availableQuantity: DataTypes.INTEGER.UNSIGNED,
        availableForSale: DataTypes.BOOLEAN,
        variantPosition: DataTypes.INTEGER.UNSIGNED,
    },
    {
        sequelize: db,
        modelName: "Variant",
    },
);
