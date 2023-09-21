import mongoose, { isValidObjectId } from 'mongoose'
import { z } from 'zod'

export const getPaginationOrdersSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    status: z
      .string()
      .trim()
      .refine((val) => {
        return val in ['processing', 'delivering', 'success', 'canceled']
      })
      .optional()
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
      .optional(),
    status: z
      .string()
      .refine((val) => {
        return val in ['processing', 'delivering', 'success', 'canceled']
      })
      .optional(),
    totalMoney: z.coerce.number().optional()
  })
})

export const updateOrderSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  }),
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
      .optional(),
    status: z
      .string()
      .refine((val) => {
        return val in ['processing', 'delivering', 'success', 'canceled']
      })
      .optional(),
    totalMoney: z.coerce.number().optional()
  })
})
