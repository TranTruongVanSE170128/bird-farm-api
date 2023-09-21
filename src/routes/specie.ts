import express from 'express'
import { getAllSpecies, addSpecie, updateSpecie, getPaginationSpecies, getSpecieDetail } from '../controllers/specie'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  addSpecieSchema,
  updateSpecieSchema,
  getPaginationSpeciesSchema,
  getSpecieDetailSchema
} from '../validations/specie'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
const router = express.Router()

router.get('/', getAllSpecies)

router.get('/pagination', validateRequestData(getPaginationSpeciesSchema), getPaginationSpecies)

router.get('/:id', validateRequestData(getSpecieDetailSchema), getSpecieDetail)

router.post('/', verifyToken, checkRole([Role.Admin]), validateRequestData(addSpecieSchema), addSpecie)

router.put('/:id', verifyToken, checkRole([Role.Admin]), validateRequestData(updateSpecieSchema), updateSpecie)

export default router
