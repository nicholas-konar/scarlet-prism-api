import { Context } from "koa";

async function chat(ctx: Context) {
  ctx.body = "test"
}

export const aiController = { chat }
