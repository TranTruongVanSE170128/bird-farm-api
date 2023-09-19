import express from 'express' 
import {getAllNest, getNestById, deleteNest, updateNest,createNest} from '../controllers/nest'
const router= express.Router()

router.get("/",getAllNest)
router.get("/:id",getNestById)
router.post("/",createNest)
router.delete("/",deleteNest)
router.put("/",updateNest)

export default router