import { Sequelize } from "sequelize";

import dbConfigs from "../sequelize.config.js";

const db = new Sequelize({
    ...dbConfigs,
    logging: false,
    define: {
        timestamps: false,
    },
});

export default db;
