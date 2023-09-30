import { Request, Response } from 'express'
import mongoose from 'mongoose'
import OrderNest from '../models/orderNest'
import { zParse } from '../helpers/z-parse'
import Bird from '../models/bird'
import {
  addStageSchema,
  approveOrderNestSchema,
  // createOrderNestSchema,
  getOrderNestDetailSchema,
  getPaginationOrderNestsManageSchema,
  getPaginationOrderNestsSchema
} from '../validations/orderNest'

// export const createOrderNest = async (req: Request, res: Response) => {
//   const {
//     body: { birdMale, birdFemale }
//   } = await zParse(createOrderNestSchema, req)

//   try {
//     const breedMale = await Bird.findById(birdMale).exec()
//     const breedFemale = await Bird.findById(birdFemale).exec()
//     if (!breedFemale || !breedMale) {
//       return res.status(400).json({ success: false, message: 'Không tìm thấy chim.' })
//     }
//     if (breedMale?.type !== 'breed' || breedFemale?.type !== 'breed') {
//       return res.status(400).json({ success: false, message: 'Chim không phù hợp để phối giống.' })
//     }
//     const childPriceFemale = (breedFemale?.breedPrice || 0) + (breedMale?.breedPrice || 0)
//     const childPriceMale = 2 * childPriceFemale

//     const newOrderNest = new OrderNest({
//       childPriceFemale,
//       childPriceMale,
//       specie: breedMale.specie,
//       dad: new mongoose.Types.ObjectId(birdMale),
//       mom: new mongoose.Types.ObjectId(birdFemale),
//       customer: new mongoose.Types.ObjectId(res.locals.id)
//     })

//     await newOrderNest.save()
//     res.status(201).json({ success: true, message: 'Tạo đơn hàng thành công.', orderNest: newOrderNest })
//   } catch (err) {
//     res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
//   }
// }

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
      totalPage: Math.ceil(totalOrders / pageSize),
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
      res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' })
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
      res
        .status(400)
        .json({ success: false, message: 'Không thể chấp thuận đơn hàng đang có trạng thái:' + orderNest.status })
    }

    orderNest.status = 'breeding'

    await orderNest.save()

    return res.status(200).json({ success: true, message: 'Đơn hàng đã được chấp thuận' })
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
      return res
        .status(400)
        .json({
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
