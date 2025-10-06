import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { insertData , fetchData } from "../controllers/page11Controller.js";


const router = Router()
router.use(verifyJWT)

router.route('/insert').post(insertData)
router.route('/get').get(fetchData)

export default router