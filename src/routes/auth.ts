import express from 'express';
import { loginByGoogle, signIn, signUp } from '../controllers/auth';

const router = express.Router();

router.post('/login-google', loginByGoogle);

router.post('/sign-in', signIn);

router.post('/sign-up', signUp);

export default router;
