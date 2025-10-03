import { Router } from "express";
import { createNewProgram, deleteProgram, getProgramByDepartment, getUGPrograms } from "../controllers/programController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
router.use(verifyJWT)
router.route('/create').post(createNewProgram)
router.route('/get').post(getProgramByDepartment)
router.route('/delete/:p_id').delete(deleteProgram)
router.route('/getUG').get(getUGPrograms)

export default router