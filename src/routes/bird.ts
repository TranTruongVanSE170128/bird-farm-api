import express from 'express'
import { getBird} from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
const router = express.Router()
router.get("/",getBird)

export default router
