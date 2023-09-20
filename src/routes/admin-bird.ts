import express from 'express'
import { createBird } from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
import { createBirdSchema, getAdminBirdsSchema } from '../validations/bird'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { getAdminBirds } from '../controllers/admin-bird'
import { Role } from '../typings/types'
const router = express.Router()

router.get('/', verifyToken, checkRole([Role.Admin]), validateRequestData(getAdminBirdsSchema), getAdminBirds)

router.post('/', verifyToken, checkRole([Role.Admin]), validateRequestData(createBirdSchema), createBird)

export default router
