/**
 * @type {{[key: string]: import("sequelize").Options}}
 */
const envBasedDbConfigs = {
    development: {
        database: process.env.DB_NAME || "backendtaskdev",
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "ghoda",
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
    },
    test: {
        database: process.env.DB_NAME || "backendtasktest",
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "ghoda",
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
    },
    production: {
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dialect: "mysql",
    },
};

const dbConfigs = envBasedDbConfigs[process.env.NODE_ENV || "development"];

export default dbConfigs;
