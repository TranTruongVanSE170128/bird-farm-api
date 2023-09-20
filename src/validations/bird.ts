import { z } from 'zod'

export const getSearchBirdsSchema = z.object({
  query: z.object({
    pageSize: z.string().trim().optional(),
    pageNumber: z.string().trim().optional(),
    searchQuery: z.string().trim().optional(),
    specie: z.string().trim().optional()
  })
})

export const getAdminBirdsSchema = getSearchBirdsSchema

export const getBirdDetailSchema = z.object({
  params: z.object({
    id: z.string().trim()
  })
})

export const createBirdSchema = z.object({
  body: z.object({
    specie: z.string().nonempty('bắt buộc loài').trim(),
    name: z.string().nonempty('bắt buộc tên').trim(),
    birth: z.date().optional(),
    price: z.number(),
    description: z.string().optional(),
    sold: z.boolean().optional(),
    onSale: z.boolean().optional(),
    gender: z.enum(['male', 'female']),
    imageUrls: z.array(z.string()).optional(),
    parent: z
      .object({
        dad: z.string().optional(),
        mom: z.string().optional()
      })
      .optional(),
    achievements: z
      .array(
        z.object({
          competition: z.string(),
          rank: z.number()
        })
      )
      .optional(),
    discount: z
      .object({
        discountPercent: z.number(),
        startDate: z.date(),
        endDate: z.date()
      })
      .optional()
  })
})

export const getBirdsByIdsSchema = z.object({
  body: z.object({
    birds: z.array(z.string())
  })
})
export const getBirdsBySpecieSchema = z.object({
  query: z.object({
    specie: z.string({ required_error: 'bắt buộc' }).nonempty('bắt buộc')
  })
})
