import "dotenv/config";
import express, { json } from "express";

import ApiRouter from "./routers/index.js";

import { sequelize } from "./models/index.js";

const app = express();

app.use(json());
app.use("/api", ApiRouter);

try {
    await sequelize.authenticate();
    console.log("DB connected");
    await sequelize.sync();
    console.log("DB synced");

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error("Unable to start the server:", error);
}
