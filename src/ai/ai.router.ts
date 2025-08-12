import Router from "@koa/router"
import { aiController } from "@controllers"

const aiRouter = new Router({ prefix: "/c" })

aiRouter.post("/", aiController.create)
aiRouter.post("/:id", aiController.chat)

export { aiRouter }
