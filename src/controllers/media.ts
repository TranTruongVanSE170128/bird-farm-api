import { Request, Response } from 'express'
import { zParse } from '../helpers/z-parse'
import { updateMediaSchema } from '../validations/media'
import Media from '../models/media'

export const getMedia = async (req: Request, res: Response) => {
  try {
    const media = await Media.findOne()
    res.status(200).json({ success: true, media })
  } catch (error) {
    console.log(error)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const updateMedia = async (req: Request, res: Response) => {
  const { body } = await zParse(updateMediaSchema, req)
  try {
    const media = await Media.findOneAndUpdate({}, body, { new: true })
    res.status(200).json({ success: true, message: 'Đã cập nhật media thành công!', media })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
