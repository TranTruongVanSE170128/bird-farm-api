import express from 'express'
import { getAllNest, getNestById, deleteNest, updateNest, createNest } from '../controllers/nest'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
const router = express.Router()

// router.get('/', getAllNest)
router.get('/:id', getNestById)
router.post('/', verifyToken, checkRole(['admin' as Role]), createNest)
router.delete('/:id', verifyToken, checkRole(['admin' as Role]), deleteNest)
router.put('/:id', verifyToken, checkRole(['admin' as Role]), updateNest)

export default router
