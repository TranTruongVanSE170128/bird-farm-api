import express from 'express'
import { getMedia, updateMedia } from '../controllers/media'
import { validateRequestData } from '../middleware/validate-request-data'
import { updateMediaSchema } from '../validations/media'
const router = express.Router()

router.get('/', getMedia)
router.put('/', validateRequestData(updateMediaSchema), updateMedia)

export default router
