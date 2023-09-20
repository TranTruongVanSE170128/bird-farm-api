import { z } from 'zod'

export const getPaginationSpeciesSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    searchQuery: z.string().trim().optional()
  })
})

export const addSpecieSchema = z.object({
  body: z.object({
    name: z.string().trim(),
    imageUrl: z.string().trim().url().optional(),
    description: z.string().trim().optional()
  })
})

export const updateSpecieSchema = z.object({
  params: z.object({ id: z.string().trim() }),
  body: z.object({
    name: z.string().trim().optional(),
    imageUrl: z.string().trim().url().optional(),
    description: z.string().trim().optional()
  })
})
