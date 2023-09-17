import { z } from 'zod'
const idValidation = z.string().nonempty('id is required').trim()
const nameValidation = z.string().nonempty('name is required').trim()

export const getAllSpecieSchema = z.object({
  query: z.object({
    pageSize: z.number(),
    pageNumber: z.number(),
    pagination: z.string()
  })
})
export const addSpecieSchema = z.object({
  body: z.object({
    name: nameValidation,
    imageUrl: z.string().url().optional(),
    description: z.string().optional()
  })
})

export const updateSpecieSchema = z.object({
  params: z.object({ id: idValidation }),
  body: z.object({
    name: z.string().optional(),
    imageUrl: z.string().url().optional(),
    description: z.string().optional()
  })
})
