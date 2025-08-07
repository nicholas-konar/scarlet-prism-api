import { eventBus } from "src/events"
import { AiService } from "./ai.service"
import { baseLogger } from "@logger"

const log = baseLogger.child({ module: "ai.subscribe" })

eventBus.subscribe("ai.chat.response.completed", async (context) => {
    const { conversationId, role, text } = context
    await AiService.saveChat({
        conversationId,
        role,
        text,
    })
    log.info("subscriber triggered")
})
