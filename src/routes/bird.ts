import express from 'express'
import { getAllBird } from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
const router = express.Router()

router.get('/', getAllBird)
export default router
