import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

export const convertUserIdToJwt = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '7d'
  })
}
