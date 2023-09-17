import { NextFunction, Request, Response } from 'express'
import { Role } from '../typings/types'

const checkRole = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user?.role || !roles.includes(res.locals.user.role)) {
    console.log(res.locals.user?.role)
    return res.status(403).json({ success: false, message: 'Bạn không có quyền!' })
  }

  next()
}

export default checkRole
