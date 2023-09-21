import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Order from '../models/order'
import { zParse } from '../helpers/z-parse'
import { createOrderSchema, getPaginationOrdersSchema, updateOrderSchema } from '../validations/order'

export const getPaginationOrders = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationOrdersSchema, req)
  const pageNumber = query.pageNumber || 5
  const pageSize = query.pageSize || 5
  const status = query.status
  try {
    const query = status
      ? { status: status, user: new mongoose.Types.ObjectId(res.locals.user.id) }
      : { user: new mongoose.Types.ObjectId(res.locals.user.id) }
    const orders = Order.find(query)
      .sort({ date: -1 })
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .exec()
    res.status(200).json({ success: false, message: 'Lấy danh sách hóa đơn thành công.', orders: orders })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const createOrder = async (req: Request, res: Response) => {
  const { body } = await zParse(createOrderSchema, req)
  try {
    const newOrder = new Order({ ...body, user: new mongoose.Types.ObjectId(res.locals.user.id) })
    await newOrder.save()
    res.status(201).json({ success: true, message: 'Tạo hóa đơn thành công.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
export const updateOrder = async (req: Request, res: Response) => {
  const {
    params: { id },
    body
  } = await zParse(updateOrderSchema, req)
  try {
    await Order.findByIdAndUpdate(id, body, { new: true })
    res.status(204).json({ success: true, message: 'Cập nhập hóa đơn thành công.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
