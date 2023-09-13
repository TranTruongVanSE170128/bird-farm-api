import express, { Request, Response } from 'express'
import { getAllSpeice, addSpeice, updateSpeice } from '../controllers/speice'
import { validateRequestData } from '../middleware/validate-request-data'
import { addSpeiceSchema, updateSpeiceSchema } from '../validations/speice'
const router = express.Router()

router.get('/', getAllSpeice)
router.post('/', validateRequestData(addSpeiceSchema), addSpeice)
router.put('/:id', validateRequestData(updateSpeiceSchema), updateSpeice)

export default router
