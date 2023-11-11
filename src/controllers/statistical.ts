import { Request, Response } from 'express'
import User from '../models/user'
import Order from '../models/order'
import OrderNest from '../models/orderNest'
import Bird from '../models/bird'
import moment from 'moment'

export const getStatistical = async (req: Request, res: Response) => {
  const { days } = req.query

  try {
    const numberCustomer = await User.countDocuments({ role: 'customer' })
    const orders = [...(await Order.find()), ...(await OrderNest.find())]
    const numberSuccessOrder = orders.filter((o) => o.status === 'success').length
    const numberCanceledOrder = orders.filter((o) => o.status === 'canceled').length
    const numberDeliveringOrder = orders.filter((o) => o.status === 'delivering').length
    const numberProcessingOrder = orders.filter((o) => o.status === 'processing').length
    const totalRevenue =
      (await Order.find({ status: 'success' })).reduce(
        (total, order) => total + (order.totalMoney || 0) - (order.discount || 0),
        0
      ) + (await OrderNest.find({ status: 'success' })).reduce((total, order) => total + (order.totalMoney || 0), 0)

    const totalRevenueSpecie1 = await Bird.aggregate([
      {
        $match: { sold: true }
      },
      {
        $lookup: {
          from: 'species', // Tên của collection Specie
          localField: 'specie',
          foreignField: '_id',
          as: 'specie'
        }
      },
      {
        $unwind: '$specie'
      },
      {
        $group: {
          _id: '$specie.name',
          imageUrl: { $first: '$specie.imageUrl' },
          value: { $sum: '$sellPrice' }
        }
      }
    ])

    const totalRevenueSpecie2 = await OrderNest.aggregate([
      {
        $match: { status: 'success' }
      },
      {
        $lookup: {
          from: 'species',
          localField: 'specie',
          foreignField: '_id, imageUrl',
          as: 'specie'
        }
      },
      {
        $unwind: '$specie'
      },
      {
        $group: {
          _id: '$specie.name',
          imageUrl: { $first: '$specie.imageUrl' },
          value: { $sum: '$totalMoney' }
        }
      }
    ])

    const totalRevenueSpecie = totalRevenueSpecie1
      .map((obj1) => {
        const foundObj2 = totalRevenueSpecie2.find((obj2) => obj2._id === obj1._id)

        if (foundObj2) {
          return { ...obj1, value: obj1.value + foundObj2.value }
        } else {
          return obj1
        }
      })
      .concat(totalRevenueSpecie2.filter((obj2) => !totalRevenueSpecie1.some((obj1) => obj1._id === obj2._id)))
      .sort((a, b) => b.value - a.value)

    const startDate = moment().subtract(Number(days), 'days').toDate()

    // Aggregate cho collection Order
    const orderAggregate = await Order.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          value: { $sum: { $subtract: ['$totalMoney', { $ifNull: ['$discount', 0] }] } }
        }
      },
      {
        $sort: { _id: 1 } // Sắp xếp theo ngày tăng dần
      }
    ])

    // Aggregate cho collection OrderNest
    const orderNestAggregate = await OrderNest.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          value: { $sum: '$totalMoney' }
        }
      },
      {
        $sort: { _id: 1 } // Sắp xếp theo ngày tăng dần
      }
    ])

    // Gộp kết quả từ cả hai collections
    const totalRevenueByDay = orderAggregate.concat(orderNestAggregate)

    res.status(200).json({
      success: true,
      message: 'Lấy số liệu thống kê thành công',
      numberCustomer,
      numberSuccessOrder,
      numberCanceledOrder,
      numberDeliveringOrder,
      numberProcessingOrder,
      totalRevenue,
      totalRevenueSpecie,
      totalRevenueByDay
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
