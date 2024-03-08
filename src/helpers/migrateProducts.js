import async from "async";

import { readFileLineByLine } from "./fileReader.js";

import db from "../db.js";

import { Product, Variant } from "../models/index.js";

import logger from "../winston.js";

async function processBatch({ batch, id }, completed) {
    log > 0 && console.time(`batchId ${id}`);

    const productsData = [];
    const variantsData = [];
    batch.forEach((product) => {
        const { id, title, description, vendor, options } = product;
        productsData.push({
            id,
            title,
            description,
            vendor,
            options: JSON.stringify(options),
        });
        variantsData.push(
            ...product.variants.map((variant) => {
                variant.ProductId = variant.productId;
                return variant;
            }),
        );
    });

    const transaction = await db.transaction();
    try {
        await Product.bulkCreate(productsData, {
            ignoreDuplicates: true,
            transaction,
        });

        await Variant.bulkCreate(variantsData, {
            ignoreDuplicates: true,
            transaction,
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        logger.error(`[ERROR] batchId: ${id}`, error);
    }

    log > 0 && console.timeEnd(`batchId ${id}`);

    completed();
}

async function seedDb(filename, maxBatchSize, maxConcurrencyLimit) {
    let batch = [];

    const queue = async.queue(processBatch, maxConcurrencyLimit);

    let batchId = 1;

    for await (const line of readFileLineByLine(filename)) {
        try {
            const product = JSON.parse(line);

            if (batch.length >= maxBatchSize) {
                queue.push({
                    batch,
                    id: batchId++,
                    length: batch.length,
                });
                batch = [];
            }

            batch.push(product);
        } catch (error) {
            logger.info(error);
        }
    }

    if (batch.length > 0) {
        queue.push({
            batch,
            id: batchId++,
            length: batch.length,
        });
    }

    await queue.drain();
}

let log = 0;

try {
    if (process.argv.length > 2) {
        let filename;
        let maxBatchSizebatchSize;
        let maxConcurrencyLimit;
        for (let i = 2; i < process.argv.length; i++) {
            if (process.argv[i].match(/-[fbcl]=/)) {
                const cmd = process.argv[i].split("=");
                switch (cmd[0]) {
                    case "-f":
                        filename = cmd[1];
                        break;
                    case "-b":
                        maxBatchSizebatchSize = Number(cmd[1]);
                        break;
                    case "-c":
                        maxConcurrencyLimit = Number(cmd[1]);
                        if (maxConcurrencyLimit > process.env.DB_MAX_POOL) {
                            maxConcurrencyLimit = process.env.DB_MAX_POOL;
                            logger.info(
                                "Concurrency limit saturated by DB_MAX_POOL",
                            );
                        }
                        break;
                    case "-l":
                        log = Number(cmd[1]);
                        break;
                    default:
                        break;
                }
            }
        }
        if (!filename || !maxBatchSizebatchSize || !maxConcurrencyLimit) {
            throw new Error(
                "Explicitly set file name, batch size and concurrency limit like -f='filename.jsonl' -b=5 -c=2",
            );
        }

        await db.authenticate();
        log > 0 && logger.info("DB connected");
        await db.sync({ force: true });
        log > 0 && logger.info("DB force synced");

        console.time("seedDb");
        await seedDb(filename, maxBatchSizebatchSize, maxConcurrencyLimit);
        console.timeEnd("seedDb");
    } else {
        throw new Error(
            "Explicitly set file name, batch size and concurrency limit like -f='filename.jsonl' -b=5 -c=2",
        );
    }
} catch (error) {
    logger.error("[ERROR] Failed to run migration", error);
}
