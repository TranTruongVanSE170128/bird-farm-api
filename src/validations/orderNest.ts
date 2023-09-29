import mongoose, { isValidObjectId } from 'mongoose'
import { isValid, z } from 'zod'

export const createOrderNestSchema = z.object({
  body: z.object({
    birdMale: z.string().refine((value) => isValidObjectId(value)),
    birdFemale: z.string().refine((value) => isValidObjectId(value)),
    deposit: z.coerce.number().optional(),
    methodPayment: z.enum(['cod', 'online']),
    voucher: z
      .string()
      .refine((value) => isValidObjectId(value))
      .optional(),
    receiver: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional()
  })
})

export const getPaginationOrderNestsManageSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    status: z.enum(['processing', 'breeding', 'delivering', 'success', 'canceled']).optional()
  })
})

export const getOrderNestDetailSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const approveOrderNestSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  })
})
