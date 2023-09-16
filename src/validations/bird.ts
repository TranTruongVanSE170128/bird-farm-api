import { z } from 'zod'

export const getSearchBirdsSchema = z.object({
  query: z.object({
    pageSize: z.string().trim().optional(),
    pageNumber: z.string().trim().optional(),
    searchQuery:z.string().trim().optional()
  })
})