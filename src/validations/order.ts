import mongoose, { isValidObjectId } from 'mongoose'
import { z } from 'zod'

export const getPaginationOrdersSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    status: z.enum(['processing', 'delivering', 'success', 'canceled']).optional()
  })
})

export const getPaginationOrdersManageSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    status: z.enum(['processing', 'delivering', 'success', 'canceled']).optional()
  })
})

export const getOrderDetailSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const createOrderSchema = z.object({
  body: z.object({
    receiver: z.string().trim(),
    phone: z.string().trim(),
    address: z.string().trim(),
    notice: z.string().trim().optional(),
    birds: z
      .array(
        z.string().refine((val) => {
          return isValidObjectId(val)
        })
      )
      .default([]),
    nests: z
      .array(
        z.string().refine((val) => {
          return isValidObjectId(val)
        })
      )
      .default([]),
    voucher: z
      .string()
      .refine((val) => {
        return isValidObjectId(val)
      })
      .optional()
  })
})

export const updateOrderSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  }),
  body: z.object({
    receiver: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    birds: z
      .array(
        z.string().refine((val) => {
          return isValidObjectId(val)
        })
      )
      .optional(),
    nests: z
      .array(
        z.string().refine((val) => {
          return isValidObjectId(val)
        })
      )
      .optional(),
    status: z.enum(['processing', 'delivering', 'success', 'canceled']).optional(),
    voucher: z
      .string()
      .refine((val) => {
        return isValidObjectId(val)
      })
      .optional()
  })
})

export const approveOrderSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  })
})
export const receiveOrderSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => isValidObjectId(value))
  })
})
export const cancelOrderSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => isValidObjectId(value))
  }),
  query: z.object({
    statusMessage: z.string().optional()
  })
})
