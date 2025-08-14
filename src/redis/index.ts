import client from "@redis/redis.client"

client.connect()

process.on("SIGINT", async () => {
    client.destroy()
    process.exit(0)
})

process.on("SIGTERM", async () => {
    client.destroy()
    process.exit(0)
})
