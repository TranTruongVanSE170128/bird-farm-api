import { z } from 'zod'

export const getNestByIdSchema = z.object({
  params: z.object({
    id: z.string().trim()
  })
})

export const getPaginationNestsSchema = z.object({
  query: z.object({
    pageSize: z.number().optional(),
    pageNumber: z.number().optional(),
    searchQuery: z.string().trim().optional()
  })
})

export const createNestSchema = z.object({
  body: z.object({
    specie: z.string().trim(),
    name: z.string().trim(),
    price: z.number(),
    imageUrls: z.array(z.string().trim()).optional(),
    description: z.string().optional(),
    dad: z.string().trim().optional(),
    mom: z.string().trim().optional(),
    sold: z.boolean().optional()
    // onSale: z.boolean().optional(),
  })
})

export const updateNestSchema = z.object({
  params: z.object({
    id: z.string().trim()
  }),
  body: z.object({
    specie: z.string().trim().optional(),
    name: z.string().trim().optional(),
    price: z.number().optional(),
    imageUrls: z.array(z.string().trim()).optional(),
    description: z.string().optional(),
    dad: z.string().trim().optional(),
    mom: z.string().trim().optional(),
    sold: z.boolean().optional()
    // onSale: z.boolean().optional(),
  })
})
