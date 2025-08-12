import { Context } from "koa"
import { AiService } from "./ai.service"
import { baseLogger } from "@logger"
import { v4 as uuid } from "uuid"
import { eventBus } from "@events"
import {
    AiChatEventPayload,
    AiConversationCreatedEventPayload,
} from "@events/payload.interface"

async function create(ctx: Context) {
    const conversationId = uuid()

    await eventBus.publish("ai.conversation.created", {
        conversationId,
        createdAt: Date.now(),
    } as AiConversationCreatedEventPayload)

    ctx.status = 201
    ctx.body = { conversationId }
}

interface AiChatRequest {
    prompt: string
    conversationId: string
}

async function chat(ctx: Context) {
    const conversationId = ctx.params.id
    const { prompt } = ctx.request.body as AiChatRequest

    ctx.status = 200
    ctx.set({
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    })

    await eventBus.publish("ai.prompt.submitted", {
        conversationId,
        role: "user",
        text: prompt,
    } as AiChatEventPayload)

    const log = baseLogger.child({ function: "ai.ctrl.chat" })

    try {
        const stream = await AiService.createChatStream(prompt, conversationId)

        for await (const event of stream) {
            switch (event.type) {
                case "response.output_text.delta":
                    ctx.res.write(`data: ${JSON.stringify(event.delta)}\n\n`)
                    break
                case "response.output_text.done":
                    eventBus.publish("ai.response.output_text.done", {
                        conversationId,
                        role: "assistant",
                        text: event.text,
                    } as AiChatEventPayload)
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

export const aiController = { create, chat }
