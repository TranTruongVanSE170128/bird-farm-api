import express from 'express'
import { getAllSpecie, addSpecie, updateSpecie } from '../controllers/specie'
import { validateRequestData } from '../middleware/validate-request-data'
import { addSpecieSchema, getAllSpecieSchema, updateSpecieSchema } from '../validations/specie'
const router = express.Router()

router.get('/' ,getAllSpecie)
router.post('/', validateRequestData(addSpecieSchema), addSpecie)
router.put('/:id', validateRequestData(updateSpecieSchema), updateSpecie)

export default router
