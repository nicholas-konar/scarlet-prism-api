import { Context, Next } from "koa"
import auth from "@util/jwt"

export async function jwt(ctx: Context, next: Next) {
    const token = ctx.headers.authorization?.split(" ")[1]
    ctx.state.jwt = auth.verifyToken(token)
    await next()
}
