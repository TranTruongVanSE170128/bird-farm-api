import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Order from '../models/order'
import { zParse } from '../helpers/z-parse'
import {
  createOrderSchema,
  getPaginationOrdersSchema,
  updateOrderSchema,
  getPaginationOrdersAdminSchema,
  getOrderDetailSchema,
  receiveOrderSchema
} from '../validations/order'
import Bird from '../models/bird'
import Nest from '../models/nest'
import nest from '../models/nest'

export const getPaginationOrders = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationOrdersSchema, req)
  const pageNumber = query.pageNumber || 1
  const pageSize = query.pageSize || 5
  const status = query.status

  try {
    const query: any = { user: new mongoose.Types.ObjectId(res.locals.user.id) }

    if (status) {
      query.status = status
    }

    const orders = await Order.find(query)
      .sort({ date: -1 })
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .exec()

    const totalOrders = await Order.countDocuments(query)

    res.status(200).json({
      success: false,
      message: 'Lấy danh sách đơn hàng thành công.',
      currentPage: pageNumber,
      totalPage: Math.ceil(totalOrders / pageSize),
      orders: orders
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getPaginationOrdersAdmin = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationOrdersAdminSchema, req)
  const pageNumber = query.pageNumber || 1
  const pageSize = query.pageSize || 5
  const status = query.status

  try {
    const query = status ? { status: status } : {}

    const orders = await Order.find(query)
      .populate('user')
      .sort({ date: -1 })
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .exec()

    const totalOrders = await Order.countDocuments(query)

    res.status(200).json({
      success: false,
      message: 'Lấy danh sách đơn hàng thành công.',
      currentPage: pageNumber,
      totalPage: Math.ceil(totalOrders / pageSize),
      orders: orders
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getOrderDetail = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(getOrderDetailSchema, req)

  try {
    const order = await Order.findById(id).populate('user birds nests')

    if (!order) {
      res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' })
    }

    res.status(201).json({ success: true, order })
  } catch (err) {
    console.log(err)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const createOrder = async (req: Request, res: Response) => {
  const { body } = await zParse(createOrderSchema, req)

  const birdIds = body.birds
  const nestIds = body.nests

  try {
    let totalMoney = 0
    const birds = await Bird.find({ _id: { $in: birdIds } })
    const nests = await Nest.find({ _id: { $in: nestIds } })

    birds.forEach(async (bird) => {
      bird.sold = true
      totalMoney += bird?.sellPrice || 0
      await bird.save()
    })

    nests.forEach(async (nest) => {
      nest.sold = true
      totalMoney += nest?.price || 0
      await nest.save()
    })

    const newOrder = new Order({
      ...body,
      totalMoney,
      user: new mongoose.Types.ObjectId(res.locals.user.id),
      methodPayment: 'cod' //this function always create order COD, the order with online payment will be created after stripe webhook verification
    })
    await newOrder.save()
    res.status(201).json({ success: true, message: 'Tạo đơn hàng thành công.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const updateOrder = async (req: Request, res: Response) => {
  const {
    params: { id },
    body
  } = await zParse(updateOrderSchema, req)

  const birdIds = body.birds
  const nestIds = body.nests

  try {
    let totalMoney = 0
    const birds = await Bird.find({ _id: { $in: birdIds } })
    const nests = await Nest.find({ _id: { $in: nestIds } })

    birds.forEach((bird) => {
      totalMoney += bird?.sellPrice || 0
    })

    nests.forEach((nest) => {
      totalMoney += nest?.price || 0
    })

    const order = await Order.findByIdAndUpdate(id, { ...body, totalMoney }, { new: true })
    res.status(200).json({ success: true, message: 'Đơn hàng được cập nhật thành công.', order })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}
export const receiveOrder = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(receiveOrderSchema, req)
  try {
    const order = await Order.findById(id)
    if (!order) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy đơn hàng.' })
    }
    if (order.status !== 'delivering') {
      return res
        .status(400)
        .json({ success: false, message: 'Không thể nhận thành công đơn hàng có trạng thái: ' + order.status })
    }
    order.status = 'success'
    await order.save()
    res.status(200).json({ success: true, message: 'Đã xác nhận nhận hàng thành công.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
