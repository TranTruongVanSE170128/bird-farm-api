import express from 'express'
import { getSearchBirds, createBird, getBirdsByIds, getBirdDetail } from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
import { getSearchBirdsSchema, createBirdSchema, getBirdsByIdsSchema, getBirdDetailSchema } from '../validations/bird'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { getAdminBirds } from '../controllers/admin-bird'
const router = express.Router()

router.get('/', getAdminBirds)

export default router
