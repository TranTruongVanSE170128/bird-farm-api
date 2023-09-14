import { Request, Response } from 'express'
import User from '../models/user'

export const whoAmI = async (req: Request, res: Response) => {
  const id = res.locals.userId

  const user = await User.findById(id)
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng', success: false })
  }

  return res.status(200).json({ success: true, message: 'Lấy người dùng thành công!', user })
}
