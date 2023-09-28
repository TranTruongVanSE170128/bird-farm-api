import express from 'express'
import { createRating, getAverageRatings, getPaginationRatings } from '../controllers/rating'
import { validateRequestData } from '../middleware/validate-request-data'
import { createRatingSchema, getPaginationRatingsSchema } from '../validations/rating'
import verifyToken from '../middleware/auth'

const router = express.Router()

router.get('/pagination', validateRequestData(getPaginationRatingsSchema), getPaginationRatings)

router.get('/average', getAverageRatings)

router.post('/', verifyToken, validateRequestData(createRatingSchema), createRating)

export default router
