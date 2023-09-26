import express from 'express'
import { getNestById, updateNest, createNest, getPaginationNests, getNestsByIds } from '../controllers/nest'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  createNestSchema,
  getNestByIdSchema,
  getNestsByIdsSchema,
  getPaginationNestsSchema,
  updateNestSchema
} from '../validations/nest'
const router = express.Router()

// router.get('/', getAllNests)
router.get('/pagination', validateRequestData(getPaginationNestsSchema), getPaginationNests)

router.get('/:id', validateRequestData(getNestByIdSchema), getNestById)

router.post('/get-by-ids', validateRequestData(getNestsByIdsSchema), getNestsByIds)

router.post('/', verifyToken, checkRole([Role.Admin]), validateRequestData(createNestSchema), createNest)

router.put('/:id', verifyToken, checkRole([Role.Admin]), validateRequestData(updateNestSchema), updateNest)

export default router