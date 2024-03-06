import "dotenv/config";
import express, { json } from "express";
const app = express();

import apiRoutes from "./routes/api.js";

app.use(json());

app.use("/api", apiRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
