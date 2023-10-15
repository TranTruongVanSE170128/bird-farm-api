import { Request, Response } from 'express'
import mongoose from 'mongoose'
import OrderNest from '../models/orderNest'
import { zParse } from '../helpers/z-parse'
import Bird from '../models/bird'
import Voucher from '../models/voucher'
import {
  addStageSchema,
  approveOrderNestSchema,
  cancelOrderNestSchema,
  // createOrderNestSchema,
  getOrderNestDetailSchema,
  getPaginationOrderNestsManageSchema,
  getPaginationOrderNestsSchema,
  paymentTheRestSchema,
  receiveOrderNestSchema,
  requestCustomerToPaymentSchema,
  updateBirdAmountSchema
} from '../validations/orderNest'
import { Role } from '../typings/types'
import order from '../models/order'

export const getPaginationOrderNests = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationOrderNestsSchema, req)
  const pageNumber = query.pageNumber || 1
  const pageSize = query.pageSize || 5
  const status = query.status

  try {
    const query: any = { user: new mongoose.Types.ObjectId(res.locals.user.id) }

    if (status) {
      query.status = status
    }

    const orders = await OrderNest.find(query)
      .populate('user dad mom specie')
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .sort({ createdAt: -1 })
      .exec()

    const totalOrders = await OrderNest.countDocuments(query)

    res.status(200).json({
      success: false,
      message: 'Lấy danh sách đơn tổ chim thành công.',
      currentPage: pageNumber,
      totalPages: Math.ceil(totalOrders / pageSize),
      orderNests: orders
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getPaginationOrderNestsManage = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationOrderNestsManageSchema, req)
  const pageNumber = query.pageNumber || 1
  const pageSize = query.pageSize || 5
  const status = query.status

  try {
    const query = status ? { status: status } : {}

    const orderNests = await OrderNest.find(query)
      .populate('user dad mom')
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .sort({ createdAt: -1 })
      .exec()

    const totalOrderNests = await OrderNest.countDocuments(query)

    res.status(200).json({
      success: false,
      message: 'Lấy danh sách đơn đặt tổ chim non thành công.',
      currentPage: pageNumber,
      totalPage: Math.ceil(totalOrderNests / pageSize),
      orderNests: orderNests
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getOrderNestDetail = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(getOrderNestDetailSchema, req)

  try {
    const orderNest = await OrderNest.findById(id).populate('user dad mom specie')

    if (!orderNest) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' })
    }

    res.status(201).json({ success: true, orderNest })
  } catch (err) {
    console.log(err)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const approveOrderNest = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(approveOrderNestSchema, req)

  try {
    const orderNest = await OrderNest.findById(id)

    if (!orderNest) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy đơn hàng' })
    }

    if (orderNest.status !== 'processing') {
      return res
        .status(400)
        .json({ success: false, message: 'Không thể chấp thuận đơn hàng đang có trạng thái:' + orderNest.status })
    }
    const dad = await Bird.findById(orderNest.dad)
    const mom = await Bird.findById(orderNest.mom)
    if (!dad || !mom) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy chim đực hoặc cái để phối giống.' })
    }
    dad.breeding = true
    mom.breeding = true
    orderNest.status = 'breeding'
    await dad.save()
    await mom.save()
    await orderNest.save()

    return res.status(200).json({ success: true, message: 'Đơn hàng đã được chấp thuận' })
  } catch (error) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export const requestCustomerToPayment = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(requestCustomerToPaymentSchema, req)

  try {
    const orderNest = await OrderNest.findById(id)

    if (!orderNest) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy đơn hàng' })
    }

    if (orderNest.status !== 'breeding') {
      return res.status(400).json({
        success: false,
        message: 'Không thể yêu cầu thanh toán đơn tổ chim đang có trạng thái:' + orderNest.status
      })
    }
    const dad = await Bird.findById(orderNest.dad)
    const mom = await Bird.findById(orderNest.mom)
    if (dad && mom) {
      dad.breeding = false
      mom.breeding = false
      await dad.save()
      await mom.save()
    }

    orderNest.status = 'wait-for-payment'
    orderNest.totalMoney =
      (orderNest.childPriceFemale || 0) * orderNest.numberChildPriceFemale +
      (orderNest.childPriceMale || 0) * orderNest.numberChildPriceMale
    await orderNest.save()

    return res.status(200).json({ success: true, message: 'Yêu cầu khách hàng thanh toán thành công' })
  } catch (error) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export const addStage = async (req: Request, res: Response) => {
  try {
    const {
      params: { id },
      body
    } = await zParse(addStageSchema, req)

    const orderNest = await OrderNest.findById(id)

    if (!orderNest) {
      return res.status(400).json({ success: false, message: 'Không tìm đơn tổ chim' })
    }

    if (orderNest.status !== 'breeding') {
      return res.status(400).json({
        success: false,
        message: 'Không thể thêm giai đoạn cho đơn tổ chim có trạng thái: ' + orderNest.status
      })
    }

    orderNest.stages.push(body)
    await orderNest.save()

    return res.status(200).json({ success: true, message: 'Thêm giao đoạn mới thành công' })
  } catch (error) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export const paymentTheRest = async (req: Request, res: Response) => {
  const {
    params: { id },
    body: { receiver, address, phone, notice }
  } = await zParse(paymentTheRestSchema, req)

  try {
    const orderNest = await OrderNest.findById(id)

    if (!orderNest) {
      return res.status(400).json({ success: false, message: 'Không tìm đơn tổ chim' })
    }

    if (!orderNest.user?.equals(res.locals.user._id)) {
      return res.status(400).json({ success: false, message: 'Bạn không có quyền thanh toán đơn hàng này' })
    }

    if (orderNest.status !== 'wait-for-payment') {
      return res.status(400).json({
        success: false,
        message: 'Không thể thanh toán cho đơn tổ chim có trạng thái: ' + orderNest.status
      })
    }

    orderNest.receiver = receiver
    orderNest.phone = phone
    orderNest.address = address
    orderNest.status = 'delivering'
    orderNest.methodPayment = 'cod'
    if (notice) {
      orderNest.notice = notice
    }

    await orderNest.save()

    res.status(201).json({ success: true, message: 'Thanh toán thành công.', orderNest })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const receiveOrderNest = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(receiveOrderNestSchema, req)
  try {
    const orderNest = await OrderNest.findById(id)
    if (!orderNest) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy đơn hàng.' })
    }

    if (!orderNest.user?.equals(res.locals.user._id)) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền nhận đơn hàng này' })
    }

    if (orderNest.status !== 'delivering') {
      return res
        .status(400)
        .json({ success: false, message: 'Không thể nhận thành công đơn hàng có trạng thái: ' + orderNest.status })
    }
    orderNest.status = 'success'
    await orderNest.save()
    res.status(200).json({ success: true, message: 'Đã xác nhận nhận hàng thành công.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
export const updateBirdAmount = async (req: Request, res: Response) => {
  const {
    params: { id },
    body: { numberChildPriceFemale, numberChildPriceMale }
  } = await zParse(updateBirdAmountSchema, req)

  try {
    const orderNest = await OrderNest.findById(id)

    if (!orderNest) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy tổ phối giống.' })
    }

    if (orderNest.status !== 'breeding') {
      return res.status(400).json({
        success: false,
        message: 'Không thể cập nhật số lượng chim của đơn tổ chim non có trạng thái: ' + orderNest.status
      })
    }

    if (numberChildPriceFemale) orderNest.numberChildPriceFemale = numberChildPriceFemale

    if (numberChildPriceMale) orderNest.numberChildPriceMale = numberChildPriceMale

    await orderNest.save()

    res.status(200).json({ success: true, message: 'Cập nhập số lượng chim thành công.', orderNest: orderNest })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống.' })
  }
}

export const cancelOrderNest = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(cancelOrderNestSchema, req)
  try {
    const orderNest = await OrderNest.findById(id)
    if (!orderNest) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy hóa đơn đặt tổ.' })
    }
    if (res.locals.user.role === Role.Customer && !orderNest.user?.equals(res.locals.user._id)) {
      return res.status(400).json({ success: false, message: 'Khách hàng không có quyền hủy đơn hàng này.' })
    }
    if (res.locals.Role === Role.Customer && !['wait-for-payment', 'processing'].includes(orderNest.status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Khách hàng không có quyền hủy đơn hàng có trạng thái:' + orderNest.status })
    }
    if (!['processing', 'breeding', 'delivering', 'wait-for-payment'].includes(orderNest.status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Không thể hủy đơn hàng có trạng thái:' + orderNest.status })
    }

    orderNest.status = 'canceled'
    const voucherID = orderNest?.voucher
    if (voucherID) {
      const voucher = await Voucher.findById(voucherID)
      if (voucher) {
        voucher.users = voucher.users.filter((userId) => userId.toString() !== res.locals.user.id.toString())
        voucher.quantity += 1
        await voucher.save()
      }
    }

    const dad = await Bird.findById(orderNest.dad)
    const mom = await Bird.findById(orderNest.mom)
    if (dad && mom) {
      dad.breeding = false
      mom.breeding = false
      await dad.save()
      await mom.save()
    }
    await orderNest.save()
    res.status(200).json({ success: true, message: 'Đã hủy đơn hàng thành công.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống.' })
  }
}
