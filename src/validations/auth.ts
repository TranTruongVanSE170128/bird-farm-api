import { z } from 'zod'

const emailValidation = z.string().nonempty('email is required').trim().toLowerCase().email()
const passwordValidation = z.string().nonempty('password is required').trim().toLowerCase()
const idValidation = z.string().nonempty('id is required').trim().toLowerCase()
const verifyCodeValidation = z.string().nonempty('verify code is required').trim().toLowerCase()
const accessTokenValidation = z.string().nonempty('access token is required').trim()

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
    name: z.string().nonempty('name is required').trim().toLowerCase(),
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
