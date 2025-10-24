import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setSeats, getSeatRecord, getprogramfromtype, setStrength, getStrengthCount, getStrengthRecord, deleteStrengthRecord, deleteSeatRecord} from "../controllers/masterSeatController.js";

const router = Router();
router.use(verifyJWT);
router.route("/getprogramfromtype").post(getprogramfromtype);
router.route("/getSeatRecord").post(getSeatRecord);
router.route("/setSeats").post(setSeats);
router.route("/setStrength").post(setStrength);
router.route("/getStrengthCount").post(getStrengthCount);
router.route("/getStrengthRecord").post(getStrengthRecord);

router.route("/deleteSeatRecord").post(deleteSeatRecord);
router.route("/deleteStrengthRecord").post(deleteStrengthRecord);

export default router
