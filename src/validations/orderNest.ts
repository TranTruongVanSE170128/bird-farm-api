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

export const requestCustomerToPaymentSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  })
})

export const addStageSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  }),
  body: z.object({
    name: z.string(),
    imageUrl: z.string(),
    description: z.string()
  })
})

export const getPaginationOrderNestsSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    status: z.enum(['processing', 'breeding', 'delivering', 'success', 'canceled']).optional()
  })
})
export const receiveOrderNestSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => isValidObjectId(value))
  })
})
export const paymentTheRestSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  }),
  body: z.object({
    receiver: z.string().trim(),
    phone: z.string().trim(),
    address: z.string().trim(),
    notice: z.string().trim().optional()
  })
})
export const updateBirdAmountSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  }),
  body: z.object({
    numberChildPriceFemale: z.number().optional(),
    numberChildPriceMale: z.number().optional()
  })
})
export const cancelOrderNestSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return isValidObjectId(val)
    })
  })
})
