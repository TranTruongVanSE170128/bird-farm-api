import express from 'express' 
import {getAllNest, getNestById, deleteNest, updateNest,createNest} from '../controllers/nest'
const router= express.Router()

router.get("/",getAllNest)
router.get("/:id",getNestById)
router.post("/",createNest)
router.delete("/:id",deleteNest)
router.put("/:id",updateNest)

export default router