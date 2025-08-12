import { AiChatRole } from "@ai/ai.interface"

export interface AiChatEventPayload {
    conversationId: string
    role: AiChatRole
    text: string
}

export interface AiConversationCreatedEventPayload {
    conversationId: string
    createdAt: number
}
