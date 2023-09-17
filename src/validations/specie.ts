import { z } from 'zod'
const idValidation = z.coerce.string().nonempty('id bắt buộc').trim()
const nameValidation = z.coerce.string().nonempty('tên bắt buộc').trim()

export const getAllSpecieSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number(),
    pageNumber: z.coerce.number(),
    pagination: z.coerce.string()
  })
})
export const addSpecieSchema = z.object({
  body: z.object({
    name: nameValidation,
    imageUrl: z.coerce.string().url().optional(),
    description: z.coerce.string().optional()
  })
})

export const updateSpecieSchema = z.object({
  params: z.object({ id: idValidation }),
  body: z.object({
    name: z.coerce.string().optional(),
    imageUrl: z.coerce.string().url().optional(),
    description: z.coerce.string().optional()
  })
})
