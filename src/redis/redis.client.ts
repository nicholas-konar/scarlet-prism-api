import { createClient, RedisClientType } from "redis"
import { baseLogger } from "@logger"

const log = baseLogger.child({ module: "redis" })

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

const client: RedisClientType = createClient({ url: redisUrl })

client.on("ready", () => log.info("Connected to Redis."))
client.on("error", (err) => log.error({ error: err }, "Redis Client Error:"))

export default client
