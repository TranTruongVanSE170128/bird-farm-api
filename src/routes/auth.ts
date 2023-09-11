import express from 'express';
import { loginByGoogle, signIn, signUp, verifyUser } from '../controllers/auth';

const router = express.Router();

router.post('/login-google', loginByGoogle);

router.post('/sign-in', signIn);

router.post('/sign-up', signUp);

router.get('/:id/verify/:token', verifyUser);

export default router;
