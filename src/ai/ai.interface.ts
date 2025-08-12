export type AiChatRole = "user" | "assistant" | "developer" | "system"

export interface AiChat {
    id: string
    text: string
    timestamp: number
    role: AiChatRole
}

export interface AiChatEventPayload {
    conversationId: string
    role: AiChatRole
    text: string
}

export interface AiConversationCreatedEventPayload {
    conversationId: string
    createdAt: number
}
