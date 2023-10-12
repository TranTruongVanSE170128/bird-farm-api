import express from 'express'
import {
  getPaginationBirds,
  getBirdsByIds,
  getBirdDetail,
  getBirdsBreed,
  // getPaginationBirdsAdmin,
  createBird,
  updateBird,
  deleteBird
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

// router.get(
//   '/pagination/admin',
//   verifyToken,
//   checkRole([Role.Admin]),
//   validateRequestData(getPaginationBirdsAdminSchema),
//   getPaginationBirdsAdmin
// )

router.get('/pagination', validateRequestData(getPaginationBirdsSchema), getPaginationBirds)

router.get('/breed', validateRequestData(getBirdsBreedSchema), getBirdsBreed)

router.post('/get-by-ids', validateRequestData(getBirdsByIdsSchema), getBirdsByIds)

router.get('/:id', validateRequestData(getBirdDetailSchema), getBirdDetail)

router.put('/:id', verifyToken, checkRole([Role.Manager]), validateRequestData(updateBirdSchema), updateBird)

router.delete('/:id', verifyToken, checkRole([Role.Manager]), validateRequestData(deleteBirdSchema), deleteBird)

router.post('/', verifyToken, checkRole([Role.Manager]), validateRequestData(createBirdSchema), createBird)

export default router
