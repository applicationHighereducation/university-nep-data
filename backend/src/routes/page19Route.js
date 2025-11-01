import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setSection19, getSection19 } from "../controllers/page19Controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/setSection1").post(setSection19).get(getSection19);

export default router;
