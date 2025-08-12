import { eventBus } from "src/events"
import { AiService } from "./ai.service"

eventBus.subscribe("ai.conversation.created", AiService.createConversation)
eventBus.subscribe("ai.prompt.submitted", AiService.updateConversationHistory)
eventBus.subscribe("ai.response.completed", AiService.updateConversationHistory)
