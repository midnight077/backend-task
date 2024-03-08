import { Model, DataTypes } from "sequelize";

import db from "../db.js";

export class OptionName extends Model {}

OptionName.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize: db,
        modelName: "OptionName",
    },
);
