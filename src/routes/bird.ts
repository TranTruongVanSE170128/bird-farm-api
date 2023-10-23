import express from 'express'
import {
  getPaginationBirds,
  getBirdsByIds,
  getBirdDetail,
  getBirdsBreed,
  // getPaginationBirdsAdmin,
  createBird,
  updateBird,
  getPaginationBirdsManage,
  deleteBird,
  // randomParent,
  // randomDescription
} from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  getPaginationBirdsSchema,
  getBirdsByIdsSchema,
  getBirdDetailSchema,
  getBirdsBreedSchema,
  // getPaginationBirdsAdminSchema,
  createBirdSchema,
  updateBirdSchema,
  deleteBirdSchema
} from '../validations/bird'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'

const router = express.Router()

router.get(
  '/pagination/manage',
  verifyToken,
  checkRole([Role.Manager]),
  validateRequestData(getPaginationBirdsSchema),
  getPaginationBirdsManage
)

router.get('/pagination', validateRequestData(getPaginationBirdsSchema), getPaginationBirds)

router.get('/breed', validateRequestData(getBirdsBreedSchema), getBirdsBreed)

router.post('/get-by-ids', validateRequestData(getBirdsByIdsSchema), getBirdsByIds)

router.get('/:id', validateRequestData(getBirdDetailSchema), getBirdDetail)

router.put('/:id', verifyToken, checkRole([Role.Manager]), validateRequestData(updateBirdSchema), updateBird)

router.delete('/:id', verifyToken, checkRole([Role.Manager]), validateRequestData(deleteBirdSchema), deleteBird)

router.post('/', verifyToken, checkRole([Role.Manager]), validateRequestData(createBirdSchema), createBird)

// router.put('/dangerous/random-parent', randomParent)
// router.put('/dangerous/random-description', randomDescription)

export default router
