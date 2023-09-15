import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token not found' })
  }
  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
    res.locals.userId = decode.userId
    next()
  } catch (err) {
    console.log(err)
    res.status(403).json({ success: false, message: 'Invalid token' })
  }
}

export default verifyToken
