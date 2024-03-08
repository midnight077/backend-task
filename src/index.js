import "dotenv/config";
import express, { json } from "express";

import db from "./db.js";
import logger from "./winston.js";

import ApiRouter from "./routers/index.js";

const app = express();

app.use(json());
app.use("/api", ApiRouter);

try {
    await db.authenticate();
    logger.info("DB connected");
    await db.sync();
    logger.info("DB synced");

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
} catch (error) {
    logger.error("Unable to start the server:", error);
}
