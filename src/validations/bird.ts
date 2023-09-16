import { z } from 'zod'

export const getBirdSchema = z.object({
  query: z.object({
    pageSize: z.number().optional(),
    pageNumber: z.number().optional(),
    searchQuery:z.string().optional()
  })
})