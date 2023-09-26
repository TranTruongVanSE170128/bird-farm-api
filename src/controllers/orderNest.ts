import { Request, Response } from 'express'
import mongoose from 'mongoose'
import OrderNest from '../models/orderNest'
import { zParse } from '../helpers/z-parse'
import Bird from '../models/bird'
import Nest from '../models/nest'
import { createOrderNestSchema } from '../validations/orderNest'

export const createOrderNest = async (req: Request, res: Response) => {
  const { body } = await zParse(createOrderNestSchema, req)
  const birdMale = body.birdMale
  const birdFemale = body.birdFemale
  try {
    const breedMale = await Bird.findById(birdMale).exec()
    const breedFemale = await Bird.findById(birdFemale).exec()
    const childPriceFemale = (breedFemale?.breedPrice ?? 0) + (breedMale?.breedPrice ?? 0)
    const childPriceMale = 2 * childPriceFemale

    const newOrderNest = new OrderNest({
      ...body,
      childPriceFemale,
      childPriceMale,
      dad: new mongoose.Types.ObjectId(body.birdMale),
      mom: new mongoose.Types.ObjectId(body.birdFemale),
      customer: new mongoose.Types.ObjectId(res.locals.id)
    })
    await newOrderNest.save()
    res.status(201).json({ success: true, message: 'Tạo đơn hàng thành công.', orderNest: newOrderNest })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}
