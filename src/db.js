import { Sequelize } from "sequelize";

import dbConfigs from "../sequelize.config.js";
import logger from "./winston.js";

const db = new Sequelize({
    ...dbConfigs,
    logging: (msg) => logger.info(msg),
    define: {
        timestamps: false,
    },
});

export default db;
