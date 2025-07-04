import { Context } from "koa";
import log from '@logger'

async function chat(ctx: Context) {
  ctx.body = "test"
  log.info('logger works')
  log.info({ msg: 'json logging works' })
}

export const aiController = { chat }
