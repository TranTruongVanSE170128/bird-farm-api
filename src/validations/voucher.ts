import { isValidObjectId } from 'mongoose'
import z from 'zod'

export const createVoucherSchema = z.object({
  body: z.object({
    discountPercent: z.coerce.number(),
    maxDiscountValue: z.coerce.number(),
    conditionPrice: z.coerce.number(),
    quantity: z.coerce.number(),
    expiredAt: z.coerce.date()
  })
})

export const getPaginationVouchersSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional()
  })
})

export const getVoucherDetailSchema = z.object({
  params: z.object({
    id: z.string()
  })
})
export const disableVoucherSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  })
})
export const enableVoucherSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  })
})

export const updateVoucherSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  }),
  body: z.object({
    discountPercent: z.number().optional(),
    user: z
      .array(
        z.string().refine((value) => {
          return isValidObjectId(value)
        })
      )
      .optional(),
    maxDiscountValue: z.number().optional(),
    conditionPrice: z.number().optional(),
    expiredAt: z.date().optional(),
    quantity: z.number().optional()
  })
})
