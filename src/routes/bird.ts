import express from 'express'
import { getSearchBirds, getBirdsByIds, getBirdDetail } from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
import { getSearchBirdsSchema, getBirdsByIdsSchema, getBirdDetailSchema } from '../validations/bird'

const router = express.Router()

router.get('/', validateRequestData(getSearchBirdsSchema), getSearchBirds)

router.get('/:id', validateRequestData(getBirdDetailSchema), getBirdDetail)

router.get('/get-by-ids', validateRequestData(getBirdsByIdsSchema), getBirdsByIds)

export default router
