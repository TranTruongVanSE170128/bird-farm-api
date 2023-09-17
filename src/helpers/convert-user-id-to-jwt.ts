import jwt from 'jsonwebtoken'

export const convertUserToJwt = (user: any) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '7d'
  })
}
