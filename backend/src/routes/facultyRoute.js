// routes/facultyRoute.js

import express from 'express';
import {
  createFaculty,
  getAllFaculty,
  deleteFaculty,
  getFacultyById,
  getFacultyIdByName
} from '../controllers/facultyController.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.use(verifyJWT);

// The base route is '/faculty'
router.route('/')
  .post(createFaculty)
  .get(getAllFaculty);

// The route for a specific faculty is '/:f_id'
router.route('/:f_id')
  .get(getFacultyById)
  .delete(deleteFaculty);

router.route('/getId').post(getFacultyIdByName)

export default router;