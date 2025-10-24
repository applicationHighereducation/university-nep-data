import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setSection1, getSection1, setSection2, getSection2 } from "../controllers/page17Controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/setSection1").post(setSection1);
router.route("/getSection1").get(getSection1);
router.route("/setSection2").post(setSection2);
router.route("/getSection2").get(getSection2);

export default router;
