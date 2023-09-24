import z from 'zod'

export const createCheckoutSessionSchema = z.object({
  body: z.object({
    products: z.object({
      birds: z.array(z.string()),
      nests: z.array(z.string())
    })
  })
})
