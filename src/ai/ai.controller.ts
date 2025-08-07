import { Context } from "koa"
import { AiService } from "./ai.service"
import { baseLogger } from "@logger"
import { eventBus } from "@events"
import { AiChatEventPayload } from "./ai.interface"

interface AiChatRequest {
    prompt: string
    conversationId: string
}

async function chat(ctx: Context) {
    const { prompt, conversationId } = ctx.request.body as AiChatRequest

    ctx.status = 200
    ctx.set({
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    })

    const userChat: AiChatEventPayload = {
        conversationId,
        role: "user",
        text: prompt,
    }
    await eventBus.publish("ai.chat.user.prompt.submitted", userChat)

    const log = baseLogger.child({ function: "ai.ctrl.chat" })

    try {
        const stream = await AiService.getChatStream(prompt, conversationId)

        for await (const event of stream) {
            switch (event.type) {
                case "response.output_text.delta":
                    ctx.res.write(`data: ${JSON.stringify(event.delta)}\n\n`)
                    break
                case "response.output_text.done":
                    const aiChat: AiChatEventPayload = {
                        conversationId,
                        role: "assistant",
                        text: event.text,
                    }
                    eventBus.publish(
                        "ai.chat.response.output_text.done",
                        aiChat,
                    )
                    break
                case "response.completed":
                    const usage = event.response.usage
                    log.info({
                        msg: "AI chat response complete.",
                        model: event.response.model,
                        tokens: {
                            input: usage?.input_tokens,
                            output: usage?.output_tokens,
                            total: usage?.total_tokens,
                        },
                    })
                    break
            }
        }
        ctx.res.write("event: done\ndata: [DONE]\n\n")
    } catch (err: any) {
        log.error(err)
        ctx.res.write(`event: error\ndata: ${err.message || err}\n\n`)
    } finally {
        ctx.res.end()
    }
}

export const aiController = { chat }
