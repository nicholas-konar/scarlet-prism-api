import Koa from "koa"
import "dotenv/config"
import cors from "@koa/cors"
import bodyParser from "koa-bodyparser"
import { aiRouter } from "@routers"
import { baseLogger } from "@logger"
import redisClient from "./redis"

const app = new Koa()
const log = baseLogger.child({})

// Global error handler
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err: any) {
        ctx.status = err.status || 500
        ctx.body = { error: err.message }
        log.error({ error: err.message, status: err.status })
    }
})

app.use(
    cors({
        origin: "*", // or '*' to allow any
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        exposeHeaders: ["Content-Length"],
    }),
)

app.use(async (ctx, next) => {
    await next()
    // this runs after all the downstream middleware (including routes)
    // so ctx.response.headers now contains the CORS headers + any others
    log.info({
        path: ctx.path,
        status: ctx.status,
        headers: ctx.response.headers,
    })
})

app.use(bodyParser())
app.use(aiRouter.routes())
app.use(aiRouter.allowedMethods())

redisClient.connect()

process.on("SIGINT", async () => {
    redisClient.destroy()
    process.exit(0)
})

process.on("SIGTERM", async () => {
    redisClient.destroy()
    process.exit(0)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
