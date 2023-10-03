import { isValidObjectId } from 'mongoose'
import z from 'zod'

export const createCheckoutSessionSchema = z.object({
  body: z.object({
    products: z.object({
      birds: z.array(z.string()),
      nests: z.array(z.string())
    }),
    receiver: z.string(),
    phone: z.string(),
    address: z.string(),
    notice: z.string().optional()
  })
})

export const createDepositSessionSchema = z.object({
  body: z.object({
    maleBird: z.string(),
    femaleBird: z.string()
  })
})

export const createPaymentRestSessionSchema = z.object({
  body: z.object({
    orderNestId: z.string().refine((val) => {
      return isValidObjectId(val)
    }),
    receiver: z.string(),
    phone: z.string(),
    address: z.string(),
    notice: z.string().optional()
  })
})
