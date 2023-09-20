import express from 'express'
import { getSearchBirds, createBird, getBirdsByIds, getBirdDetail } from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  getSearchBirdsSchema,
  createBirdSchema,
  getBirdsByIdsSchema,
  getBirdDetailSchema,
  getAdminBirdsSchema
} from '../validations/bird'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { getAdminBirds } from '../controllers/admin-bird'
import { Role } from '../typings/types'
const router = express.Router()

router.get('/', verifyToken, checkRole([Role.Admin]), validateRequestData(getAdminBirdsSchema), getAdminBirds)

router.post('/', verifyToken, checkRole([Role.Admin]), validateRequestData(createBirdSchema), createBird)

export default router
