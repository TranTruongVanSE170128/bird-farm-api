import express from 'express'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { createVoucherSchema, getPaginationVouchersSchema, getVoucherDetailSchema } from '../validations/voucher'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  createVoucher,
  getAllVoucher,
  getPaginationVouchers,
  getVoucherDetail,
  disableVoucher,
  enableVoucher
} from '../controllers/voucher'

const router = express.Router()
router.put('/:id/disable', disableVoucher)
router.put('/:id/enable', enableVoucher)
router.get('/pagination', validateRequestData(getPaginationVouchersSchema), getPaginationVouchers)

router.get('/:id', validateRequestData(getVoucherDetailSchema), getVoucherDetail)

router.post('/', validateRequestData(createVoucherSchema), createVoucher)

router.get('/', getAllVoucher)

export default router
