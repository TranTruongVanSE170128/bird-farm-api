import express from 'express'
import { getSearchBirds, createBird, getBirdsByIds, getBirdsBySpecie } from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  getSearchBirdsSchema,
  createBirdSchema,
  getBirdsByIdsSchema,
  getBirdsBySpecieSchema
} from '../validations/bird'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
const router = express.Router()

router.get('/', validateRequestData(getSearchBirdsSchema), getSearchBirds)

router.post('/', verifyToken, checkRole(['admin' as Role]), validateRequestData(createBirdSchema), createBird)

router.get('/get-by-ids', validateRequestData(getBirdsByIdsSchema), getBirdsByIds)

router.get('/pairing', validateRequestData(getBirdsBySpecieSchema), getBirdsBySpecie)

export default router
