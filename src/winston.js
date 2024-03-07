import {
    createLogger,
    format as _format,
    transports as _transports,
} from "winston";
const { combine, timestamp, json, prettyPrint, errors } = _format;

const loggerInDev = createLogger({
    level: "info",
    format: combine(
        timestamp(),
        json(),
        prettyPrint(),
        errors({ stack: true }),
    ),
    transports: [new _transports.Console()],
});

const loggerInProd = createLogger({
    level: "info",
    format: combine(timestamp(), json(), errors({ stack: true })),
    transports: [
        new _transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
        }),
        new _transports.File({ dirname: "logs", filename: "combined.log" }),
    ],
});

export default process.env.NODE_ENV === "production"
    ? loggerInProd
    : loggerInDev;
