import { Request, Response } from 'express'
import { zParse } from '../helpers/z-parse'
import { createRatingSchema, getPaginationRatingsSchema } from '../validations/rating'
import Rating from '../models/rating'
import Order from '../models/order'
import OrderNest from '../models/orderNest'

export const createRating = async (req: Request, res: Response) => {
  const { body } = await zParse(createRatingSchema, req)

  try {
    const order = body.order && (await Order.findById(body.order))
    const orderNest = body.orderNest && (await OrderNest.findById(body.orderNest))

    if (!order && !orderNest) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy đơn hàng' })
    }

    if (order && order.user && !order.user.equals(res.locals.user._id)) {
      return res.status(400).json({ success: false, message: 'Bạn không có quyền đnah giá đơn hàng này' })
    }

    if (orderNest && orderNest.user && !orderNest.user.equals(res.locals.user._id)) {
      return res.status(400).json({ success: false, message: 'Bạn không có quyền đnah giá đơn hàng này' })
    }

    const newRating = new Rating({ ...body, user: res.locals.user.id })

    if (order) {
      order.rated = true
      await order.save()
    }

    if (orderNest) {
      orderNest.rated = true
      await orderNest.save()
    }
    await newRating.save()

    res.status(201).json({ success: true, message: 'Đánh giá thành công.', rating: newRating })
  } catch (err) {
    console.log(err)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getPaginationRatings = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationRatingsSchema, req)
  const pageSize = query.pageSize || 5
  const pageNumber = query.pageNumber || 1
  const value = query.value

  const queryMongo = value ? { value } : {}

  try {
    const ratings = await Rating.find(queryMongo)
      .populate('user')
      .populate({
        path: 'order',
        populate: {
          path: 'nests',
          model: 'Nest',
          populate: {
            path: 'specie',
            model: 'Specie'
          }
        }
      })
      .populate({
        path: 'order',
        populate: {
          path: 'birds',
          model: 'Bird',
          populate: {
            path: 'specie',
            model: 'Specie'
          }
        }
      })
      .populate({
        path: 'orderNest',
        populate: {
          path: 'dad',
          model: 'Bird'
        }
      })
      .populate({
        path: 'orderNest',
        populate: {
          path: 'mom',
          model: 'Bird'
        }
      })
      .populate({
        path: 'orderNest',
        populate: {
          path: 'specie',
          model: 'Specie'
        }
      })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .exec()

    const totalRatings = await Rating.countDocuments(queryMongo)

    res.status(200).json({
      success: true,
      message: 'Lấy danh đánh giá thành công!',
      currentPage: pageNumber,
      totalPages: Math.ceil(totalRatings / pageSize),
      ratings
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getAverageRatings = async (req: Request, res: Response) => {
  try {
    const result = await Rating.aggregate([
      {
        $group: {
          _id: null,
          averageValue: { $avg: '$value' }
        }
      }
    ])

    const average = result?.[0]?.averageValue

    res.status(200).json({ success: true, average })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
