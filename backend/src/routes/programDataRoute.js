import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNewProgram, getAllPrograms, getProgramTypeById, getProgramTypeByName } from "../controllers/programDataController.js";

const router = Router();

router.use(verifyJWT)

router.route('/get').get(getAllPrograms)
router.route('/create').post(createNewProgram)
router.route('/get').post(getProgramTypeByName)
router.route('/getById').post(getProgramTypeById)

export default router