import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setSection1, setSection2, getSection1, getSection2 } from "../controllers/meExitugController.js";


const router = Router();
router.use(verifyJWT);

router.route("/section1").post(setSection1)
.get(getSection1);
router.route("/section2").post(setSection2)
.get(getSection2);

export default router