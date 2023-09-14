import { z } from 'zod'

const idValidation = z.string().nonempty('id is required').trim()
const nameValidation = z.string().nonempty('name is required').trim()
const codeValidation = z.string().nonempty('code is required').trim().length(6)

export const addSpecieSchema = z.object({
  body: z.object({
    name: nameValidation,
    code: codeValidation,
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
