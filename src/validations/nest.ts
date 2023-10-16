import mongoose, { isValidObjectId } from 'mongoose'
import { z } from 'zod'

export const getNestByIdSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const getPaginationNestsSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    searchQuery: z.string().trim().optional(),
    specie: z.string().optional(),
    sort: z.enum(['createdAt_-1', 'price_1', 'price_-1']).optional(),
    sold: z.enum(['true', 'false']).optional()
  })
})

export const getNestsByIdsSchema = z.object({
  body: z.object({
    nests: z.array(z.string()).transform((val) => val.filter((nest) => isValidObjectId(nest)))
  })
})

export const createNestSchema = z.object({
  body: z.object({
    specie: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    }),
    name: z.string().trim(),
    price: z.coerce.number(),
    imageUrls: z.array(z.string().trim()).optional(),
    description: z.string().optional(),
    dad: z.string().optional(),
    mom: z.string().optional(),
    sold: z.boolean().optional()
  })
})

export const updateNestSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  }),
  body: z.object({
    specie: z.string().optional(),
    name: z.string().trim().optional(),
    price: z.coerce.number().optional(),
    imageUrls: z.array(z.string().trim()).optional(),
    description: z.string().optional(),
    dad: z.string().optional(),
    mom: z.string().optional(),
    sold: z.boolean().optional()
  })
})

export const deleteNestSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})
