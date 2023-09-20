import { z } from 'zod'

export const loginGoogleSchema = z.object({
  body: z.object({
    accessTokenGoogle: z.string().trim()
  })
})

export const signInSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().trim()
  })
})

export const signUpSchema = z.object({
  body: z.object({
    name: z.string().nonempty('tên bắt buộc').trim(),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().trim()
  })
})

export const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email()
  })
})

export const verifyEmailSchema = z.object({
  params: z.object({
    id: z.string().trim(),
    verifyCode: z.string().trim()
  })
})

export const resetPasswordSchema = z.object({
  params: z.object({
    id: z.string().trim(),
    resetPasswordCode: z.string().trim()
  }),
  body: z.object({
    password: z.string().trim()
  })
})
