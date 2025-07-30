import pino from "pino"

const baseLogger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
            singleLine: false,
        },
    },
})

export { baseLogger }
