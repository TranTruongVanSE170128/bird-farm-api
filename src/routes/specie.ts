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

router.get('/pagination', validateRequestData(getPaginationSpeciesSchema), getPaginationSpecies)

router.get('/:id', validateRequestData(getSpecieDetailSchema), getSpecieDetail)

router.put('/:id', verifyToken, checkRole([Role.Manager]), validateRequestData(updateSpecieSchema), updateSpecie)

router.get('/', getAllSpecies)

router.post('/', verifyToken, checkRole([Role.Manager]), validateRequestData(addSpecieSchema), addSpecie)

export default router
