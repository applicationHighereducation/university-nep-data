import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {
  getTotalPrograms,
  getProgramId,
  setSection1,
  setSection2,
  setSection3,
  insertpgCCFFP,
  insertpgOtherThanCCFUGP,
  insert2Yearpg,
  insert1Yearpg,
  insert5YearIntegratedpg,
  insertRegulatingProgram,
  getPGPrograms
} from '../controllers/pgFormController.js';


const router = Router();
router.use(verifyJWT);

router.route('/total').get(getTotalPrograms)
router.route('/get').get(getPGPrograms)
router.route('/getProgramId').post(getProgramId)
router.route('/setSection1').post(setSection1) 
router.route('/setSection2').post(setSection2) 
router.route('/setSection3').post(setSection3)

router.route('/insertpgCCFFP').post(insertpgCCFFP)
router.route('/insertpgOtherThanCCFUGP').post(insertpgOtherThanCCFUGP)
router.route('/insertRegulating').post(insertRegulatingProgram)
router.route('/insert2Yearpg').post(insert2Yearpg)
router.route('/insert1Yearpg').post(insert1Yearpg)
router.route('/insert5YearIntegratedpg').post(insert5YearIntegratedpg)










export default router