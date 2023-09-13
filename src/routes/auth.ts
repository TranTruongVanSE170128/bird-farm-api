import express from 'express'
import { loginByGoogle, signIn, signUp, forgetPassword, resetPassword, verifyEmail } from '../controllers/auth'
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

router.post('/login-google', validateRequestData(loginGoogleSchema), loginByGoogle)

router.post('/sign-in', validateRequestData(signInSchema), signIn)

router.post('/sign-up', validateRequestData(signUpSchema), signUp)

router.get('/:id/verify/:verifyCode', validateRequestData(verifyEmailSchema), verifyEmail)

router.post('/forget-password', validateRequestData(forgetPasswordSchema), forgetPassword)

router.post('/:id/reset-password/:resetPasswordCode', validateRequestData(resetPasswordSchema), resetPassword)

export default router
