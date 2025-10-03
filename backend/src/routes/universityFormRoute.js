import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUniById, uploadAddress, uploadContactInfo, uploadRegistrarInfo, uploadUniversityName, uploadVcInfo } from "../controllers/universityFormController.js";

const router = Router();
router.use(verifyJWT)

router.route('/uploadName').post(uploadUniversityName)
router.route('/uploadAddress').post(uploadAddress)
router.route('/uploadContact').post(uploadContactInfo)
router.route('/uploadVc').post(uploadVcInfo)
router.route('/uploadRegistrar').post(uploadRegistrarInfo)
router.route('/get').get(getUniById)

export default router