import { isValidObjectId } from 'mongoose'
import { z } from 'zod'

export const getPaginationOrdersSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    status: z.enum(['processing', 'delivering', 'success', 'canceled']).optional()
  })
})
export const getPaginationOrdersAdminSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    status: z.enum(['processing', 'delivering', 'success', 'canceled']).optional()
  })
})

export const createOrderSchema = z.object({
  body: z.object({
    receiver: z.string().trim(),
    phone: z.string().trim(),
    address: z.string().trim(),
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
    status: z.enum(['processing', 'delivering', 'success', 'canceled']).default('processing'),
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
