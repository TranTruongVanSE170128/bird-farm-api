import express from 'express'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { createVoucherSchema, getPaginationVouchersSchema } from '../validations/voucher'
import { validateRequestData } from '../middleware/validate-request-data'
import { createVoucher, getPaginationVouchers } from '../controllers/voucher'

const router = express.Router()

router.get('/pagination', validateRequestData(getPaginationVouchersSchema), getPaginationVouchers)

router.post('/', verifyToken, checkRole([Role.Manager]), validateRequestData(createVoucherSchema), createVoucher)

export default router
