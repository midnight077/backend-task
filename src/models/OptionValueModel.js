import { Model, DataTypes } from "sequelize";

import db from "../db.js";

export class OptionValue extends Model {}

OptionValue.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize: db,
        modelName: "OptionValue",
    },
);
