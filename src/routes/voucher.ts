import express from 'express'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import {
  createVoucherSchema,
  getPaginationVouchersSchema,
  getVoucherDetailSchema,
  updateVoucherSchema,
  disableVoucherSchema,
  enableVoucherSchema
} from '../validations/voucher'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  createVoucher,
  getAllVoucher,
  getPaginationVouchers,
  getVoucherDetail,
  disableVoucher,
  enableVoucher,
  updateVoucher
} from '../controllers/voucher'

const router = express.Router()
router.put(
  '/:id/disable',
  verifyToken,
  checkRole([Role.Staff]),
  validateRequestData(disableVoucherSchema),
  disableVoucher
)
router.put('/:id/enable', verifyToken, checkRole([Role.Staff]), validateRequestData(enableVoucherSchema), enableVoucher)
router.get('/pagination', validateRequestData(getPaginationVouchersSchema), getPaginationVouchers)
router.get('/:id', validateRequestData(getVoucherDetailSchema), getVoucherDetail)
router.put('/:id', verifyToken, checkRole([Role.Staff]), validateRequestData(updateVoucherSchema), updateVoucher)
router.post('/', verifyToken, checkRole([Role.Staff]), validateRequestData(createVoucherSchema), createVoucher)
router.get('/', getAllVoucher)

export default router
