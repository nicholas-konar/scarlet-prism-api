import Router from "@koa/router";
import { aiController } from "@controllers";

const aiRouter = new Router({ prefix: '/ai' })

aiRouter.post('/chat', aiController.chat)

export { aiRouter }
