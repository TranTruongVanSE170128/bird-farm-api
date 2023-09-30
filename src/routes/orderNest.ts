import express from 'express'
import { validateRequestData } from '../middleware/validate-request-data'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import {
  addStage,
  approveOrderNest,
  // createOrderNest,
  getOrderNestDetail,
  getPaginationOrderNests,
  getPaginationOrderNestsManage
} from '../controllers/orderNest'
import {
  addStageSchema,
  approveOrderNestSchema,
  createOrderNestSchema,
  getOrderNestDetailSchema,
  getPaginationOrderNestsManageSchema,
  getPaginationOrderNestsSchema
} from '../validations/orderNest'

const router = express.Router()

router.get(
  '/pagination/manage',
  verifyToken,
  validateRequestData(getPaginationOrderNestsManageSchema),
  checkRole([Role.Staff]),
  getPaginationOrderNestsManage
)

router.put(
  '/:id/approve',
  verifyToken,
  checkRole([Role.Staff]),
  validateRequestData(approveOrderNestSchema),
  approveOrderNest
)

router.post('/:id/add-stage', verifyToken, validateRequestData(addStageSchema), checkRole([Role.Staff]), addStage)

router.get('/pagination', verifyToken, validateRequestData(getPaginationOrderNestsSchema), getPaginationOrderNests)

router.get(
  '/:id',
  verifyToken,
  validateRequestData(getOrderNestDetailSchema),
  checkRole([Role.Staff]),
  getOrderNestDetail
)

// router.post('/', validateRequestData(createOrderNestSchema), verifyToken, createOrderNest)

export default router
