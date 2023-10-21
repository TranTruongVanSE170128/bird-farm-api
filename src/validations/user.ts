import mongoose from 'mongoose'
import z from 'zod'

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().trim() }),
  body: z.object({
    name: z.coerce.string().trim().optional(),
    imageUrl: z.coerce.string().trim().url().optional(),
    deliveryInfos: z.coerce.string().trim().optional()
  })
})

export const addDeliveryInfoSchema = z.object({
  body: z.object({
    receiver: z.coerce.string().trim(),
    phone: z.coerce.string().trim(),
    address: z.coerce.string().trim()
  })
})

export const deleteDeliveryInfoSchema = z.object({
  params: z.object({ id: z.string().trim() })
})

export const makeDefaultDeliveryInfoSchema = z.object({
  params: z.object({ id: z.string().trim() })
})

export const getPaginationUsersSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional()
  })
})
export const changeRoleSchema = z.object({
  params: z.object({
    id: z.coerce.string().refine((value) => mongoose.Types.ObjectId.isValid(value))
  }),
  body: z.object({
    role: z.enum(['customer', 'staff', 'admin', 'manager'])
  })
})
