import { z } from 'zod'

export const getSearchBirdsSchema = z.object({
  query: z.object({
    pageSize: z.coerce.string().trim().optional(),
    pageNumber: z.coerce.string().trim().optional(),
    searchQuery: z.coerce.string().trim().optional(),
    specie: z.coerce.string().trim().optional()
  })
})

export const getAdminBirdsSchema = getSearchBirdsSchema

export const getBirdDetailSchema = z.object({
  params: z.object({
    id: z.coerce.string().trim()
  })
})

export const createBirdSchema = z.object({
  body: z.object({
    specie: z.coerce.string().nonempty('bắt buộc loài').trim(),
    name: z.coerce.string().nonempty('bắt buộc tên').trim(),
    birth: z.coerce.date().optional(),
    price: z.coerce.number(),
    description: z.coerce.string().optional(),
    sold: z.coerce.boolean().optional(),
    onSale: z.coerce.boolean().optional(),
    gender: z.enum(['male', 'female']),
    imageUrls: z.array(z.coerce.string()).optional(),
    parent: z
      .object({
        dad: z.coerce.string().optional(),
        mom: z.coerce.string().optional()
      })
      .optional(),
    achievements: z
      .array(
        z.object({
          competition: z.coerce.string(),
          rank: z.coerce.number()
        })
      )
      .optional(),
    discount: z
      .object({
        discountPercent: z.coerce.number(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date()
      })
      .optional()
  })
})

export const getBirdsByIdsSchema = z.object({
  body: z.object({
    birds: z.array(z.coerce.string())
  })
})
export const getBirdsBySpecieSchema = z.object({
  query: z.object({
    specie: z.coerce.string({ required_error: 'bắt buộc' }).nonempty('bắt buộc')
  })
})
