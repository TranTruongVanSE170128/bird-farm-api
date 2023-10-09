import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Order from '../models/order'
import { zParse } from '../helpers/z-parse'
import {
  createOrderSchema,
  getPaginationOrdersSchema,
  updateOrderSchema,
  getOrderDetailSchema,
  approveOrderSchema,
  receiveOrderSchema,
  cancelOrderSchema,
  getPaginationOrdersManageSchema
} from '../validations/order'
import Bird from '../models/bird'
import Nest from '../models/nest'
import { Role } from '../typings/types'
import Voucher from '../models/voucher'

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
      .populate({
        path: 'birds',
        populate: {
          path: 'specie',
          model: 'Specie'
        }
      })
      .populate({
        path: 'nests',
        populate: {
          path: 'specie',
          model: 'Specie'
        }
      })
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .sort({ createdAt: -1 })
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

export const getPaginationOrdersManage = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationOrdersManageSchema, req)
  const pageNumber = query.pageNumber || 1
  const pageSize = query.pageSize || 5
  const status = query.status

  try {
    const query = status ? { status: status } : {}

    const orders = await Order.find(query)
      .populate('user')
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .sort({ createdAt: -1 })
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
  const voucherId = body.voucher
  try {
    let totalMoney = 0
    const birds = await Bird.find({ _id: { $in: birdIds } })
    const nests = await Nest.find({ _id: { $in: nestIds } })

    birds.forEach(async (bird) => {
      totalMoney += bird?.sellPrice || 0
    })

    nests.forEach(async (nest) => {
      totalMoney += nest?.price || 0
    })

    let discount

    if (voucherId) {
      const voucher = await Voucher.findById(voucherId)

      if (!voucher) {
        return res.status(400).json({ success: false, message: 'Không tìm thấy voucher' })
      }
      if (res.locals.user.id in voucher?.users) {
        return res.status(400).json({ succes: false, message: 'Người dùng đã sử dụng voucher này.' })
      }
      if (!voucher.enable) {
        return res.status(400).json({ success: false, message: 'Voucher này đang không được kích hoạt' })
      }
      if (voucher.expiredAt <= new Date()) {
        return res.status(400).json({ success: false, message: 'Voucher này đã hết hạn sử dụng.' })
      }
      if (totalMoney < voucher.conditionPrice) {
        return res.status(400).json({ success: false, message: 'Không đủ điều kiện để sử dụng voucher' })
      }
      discount = Math.min((totalMoney * voucher.discountPercent) / 100, voucher.maxDiscountValue)
      voucher.users.push(new mongoose.Types.ObjectId(res.locals.user.id))
      await voucher.save()
    }

    const newOrder = new Order({
      ...body,
      totalMoney,
      user: new mongoose.Types.ObjectId(res.locals.user.id),
      methodPayment: 'cod',
      discount
    })
    await newOrder.save()

    res.status(201).json({ success: true, message: 'Tạo đơn hàng thành công.', order: newOrder })
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

export const approveOrder = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(approveOrderSchema, req)

  try {
    const order = await Order.findById(id)

    if (!order) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy đơn hàng' })
    }

    if (order.status !== 'processing') {
      res
        .status(400)
        .json({ success: false, message: 'Không thể chấp thuận đơn hàng đang có trạng thái:' + order.status })
    }

    const birdInvalid = await Bird.findOne({ _id: { $in: order.birds }, sold: true })
    const nestInvalid = await Nest.findOne({ _id: { $in: order.nests }, sold: true })

    if (birdInvalid || nestInvalid) {
      return res.status(400).json({
        success: false,
        message: 'Không thể chấp thuận đơn hàng vì có một hoặc nhiều sản phẩm đã được bán'
      })
    }

    order.status = 'delivering'
    await Bird.updateMany({ _id: { $in: order.birds } }, { sold: true })
    await Nest.updateMany({ _id: { $in: order.nests } }, { sold: true })
    await order.save()

    return res.status(200).json({ success: true, message: 'Đơn hàng đã được chấp thuận' })
  } catch (error) {
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

    if (!order.user?.equals(res.locals.user._id)) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền nhận đơn hàng này' })
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

export const cancelOrder = async (req: Request, res: Response) => {
  const {
    params: { id },
    query: { statusMessage }
  } = await zParse(cancelOrderSchema, req)
  try {
    const order = await Order.findById(id)
    if (!order) {
      return res.status(400).json({ success: false, message: 'Order not found.' })
    }

    if (res.locals.user.role === Role.Customer && !order.user?.equals(res.locals.user._id)) {
      return res.status(403).json({ success: false, message: "You don't have permission to cancel this order." })
    }

    if (order.status !== 'processing') {
      return res.status(400).json({ success: false, message: 'Cannot cancel an order with status: ' + order.status })
    }
    const idVoucher = order.voucher
    if (idVoucher) {
      const voucher = await Voucher.findById(idVoucher)
      if (voucher) {
        voucher.users = voucher.users.filter((userId) => userId.toString() !== res.locals.user.id.toString())
        voucher.enable = true
        await voucher.save()
      }
    }
    if (statusMessage) order.statusMessage = statusMessage
    order.status = 'canceled'
    await order.save()
    res.status(200).json({ success: true, message: 'Order canceled successfully.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'System error!' })
  }
}
