import { Context } from "koa";
import OpenAi from 'openai'
import log from '@logger'

async function chat(ctx: Context) {
  log.info('logger works')
  log.info({ msg: 'json logging works' })

  const apiKey = process.env.OPENAI_API_KEY
  const client = new OpenAi({ apiKey })

  const response = await client.responses.create({
    model: 'gpt-4.1',
    input: 'This is a test. Did I pass?'
  })
  log.info(response)
  ctx.body = { output: response.output, output_text: response.output_text }
}

export const aiController = { chat }
