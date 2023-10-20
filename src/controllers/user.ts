import { Request, Response } from 'express'
import User from '../models/user'
import { zParse } from '../helpers/z-parse'
import {
  addDeliveryInfoSchema,
  changeRoleSchema,
  deleteDeliveryInfoSchema,
  makeDefaultDeliveryInfoSchema,
  updateUserSchema
} from '../validations/user'

export const whoAmI = async (req: Request, res: Response) => {
  const id = res.locals.user._id

  const user = await User.findById(id)
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng', success: false })
  }

  return res.status(200).json({ success: true, message: 'Lấy người dùng thành công!', user })
}

export const makeDefaultDeliveryInfo = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(makeDefaultDeliveryInfoSchema, req)

  try {
    const user = await User.findById(res.locals.user.id)

    if (!user) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng' })
    }

    user.deliveryInfos = user.deliveryInfos.map((item) => {
      item.default = item._id?.toString() === id
      return item
    })

    await user.save()

    res.status(200).json({ success: true, message: 'Đặt địa chỉ mặc định thành công.', user })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}
export const deleteDeliveryInfo = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(deleteDeliveryInfoSchema, req)

  try {
    const user = await User.findById(res.locals.user.id)

    if (!user) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng' })
    }

    if (user.deliveryInfos.length < 2) {
      return res.status(400).json({ success: false, message: 'Không thể xóa địa chỉ mặc định' })
    }

    user.deliveryInfos = user.deliveryInfos.filter((item) => item._id?.toString() !== id)

    await user.save()

    res.status(200).json({ success: true, message: 'Xóa địa chỉ thành công.', user })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export const addDeliveryInfo = async (req: Request, res: Response) => {
  const { body } = await zParse(addDeliveryInfoSchema, req)

  try {
    const user = await User.findById(res.locals.user.id)

    if (!user) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng' })
    }

    user.deliveryInfos.push({ ...body, default: user.deliveryInfos.length === 0 })
    await user.save()

    res.status(200).json({ success: true, message: 'Thêm địa chỉ thành công.', user })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const {
    params: { id },
    body
  } = await zParse(updateUserSchema, req)

  try {
    if (id !== res.locals.user.id) {
      return res.status(400).json({ success: false, message: 'Bạn không có quyền cập nhật hồ sơ người khác.' })
    }
    const user = await User.findByIdAndUpdate(id, body, { new: true })
    res.status(200).json({ success: true, message: 'Hồ sơ đã được cập nhật thành công.', user })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export const changeRole = async (req: Request, res: Response) => {
  const {
    params: { id },
    body: { role }
  } = await zParse(changeRoleSchema, req)
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy user.' })
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Không được đổi quyền admin.' })
    }
    user.role = role
    user.save()
    res.status(200).json({ success: true, message: 'Phân quyền thành công.' })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}
