import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setSection1, getSection1 } from "../controllers/meExitpgController.js";

const router = Router();
router.use(verifyJWT);

router.route("/section1").post(setSection1)
router.route('/get').get(getSection1)

export default router


