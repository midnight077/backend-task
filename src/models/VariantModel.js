import { Model, DataTypes } from "sequelize";

import db from "../db.js";

export class Variant extends Model {}

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
