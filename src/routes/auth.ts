import express from 'express'
import { loginByGoogle, signIn, signUp, verifyUser, forgetPassword, resetPassword } from '../controllers/auth'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  forgetPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifySchema
} from '../validations/auth'

const router = express.Router()

router.post('/login-google', loginByGoogle)

router.post('/sign-in', validateRequestData(signInSchema), signIn)

router.post('/sign-up', validateRequestData(signUpSchema), signUp)

router.get('/:id/verify/:verifyCode', validateRequestData(verifySchema), verifyUser)

router.post('/forget-password', validateRequestData(forgetPasswordSchema), forgetPassword)

router.post('/:id/reset-password/:resetPasswordCode', validateRequestData(resetPasswordSchema), resetPassword)

export default router
