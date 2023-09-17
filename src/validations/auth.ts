import { z } from 'zod'

const emailValidation = z.coerce.string().nonempty('email bắt buộc').email().trim()
const passwordValidation = z.coerce.string().nonempty('mật khẩu bắt buộc')
const idValidation = z.coerce.string().nonempty('id bắt buộc').trim()
const verifyCodeValidation = z.coerce.string().nonempty('mã xác thực bắt buộc').trim()
const accessTokenValidation = z.coerce.string().nonempty('access token bắt buộc').trim()

export const loginGoogleSchema = z.object({
  body: z.object({
    accessTokenGoogle: accessTokenValidation
  })
})
export const signInSchema = z.object({
  body: z.object({
    email: emailValidation,
    password: passwordValidation
  })
})

export const signUpSchema = z.object({
  body: z.object({
    name: z.coerce.string().nonempty('tên bắt buộc').trim(),
    email: emailValidation,
    password: passwordValidation
  })
})

export const forgetPasswordSchema = z.object({
  body: z.object({
    email: emailValidation
  })
})

export const verifyEmailSchema = z.object({
  params: z.object({
    id: idValidation,
    verifyCode: verifyCodeValidation
  })
})

export const resetPasswordSchema = z.object({
  params: z.object({
    id: idValidation,
    resetPasswordCode: verifyCodeValidation
  }),
  body: z.object({
    password: passwordValidation
  })
})
