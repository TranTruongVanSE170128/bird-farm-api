import express from 'express'
import { validateRequestData } from '../middleware/validate-request-data'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { createOrderNest } from '../controllers/orderNest'
import { createOrderNestSchema } from '../validations/orderNest'
const router = express.Router()

router.post('/', validateRequestData(createOrderNestSchema), verifyToken, createOrderNest)
export default router
