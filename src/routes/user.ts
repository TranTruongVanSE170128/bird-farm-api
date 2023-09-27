import express from 'express'
import { whoAmI } from '../controllers/user'
import verifyToken from '../middleware/auth'

const router = express.Router()

router.get('/who-am-i', verifyToken, whoAmI)
export default router
