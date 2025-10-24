import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setSection1, getSection1, getprogramfromtype, getProgramWithoutEnvironment, deleteCourse } from "../controllers/environmentController.js";   

const router = Router();
router.use(verifyJWT);

router.route("/getprogramfromtype").post(getprogramfromtype);
router.route("/setSection1").post(setSection1);
router.route("/getSection1").post(getSection1);
router.route("/getProgramWithoutEnvironment").get(getProgramWithoutEnvironment);
router.route('/delete').post(deleteCourse)

export default router;
