import { DataTypes } from "sequelize";

/**
 * @type {import("sequelize").ModelAttributes}
 */
const UserSchema = {
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    password: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
};

export default UserSchema;
