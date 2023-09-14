import express, { Request, Response } from 'express'
import { getAllSpecie, addSpecie, updateSpecie } from '../controllers/speice'
import { validateRequestData } from '../middleware/validate-request-data'
import { addSpecieSchema, updateSpecieSchema } from '../validations/speice'
const router = express.Router()

router.get('/', getAllSpecie)
router.post('/', validateRequestData(addSpecieSchema), addSpecie)
router.put('/:id', validateRequestData(updateSpecieSchema), updateSpecie)

export default router
