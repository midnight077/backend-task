import { join, dirname, resolve as _resolve } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import nodeExternals from "webpack-node-externals";

/**
 * @type {import("webpack").Configuration}
 */
export default {
    target: "node",
    externals: [nodeExternals()],
    entry: join(__dirname, "src", "index"),
    output: {
        filename: "app.cjs",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [_resolve(__dirname, "src")],
                exclude: [_resolve(__dirname, "node_modules")],
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
};
