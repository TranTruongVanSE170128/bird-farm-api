import express from 'express'
import {
  getNestById,
  updateNest,
  createNest,
  getPaginationNests,
  getNestsByIds,
  getPaginationNestsManage
} from '../controllers/nest'
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

router.get(
  '/pagination/manage',
  verifyToken,
  checkRole([Role.Manager]),
  validateRequestData(getPaginationNestsSchema),
  getPaginationNestsManage
)

router.get('/pagination', validateRequestData(getPaginationNestsSchema), getPaginationNests)

router.post('/get-by-ids', validateRequestData(getNestsByIdsSchema), getNestsByIds)

router.get('/:id', validateRequestData(getNestByIdSchema), getNestById)

router.put('/:id', verifyToken, checkRole([Role.Manager]), validateRequestData(updateNestSchema), updateNest)

router.post('/', verifyToken, checkRole([Role.Manager]), validateRequestData(createNestSchema), createNest)

export default router
