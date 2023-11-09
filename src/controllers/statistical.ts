import { Request, Response } from 'express'
import User from '../models/user'
import Order from '../models/order'
import OrderNest from '../models/orderNest'

export const getStatistical = async (req: Request, res: Response) => {
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

    res.status(200).json({
      success: true,
      message: 'Lấy số liệu thống kê thành công',
      numberCustomer,
      numberSuccessOrder,
      numberCanceledOrder,
      numberDeliveringOrder,
      numberProcessingOrder,
      totalRevenue
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
