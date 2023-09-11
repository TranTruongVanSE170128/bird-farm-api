import express from 'express';
import {
  loginByGoogle,
  signIn,
  signUp,
  verifyUser,
  forgetPassword,
  resetPassword,
} from '../controllers/auth';

const router = express.Router();

router.post('/login-google', loginByGoogle);

router.post('/sign-in', signIn);

router.post('/sign-up', signUp);

router.get('/:id/verify/:token', verifyUser);

router.post('/forget-password', forgetPassword);

router.post('/:id/reset-password/:resetPasswordCode', resetPassword);

export default router;
