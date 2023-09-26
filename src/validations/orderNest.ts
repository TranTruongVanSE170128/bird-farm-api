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
