import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { fetchData, insertEntryExitData } from "../controllers/page14Controller.js";

const router = Router()
router.use(verifyJWT)

router.route('/insert').post(insertEntryExitData)
router.route('/get').get(fetchData)

export default router