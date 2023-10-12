import express from 'express'
import {
  loginByGoogle,
  signIn,
  signUp,
  forgetPassword,
  resetPassword,
  verifyEmail,
  sendCode
} from '../controllers/auth'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  forgetPasswordSchema,
  loginGoogleSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema
} from '../validations/auth'

const router = express.Router()

router.get('/:id/verify/:verifyCode', validateRequestData(verifyEmailSchema), verifyEmail)

router.post('/:id/reset-password/:resetPasswordCode', validateRequestData(resetPasswordSchema), resetPassword)

router.post('/forget-password', validateRequestData(forgetPasswordSchema), forgetPassword)

router.post('/sign-up', validateRequestData(signUpSchema), signUp)

router.post('/login-google', validateRequestData(loginGoogleSchema), loginByGoogle)

router.post('/sign-in', validateRequestData(signInSchema), signIn)

router.get('/:id/send-code', sendCode)

export default router
