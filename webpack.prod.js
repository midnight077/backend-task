import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { merge } from "webpack-merge";
import common from "./webpack.common.js";

/**
 * @type {import("webpack").Configuration}
 */
export default merge(common, {
    mode: "production",
    devtool: "source-map",
    output: {
        path: join(__dirname, "dist-prod"),
    },
});
