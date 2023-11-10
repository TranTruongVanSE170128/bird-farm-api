import { Request, Response } from 'express'
import mongoose, { isValidObjectId } from 'mongoose'
import Stripe from 'stripe'
import Bird from '../models/bird'
import Nest from '../models/nest'
import { zParse } from '../helpers/z-parse'
import {
  createCheckoutSessionSchema,
  createDepositSessionSchema,
  createPaymentRestSessionSchema
} from '../validations/checkout'
import Order from '../models/order'
import OrderNest from '../models/orderNest'
import * as dotenv from 'dotenv'
import Voucher from '../models/voucher'
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {} as Stripe.StripeConfig)

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { body } = await zParse(createCheckoutSessionSchema, req)

  const {
    body: { products, receiver, address, phone, notice, voucher: voucherId }
  } = await zParse(createCheckoutSessionSchema, req)

  try {
    const { birds: birdIds } = products
    const validBirdIds = birdIds.filter((id: string) => isValidObjectId(id))
    const birds = await Bird.find({ _id: { $in: validBirdIds } })

    const { nests: nestIds } = products
    const validNestIds = nestIds.filter((id: string) => isValidObjectId(id))
    const nests = await Nest.find({ _id: { $in: validNestIds } })

    if (birds.length === 0 && nests.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng rỗng' })
    }

    let totalMoney = 0

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
      if (voucher?.users.includes(res.locals.user.id)) {
        return res.status(400).json({ success: false, message: 'Bạn đã sử dụng voucher này.' })
      }
      if (!voucher.enable) {
        return res.status(400).json({ success: false, message: 'Voucher này đang không được kích hoạt' })
      }
      if (voucher.quantity === 0) {
        return res.status(400).json({ success: false, message: 'Voucher này đã hết số lượng.' })
      }
      if (voucher.expiredAt <= new Date()) {
        return res.status(400).json({ success: false, message: 'Voucher này đã hết số lượng' })
      }
      if (totalMoney < voucher.conditionPrice) {
        return res.status(400).json({ success: false, message: 'Không đủ điều kiện để sử dụng voucher' })
      }
      discount = Math.min((totalMoney * voucher.discountPercent) / 100, voucher.maxDiscountValue)
    }

    const coupon =
      discount &&
      (await stripe.coupons.create({
        name: 'Voucher Bird Farm Shop',
        amount_off: discount,
        currency: 'VND',
        duration: 'once'
      }))

    const lineBirdItems = birds.map((bird) => {
      return {
        price_data: {
          currency: 'VND',
          product_data: {
            name: bird.name
          },
          unit_amount: bird.sellPrice
        },
        quantity: 1
      }
    })

    const lineNestItems = nests.map((nest) => {
      return {
        price_data: {
          currency: 'VND',
          product_data: {
            name: nest.name
          },
          unit_amount: nest.price
        },
        quantity: 1
      }
    })

    const customer = await stripe.customers.create({
      metadata: {
        userId: res.locals.user.id,
        data: JSON.stringify({
          birds: birdIds,
          nests: nestIds,
          receiver,
          address,
          phone,
          notice,
          voucher: voucherId,
          type: 'order'
        })
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [...lineBirdItems, ...lineNestItems],
      customer: customer.id,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/deposit-success?type=payment`,
      cancel_url: `${process.env.BASE_URL}/deposit-cancel?type=payment`,
      discounts: coupon ? [{ coupon: coupon.id }] : []
    })

    res.status(200).json({ id: session.id })
  } catch (error) {
    console.log(error)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống' })
  }
}

export const createDepositSession = async (req: Request, res: Response) => {
  const {
    body: { maleBird: maleBirdId, femaleBird: femaleBirdId }
  } = await zParse(createDepositSessionSchema, req)

  try {
    const maleBird = await Bird.findById(maleBirdId)
    const femaleBird = await Bird.findById(femaleBirdId)

    const customer = await stripe.customers.create({
      metadata: {
        userId: res.locals.user.id,
        data: JSON.stringify({
          femaleBird: femaleBirdId,
          maleBird: maleBirdId,
          type: 'orderNest'
        })
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'VND',
            product_data: {
              name: 'Đặt cọc đơn tổ chim non'
            },
            unit_amount: ((maleBird?.breedPrice || 0) + (femaleBird?.breedPrice || 0)) * 2
          },
          quantity: 1
        }
      ],
      customer: customer.id,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/deposit-success?type=deposit`,
      cancel_url: `${process.env.BASE_URL}/deposit-cancel?type=deposit`
    })

    res.status(200).json({ id: session.id })
  } catch (error) {
    console.log(error)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống' })
  }
}

export const createPaymentRestSession = async (req: Request, res: Response) => {
  const {
    body: { orderNestId, receiver, address, phone, notice }
  } = await zParse(createPaymentRestSessionSchema, req)

  try {
    const orderNest = await OrderNest.findById(orderNestId)

    if (!orderNest) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy đơn tổ chim' })
    }

    if (orderNest.status !== 'wait-for-payment') {
      return res
        .status(400)
        .json({ success: false, message: 'Không tìm thanh toán đơn có trạng thái: ' + orderNest.status })
    }

    const customer = await stripe.customers.create({
      metadata: {
        userId: res.locals.user.id,
        data: JSON.stringify({
          orderNestId,
          type: 'request-payment',
          receiver,
          address,
          phone,
          notice
        })
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'VND',
            product_data: {
              name: 'Đơn đặt tổ chim non',
              description: 'Thanh toán khoản tiền còn lại sau đặt cọc'
            },
            unit_amount: orderNest.totalMoney! - orderNest.childPriceMale!
          },
          quantity: 1
        }
      ],
      customer: customer.id,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/deposit-success?type=payment`,
      cancel_url: `${process.env.BASE_URL}/deposit-cancel?type=payment`
    })

    res.status(200).json({ id: session.id })
  } catch (error) {
    console.log(error)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống' })
  }
}

export const stripeWebhook = (req: Request, res: Response) => {
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
  const sig = req.headers['stripe-signature']

  let data: any
  let eventType

  if (endpointSecret) {
    let event

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret)
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    data = event.data.object
    eventType = event.type
  } else {
    data = req.body.data.object
    eventType = req.body.type
  }

  // Handle the event
  if (eventType === 'checkout.session.completed') {
    stripe.customers
      .retrieve(data.customer)
      .then(async (customer: any) => {
        const data = JSON.parse(customer.metadata.data)
        const type = data.type

        if (type === 'order') {
          const birdIds = data.birds
          const nestIds = data.nests
          const voucherId = data.voucher

          let totalMoney = 0
          const birds = await Bird.find({ _id: { $in: birdIds } })
          const nests = await Nest.find({ _id: { $in: nestIds } })

          if (birds.length === 0 && nests.length === 0) {
            throw new Error('Giỏ hàng rỗng')
          }

          birds.forEach((bird) => {
            totalMoney += bird?.sellPrice || 0
          })

          nests.forEach((nest) => {
            totalMoney += nest?.price || 0
          })

          let discount
          if (voucherId) {
            const voucher = await Voucher.findById(voucherId)
            if (!voucher) {
              throw new Error('Không tìm thấy voucher')
            }
            if (voucher?.users.includes(customer.metadata.userId)) {
              throw new Error('Bạn đã sử dụng voucher này.')
            }
            if (!voucher.enable) {
              throw new Error('Voucher này đang không được kích hoạt')
            }
            if (voucher.quantity === 0) {
              throw new Error('Voucher này đã hết số lượng.')
            }
            if (voucher.expiredAt <= new Date()) {
              throw new Error('Voucher này đã hết số lượng')
            }
            if (totalMoney < voucher.conditionPrice) {
              throw new Error('Không đủ điều kiện để sử dụng voucher')
            }
            discount = Math.min((totalMoney * voucher.discountPercent) / 100, voucher.maxDiscountValue)
            voucher.users.push(new mongoose.Types.ObjectId(customer.metadata.userId))
            voucher.quantity -= 1
            await voucher.save()
          }

          const newOrder = new Order({
            ...data,
            totalMoney,
            discount,
            user: new mongoose.Types.ObjectId(customer.metadata.userId),
            methodPayment: 'online'
          })
          await newOrder.save()
        } else if (type === 'orderNest') {
          const femaleBirdId = data.femaleBird
          const maleBirdId = data.maleBird

          const maleBird = await Bird.findById(maleBirdId)
          const femaleBird = await Bird.findById(femaleBirdId)

          if (!maleBird || !femaleBird) {
            throw new Error('Không tìm thấy chim bố hoặc chim mẹ')
          }

          if (maleBird.type !== 'breed' || femaleBird.type !== 'breed') {
            throw new Error('Chim bố hoặc chim mẹ không phải là chim phối giống')
          }

          const orderNest = new OrderNest({
            user: new mongoose.Types.ObjectId(customer.metadata.userId),
            dad: maleBirdId,
            mom: femaleBirdId,
            specie: maleBird.specie,
            childPriceMale: ((maleBird?.breedPrice || 0) + (femaleBird?.breedPrice || 0)) * 2,
            childPriceFemale: (maleBird?.breedPrice || 0) + (femaleBird?.breedPrice || 0)
          })

          await orderNest.save()
        } else if (type === 'request-payment') {
          const { receiver, phone, address, notice, orderNestId } = data
          const orderNest = await OrderNest.findById(orderNestId)

          if (!orderNest) {
            throw new Error('Không tìm đơn tổ chim')
          }

          if (!orderNest.user?.equals(new mongoose.Types.ObjectId(customer.metadata.userId))) {
            throw new Error('Bạn không có quyền thanh toán đơn hàng này')
          }

          if (orderNest.status !== 'wait-for-payment') {
            throw new Error('Không thể thanh toán cho đơn tổ chim có trạng thái: ' + orderNest.status)
          }

          orderNest.receiver = receiver
          orderNest.phone = phone
          orderNest.address = address
          orderNest.status = 'delivering'
          orderNest.methodPayment = 'online'
          if (notice) {
            orderNest.notice = notice
          }

          await orderNest.save()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  res.send()
}
