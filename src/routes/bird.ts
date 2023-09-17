import express from 'express'
import { getSearchBirds } from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
import { getSearchBirdsSchema } from '../validations/bird'
const router = express.Router()
router.get('/', validateRequestData(getSearchBirdsSchema), getSearchBirds)

export default router
