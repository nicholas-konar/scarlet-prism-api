import Router from "@koa/router";
import { aiController } from "@controllers";

const aiRouter = new Router({ prefix: '/ai' })

aiRouter.get('/chat', aiController.chat)

export { aiRouter }
