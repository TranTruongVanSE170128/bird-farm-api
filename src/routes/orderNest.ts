import express from 'express'
import { validateRequestData } from '../middleware/validate-request-data'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { createOrderNest } from '../controllers/orderNest'
const router = express.Router()

router.post('/', verifyToken, createOrderNest)
export default router
