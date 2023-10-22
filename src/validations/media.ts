import z from 'zod'

export const updateMediaSchema = z.object({
  body: z.object({
    bannerUrls: z.array(z.string().url()).optional(),
    defaultAvatarUrl: z.string().url().optional()
  })
})
