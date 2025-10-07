import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setSection1, getSection1 } from "../controllers/globalCitizenshipController.js";
import { setGlobalInterdependenceList, getGlobalInterdependenceList, setGlobalCompetenciesList, getGlobalCompetenciesList, setUniversalValuesList, getUniversalValuesList, setActiveCitizenshipList, getActiveCitizenshipList } from "../controllers/globalCitizenshipController.js";

const router = Router();
router.use(verifyJWT);


router.route("/section1").post(setSection1).get(getSection1);
router.route("/globalinterdependencelist").post(setGlobalInterdependenceList)
.get(getGlobalInterdependenceList)
router.route("/globalcompetencieslist").post(setGlobalCompetenciesList)
.get(getGlobalCompetenciesList)
router.route("/iniversalvalueslist").post(setUniversalValuesList)
.get(getUniversalValuesList)
router.route("/activecitizenshiplist").post(setActiveCitizenshipList)
.get(getActiveCitizenshipList)

export default router;