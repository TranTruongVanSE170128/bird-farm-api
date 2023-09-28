import z from 'zod'

export const createRatingSchema = z.object({
  body: z
    .object({
      value: z.coerce.number().min(1, 'Nhỏ nhất 1 sao').max(5, 'Tối đa 5 sao'),
      content: z.string().optional(),
      imageUrls: z.array(z.string()).optional(),
      order: z.string().optional(),
      orderNest: z.string().optional()
    })
    .refine((data) => {
      const { order, orderNest } = data
      return (order && !orderNest) || (!order && orderNest)
    })
})

export const getPaginationRatingsSchema = z.object({
  query: z.object({
    pageSize: z.coerce.number().optional(),
    pageNumber: z.coerce.number().optional(),
    value: z.coerce.number().optional()
  })
})
