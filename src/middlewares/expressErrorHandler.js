import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { BaseError, UniqueConstraintError, ValidationError } from "sequelize";

import logger from "../winston.js";

export function expressErrorHandler({ error, publicError }, req, res, next) {
    if (error instanceof JsonWebTokenError) {
        res.status(403);
        if (error instanceof TokenExpiredError) {
            res.json({ error: "Token expired" });
        } else {
            res.json({ error: "Invalid token" });
        }
    } else if (error instanceof BaseError) {
        if (error instanceof ValidationError) {
            res.status(400);
        } else if (error instanceof UniqueConstraintError) {
            res.status(409);
        } else {
            res.status(500);
        }
        res.json({ error: publicError, reason: error.message });
        logger.error(error.message, error);
    } else {
        res.status(500).json({
            error: publicError,
            reason: "Internal server error",
        });
        logger.error(publicError, error);
    }
    next();
}
