import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getProgramId, getTotalPrograms, getUniByName,insert3yearBachelorProgram,insert4yearBachelorProgram,insert4yearHonourProgram,insert4yearIntegratedDegreeProgram,insert5yearIntegratedDegreeProgram,insertBvocProgram,insertProgram,insertRegulatingProgram,insertUGProgramWithFlexibility,setCCFUGP, setSection3, setSection4, setSection5, setSection6, setSection7, setSection8 } from '../controllers/ugFormController.js';


const router = Router();
router.use(verifyJWT);

router.route('/total').get(getTotalPrograms)
router.route('/getName').get(getUniByName)
router.route('/ccfugp').post(setCCFUGP) //is handling the follow/unfollow and count logic in frontend
router.route('/getProgram').post(getProgramId)
router.route('/insertProgram').post(insertProgram)
router.route('/insertRegulatingProgram').post(insertRegulatingProgram)
router.route('/insertBachelorProgram').post(insert3yearBachelorProgram)
router.route('/insertBvoc').post(insertBvocProgram)
router.route('/insert4YrBachelor').post(insert4yearBachelorProgram)
router.route('/insert4YrHonor').post(insert4yearHonourProgram)
router.route('/insert4Integrated').post(insert4yearIntegratedDegreeProgram)
router.route('/insert5Integrated').post(insert5yearIntegratedDegreeProgram)
router.route('/insertFlexibility').post(insertUGProgramWithFlexibility)
router.route('/setSection3').post(setSection3)
router.route('/setSection4').post(setSection4)
router.route('/setSection5').post(setSection5)
router.route('/setSection6').post(setSection6)
router.route('/setSection7').post(setSection7)
router.route('/setSection8').post(setSection8)


export default router

