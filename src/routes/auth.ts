import express from 'express';
import {
  loginByGoogle,
  signIn,
  signUp,
  verifyUser,
  forgetPassword,
  resetPassword,
} from '../controllers/auth';
import { validateRequestData } from '../middleware/validate-request-data';
import { signInSchema } from '../validations/auth';

const router = express.Router();

router.post('/login-google', loginByGoogle);

router.post('/sign-in', validateRequestData(signInSchema), signIn);

router.post('/sign-up', signUp);

router.get('/:id/verify/:verifyCode', verifyUser);

router.post('/forget-password', forgetPassword);

router.post('/:id/reset-password/:resetPasswordCode', resetPassword);

export default router;
