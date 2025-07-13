import { createClient, RedisClientType } from "redis"
import log from "@logger"

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

const client: RedisClientType = createClient({ url: redisUrl })

client.on("ready", () => log.info("Connected to Redis."))
client.on("error", (err) => log.error("Redis Client Error:", err))

export default client
