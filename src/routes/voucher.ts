import express from 'express'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { createVoucherSchema, getPaginationVouchersSchema, getVoucherDetailSchema } from '../validations/voucher'
import { validateRequestData } from '../middleware/validate-request-data'
import { createVoucher, getAllVoucher, getPaginationVouchers, getVoucherDetail } from '../controllers/voucher'

const router = express.Router()

router.get('/pagination', validateRequestData(getPaginationVouchersSchema), getPaginationVouchers)

router.get('/:id', validateRequestData(getVoucherDetailSchema), getVoucherDetail)

router.post('/', verifyToken, checkRole([Role.Staff]), validateRequestData(createVoucherSchema), createVoucher)

router.get('/', getAllVoucher)

export default router
