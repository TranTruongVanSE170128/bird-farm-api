import express from 'express'
import {
  getPaginationBirds,
  getBirdsByIds,
  getBirdDetail,
  getBirdsBreed,
  // getPaginationBirdsAdmin,
  createBird,
  updateBird
} from '../controllers/bird'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  getPaginationBirdsSchema,
  getBirdsByIdsSchema,
  getBirdDetailSchema,
  getBirdsBreedSchema,
  // getPaginationBirdsAdminSchema,
  createBirdSchema,
  updateBirdSchema
} from '../validations/bird'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'

const router = express.Router()

router.get('/pagination', validateRequestData(getPaginationBirdsSchema), getPaginationBirds)

// router.get(
//   '/pagination/admin',
//   verifyToken,
//   checkRole([Role.Admin]),
//   validateRequestData(getPaginationBirdsAdminSchema),
//   getPaginationBirdsAdmin
// )

router.post('/', verifyToken, checkRole([Role.Admin]), validateRequestData(createBirdSchema), createBird)

router.get('/:id', validateRequestData(getBirdDetailSchema), getBirdDetail)

router.put('/:id', validateRequestData(updateBirdSchema), updateBird)

router.post('/get-by-ids', validateRequestData(getBirdsByIdsSchema), getBirdsByIds)

router.get('/breed', validateRequestData(getBirdsBreedSchema), getBirdsBreed)

export default router
