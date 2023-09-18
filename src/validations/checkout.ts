import z from 'zod'

export const createCheckoutSessionSchema = z.object({
  body: z.object({
    products: z.object({
      birds: z.record(z.number()),
      nests: z.record(z.number())
    })
  })
})
