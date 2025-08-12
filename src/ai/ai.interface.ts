export type AiChatRole = "user" | "assistant" | "developer" | "system"

export interface AiChat {
    id: string
    text: string
    timestamp: number
    role: AiChatRole
}
