import { z } from 'zod'

const idValidation = z.string().nonempty('id is required').trim()
const nameValidation = z.string().nonempty('name is required').trim()
const codeValidation = z.string().nonempty('code is required').trim().length(6)
const imageUrlValidation = z.string().nonempty('url is required').url()
const descriptionValidation = z.string().nonempty('description is required').trim()

export const addSpeiceSchema = z.object({
  body: z.object({
    name: nameValidation,
    code: codeValidation,
    imageUrl: imageUrlValidation,
    description: descriptionValidation
  })
})

export const updateSpeiceSchema = z.object({
  params: z.object({ id: idValidation }),
  body: z.object({
    name: nameValidation,
    code: codeValidation,
    imageUrl: imageUrlValidation,
    description: descriptionValidation
  })
})
