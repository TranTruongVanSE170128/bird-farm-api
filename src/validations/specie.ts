import { z } from 'zod'

export const getPaginationSpeciesSchema = z.object({
  query: z.object({
    pageSize: z.number().optional(),
    pageNumber: z.number().optional(),
    searchQuery: z.string().optional()
  })
})

export const addSpecieSchema = z.object({
  body: z.object({
    name: z.string().trim().toLowerCase(),
    imageUrl: z.string().url().optional(),
    description: z.string().optional()
  })
})

export const updateSpecieSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().optional(),
    imageUrl: z.string().url().optional(),
    description: z.string().optional()
  })
})
