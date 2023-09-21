import mongoose, { isValidObjectId } from 'mongoose'
import { z } from 'zod'

export const getPaginationBirdsSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    searchQuery: z.string().trim().optional(),
    specie: z.coerce.string().optional()
  })
})

export const getPaginationBirdsAdminSchema = getPaginationBirdsSchema

export const getBirdDetailSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const createBirdSchema = z.object({
  body: z.object({
    specie: z.string().trim(),
    name: z.string().trim(),
    price: z.coerce.number(),
    gender: z.enum(['male', 'female']),
    birth: z.coerce.date().optional(),
    description: z.string().trim().optional(),
    type: z.enum(['male', 'female']),
    imageUrls: z.array(z.string().trim()).optional(),
    parent: z
      .object({
        dad: z.string().trim().optional(),
        mom: z.string().trim().optional()
      })
      .optional(),
    achievements: z
      .array(
        z.object({
          competition: z.string().trim(),
          rank: z.coerce.number()
        })
      )
      .optional(),
    discount: z
      .object({
        discountPercent: z.coerce.number(),
        startDate: z.date(),
        endDate: z.date()
      })
      .optional()
  })
})

export const updateBirdSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  }),
  body: z.object({
    specie: z.string().trim().optional(),
    name: z.string().trim().optional(),
    price: z.coerce.number().optional(),
    gender: z.enum(['male', 'female']).optional(),
    birth: z.coerce.date().optional(),
    description: z.string().trim().optional(),
    type: z.enum(['sell', 'breed']).optional(),
    imageUrls: z.array(z.string().trim()).optional(),
    parent: z
      .object({
        dad: z.string().trim().optional(),
        mom: z.string().trim().optional()
      })
      .optional(),
    achievements: z
      .array(
        z.object({
          competition: z.string().trim(),
          rank: z.coerce.number()
        })
      )
      .optional(),
    discount: z
      .object({
        discountPercent: z.coerce.number(),
        startDate: z.date(),
        endDate: z.date()
      })
      .optional()
  })
})

export const getBirdsByIdsSchema = z.object({
  body: z.object({
    birds: z.array(z.string()).transform((val) => val.filter((bird) => isValidObjectId(bird)))
  })
})

export const getBirdsBreedSchema = z.object({
  query: z.object({
    specie: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})
