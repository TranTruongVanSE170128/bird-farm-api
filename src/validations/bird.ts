import mongoose, { isValidObjectId } from 'mongoose'
import { z } from 'zod'

export const getPaginationBirdsSchema = z.object({
  query: z
    .object({
      pageSize: z.coerce.number().optional(),
      pageNumber: z.coerce.number().optional(),
      searchQuery: z.string().trim().optional(),
      specie: z.coerce.string().optional(),
      type: z.enum(['sell', 'breed']).optional(),
      gender: z.enum(['male', 'female']).optional(),
      sort: z.enum(['createdAt_-1', 'price_1', 'price_-1']).optional(),
      status: z.enum(['selling', 'breading', 'sold', 'free']).optional()
    })
    .refine((data) => {
      if (!data.type) {
        if (data.status === 'selling' || data.status === 'sold') {
          data.type = 'sell'
        }
        if (data.status === 'breading' || data.status === 'free') {
          data.type = 'breed'
        }
        return true
      }
      if (data.type === 'sell') {
        return data.status === 'selling' || data.status === 'sold' || data.status === undefined
      }
      if (data.type === 'breed') {
        return data.status === 'breading' || data.status === 'free' || data.status === undefined
      }
    })
})

// export const getPaginationBirdsAdminSchema = getPaginationBirdsSchema

export const getBirdDetailSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})

export const createBirdSchema = z.object({
  body: z
    .object({
      specie: z.string().trim(),
      name: z.string().trim(),
      sellPrice: z.coerce.number().optional(),
      breedPrice: z.coerce.number().optional(),
      gender: z.enum(['male', 'female']),
      birth: z.coerce.date().optional(),
      description: z.string().trim().optional(),
      type: z.enum(['sell', 'breed']),
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
    .refine((data) => {
      return (data.type === 'sell' && data.sellPrice) || (data.type === 'breed' && data.breedPrice)
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
    sellPrice: z.coerce.number().optional(),
    breedPrice: z.coerce.number().optional(),
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
export const deleteBirdSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      return mongoose.Types.ObjectId.isValid(val)
    })
  })
})
