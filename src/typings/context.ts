import { Request, Response } from 'express'
import { UserAuthPayload } from './user-auth-payload'

export interface Context {
  req: Request
  res: Response
  user: UserAuthPayload
}
