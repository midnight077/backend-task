import { Sequelize } from "sequelize";

import UserSchema from "./UserSchema.js";

import logger from "../winston.js";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: (msg) => logger.info(msg),
    },
);

const User = sequelize.define("User", UserSchema);

export { sequelize, User };
