import { Model, DataTypes } from "sequelize";

import db from "../db.js";

export class User extends Model {}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        password: DataTypes.STRING,
        refreshToken: DataTypes.STRING,
    },
    {
        sequelize: db,
        modelName: "User",
    },
);
