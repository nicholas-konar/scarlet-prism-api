import { EventEmitter } from "events"
import { AiChatEventPayload } from "@events/payload.interface"
import { baseLogger } from "@logger"

const log = baseLogger.child({ module: "events" })

interface Events {
    "ai.conversation.created": any
    "ai.prompt.submitted": AiChatEventPayload
    "ai.response.output_text.done": AiChatEventPayload
    "ai.response.completed": any
}

// auto-infer payload type based on event name
interface EventBus {
    publish<K extends keyof Events>(event: K, context: Events[K]): Promise<void>
    subscribe<K extends keyof Events>(
        event: K,
        handler: (context: Events[K]) => void,
    ): Promise<void>
    unsubscribe<K extends keyof Events>(
        event: K,
        handler: (context: Events[K]) => void,
    ): Promise<void>
}

// async for future proofing (RabbitMQ)
export class InMemoryEventBus implements EventBus {
    private emitter = new EventEmitter()

    async publish<K extends keyof Events>(event: K, context: Events[K]) {
        this.emitter.emit(event, context)
        log.info({ msg: `${event} event`, event, context })
    }

    async subscribe<K extends keyof Events>(
        event: K,
        handler: (context: Events[K]) => void,
    ) {
        this.emitter.on(event, handler)
        log.info({
            msg: `subscribed ${handler.name || "anonymous"} fn to event ${event}`,
            event,
            handler: handler.name || "anonymous",
        })
    }

    async unsubscribe<K extends keyof Events>(
        event: K,
        handler: (context: Events[K]) => void,
    ) {
        this.emitter.off(event, handler)
        log.info({
            msg: `unsubscribed ${handler.name || "anonymous"} fn from event ${event}`,
            event,
            handler: handler.name || "anonymous",
        })
    }
}

const eventBus = new InMemoryEventBus()
export { eventBus }
