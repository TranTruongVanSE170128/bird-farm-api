import mongoose, { isValidObjectId } from 'mongoose'
import { z } from 'zod'

export const createOrderNestSchema = z.object({
  body: z.object({
    birdMale: z.string().refine((value) => isValidObjectId(value)),
    birdFemale: z.string().refine((value) => isValidObjectId(value)),
    deposit: z.coerce.number().optional(),
    methodPayment: z.enum(['cod', 'online'])
  })
})
