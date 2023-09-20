import { z } from 'zod'

export const getByIdSchema = z.object({
  params: z.object({
    id: z.string().trim()
  })
})
export const createIdSchema = z.object({
  body: z.object({
    specie: z.string().nonempty('bắt buộc loài').trim(),
    dad: z.string().nonempty('bắt buộc cha').trim(),
    mom: z.string().nonempty('bắt buộc mẹ').trim(),
    children: z.array(z.string().nonempty('bắt buộc chim').trim()),
    sold: z.boolean().optional(),
    onSale: z.boolean().optional(),
    price: z.number(),
    imageUrls: z.array(z.string().trim()).optional(),
    description: z.string().optional(),
    discount: z
      .object({
        discountPercent: z.number(),
        startDate: z.date(),
        endDate: z.date()
      })
      .optional()
  })
})
export const deleteNestSchema = z.object({
  params: z.object({
    id: z.string().nonempty('bắt buộc id').trim()
  })
})
export const updateNestSchema = z.object({
  params: z.object({
    id: z.string().nonempty('bắt buộc id').trim()
  }),
  body: z.object({
    specie: z.string().nonempty('bắt buộc loài').trim(),
    dad: z.string().nonempty('bắt buộc cha').trim(),
    mom: z.string().nonempty('bắt buộc mẹ').trim(),
    children: z.array(z.string().nonempty('bắt buộc chim').trim()),
    sold: z.boolean().optional(),
    onSale: z.boolean().optional(),
    price: z.number(),
    imageUrls: z.array(z.string().trim()).optional(),
    description: z.string().optional(),
    discount: z
      .object({
        discountPercent: z.number(),
        startDate: z.date(),
        endDate: z.date()
      })
      .optional()
  })
})
