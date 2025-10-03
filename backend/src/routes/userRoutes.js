import express from 'express'
import { sendVerificationEmail, deleteUser, getAllUsers, login, logOutUser, verifyAndRegister, checkIfLoggedIn, getMaxUID } from '../controllers/userController.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { importData } from '../utils/importFromExcel.js';

const router = express.Router();

router.route('/user').post(sendVerificationEmail)
router.route('/verify').post(verifyAndRegister)
router.route('/user/:id').delete(deleteUser)
router.route('/user').get(getAllUsers)
router.route('/login').post(login)
router.route('/logout').post(verifyJWT, logOutUser)
router.route('/me').get(verifyJWT,checkIfLoggedIn)
router.route('/getmax').get(getMaxUID)
router.route('/import').post(
  upload.fields([
{ 
  name: 'file',
  maxCount: 1
}
]),
  importData
)

export default router;