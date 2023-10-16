import express from 'express'
import { getNestById, updateNest, createNest, getPaginationNests, getNestsByIds, deleteNest } from '../controllers/nest'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  createNestSchema,
  deleteNestSchema,
  getNestByIdSchema,
  getNestsByIdsSchema,
  getPaginationNestsSchema,
  updateNestSchema
} from '../validations/nest'
import { getPaginationOrderNestsManage } from '../controllers/orderNest'
const router = express.Router()

router.get(
  '/pagination/manage',
  verifyToken,
  checkRole([Role.Manager]),
  validateRequestData(getPaginationNestsSchema),
  getPaginationOrderNestsManage
)

router.get('/pagination', validateRequestData(getPaginationNestsSchema), getPaginationNests)

router.post('/get-by-ids', validateRequestData(getNestsByIdsSchema), getNestsByIds)

router.get('/:id', validateRequestData(getNestByIdSchema), getNestById)

router.put('/:id', verifyToken, checkRole([Role.Manager]), validateRequestData(updateNestSchema), updateNest)

router.delete('/:id', verifyToken, checkRole([Role.Manager]), validateRequestData(deleteNestSchema), deleteNest)

router.post('/', verifyToken, checkRole([Role.Manager]), validateRequestData(createNestSchema), createNest)

export default router
