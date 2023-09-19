import { z } from 'zod'

export const getByIdSchema = z.object({
  params: z.object({
    id: z.coerce.string().trim()
  })
})
export const createIdSchema = z.object({
  body: z.object({
    specie: z.coerce.string().nonempty('bắt buộc loài').trim(),
    dad: z.coerce.string().nonempty('bắt buộc cha').trim(),
    mom: z.coerce.string().nonempty('bắt buộc mẹ').trim(),
    children: z.array(z.coerce.string().nonempty('bắt buộc chim').trim()),
    sold: z.coerce.boolean().optional(),
    onSale: z.coerce.boolean().optional(),
    price: z.coerce.number(),
    imageUrls: z.array(z.coerce.string().trim()).optional(),
    description: z.coerce.string().optional(),
    discount: z
      .object({
        discountPercent: z.coerce.number(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date()
      })
      .optional()
  })
})
export const deleteNestSchema = z.object({
  params: z.object({
    id: z.coerce.string().nonempty('bắt buộc id').trim()
  })
})
export const updateNestSchema = z.object({
  params: z.object({
    id: z.coerce.string().nonempty('bắt buộc id').trim()
  }),
  body: z.object({
    specie: z.coerce.string().nonempty('bắt buộc loài').trim(),
    dad: z.coerce.string().nonempty('bắt buộc cha').trim(),
    mom: z.coerce.string().nonempty('bắt buộc mẹ').trim(),
    children: z.array(z.coerce.string().nonempty('bắt buộc chim').trim()),
    sold: z.coerce.boolean().optional(),
    onSale: z.coerce.boolean().optional(),
    price: z.coerce.number(),
    imageUrls: z.array(z.coerce.string().trim()).optional(),
    description: z.coerce.string().optional(),
    discount: z
      .object({
        discountPercent: z.coerce.number(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date()
      })
      .optional()
  })
})
