import "dotenv/config"
import { AccessDeniedError } from "@errors/http-errors"
import jwt, { JwtPayload } from "jsonwebtoken"

const secret = process.env.JWT_SECRET as string

function issueToken(userId: string) {
    const payload = { userId }
    const options = { expiresIn: "1h" }
    return jwt.sign(payload, secret, options)
}

function verifyToken(token?: string): JwtPayload {
    if (!token) throw new AccessDeniedError()
    return jwt.verify(token, secret) as JwtPayload
}

export default { issueToken, verifyToken }
