import express from 'express';
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  deleteDepartment,
  getDepartmentCount,
  getDepartmentByName,
} from '../controllers/deptController.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();
// To protect all routes in this file, you can uncomment the line below
 router.use(verifyJWT);

// Route for creating a single department and getting all departments
router.route('/')
  .post(createDepartment)
  .get(getAllDepartments);

// Routes for getting or deleting a specific department by its ID
router.route('/:f_id')
  .get(getDepartmentById)


router.route('/getCount').post(getDepartmentCount)
router.route('/delete/:d_id').delete(deleteDepartment)
router.route('/getName').post(getDepartmentByName)

export default router;

