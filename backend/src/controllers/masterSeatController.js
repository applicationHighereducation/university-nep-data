import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { setSeatsService, getSeatRecordService, getprogramfromtypeService, setStrengthService, getStrengthCountService, getStrengthRecordService, deleteSeatRecordService, deleteStrengthRecordService  } from '../models/masterSeatModel.js'

const setSeats = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const {prog_name, year, sanctioned_seats, filled_seats} = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await setSeatsService(u_id,prog_name, year, sanctioned_seats, filled_seats);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Program data fetched successfully"))
});

const getprogramfromtype = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const { pt_name } = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');

    if (!pt_name) throw new ApiError(400, 'Program type is required');
    const result = await getprogramfromtypeService(u_id,pt_name);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Program data fetched successfully"))
});

const getSeatRecord = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const {prog_name} = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');

    const result = await getSeatRecordService(u_id, prog_name);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Previous Seat Record fetched successfully"))
});

const setStrength = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const {prog_name, year, stud_strength} = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await setStrengthService(u_id,prog_name, year, stud_strength);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Student Strength data fetched successfully"))
});

const getStrengthCount = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const {prog_name, year} = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await getStrengthCountService(u_id, prog_name, year);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Student Strength Count fetched successfully"))
});

const getStrengthRecord = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const {prog_name} = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await getStrengthRecordService(u_id, prog_name);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Previous Student Strength Record fetched successfully"))
});

const deleteSeatRecord = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const { prog_name, year } = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await deleteSeatRecordService(u_id, prog_name, year);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Seat record deleted successfully"))
});

const deleteStrengthRecord = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const { prog_name, year } = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await deleteStrengthRecordService(u_id, prog_name, year);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Strength record deleted successfully"))
});


export { setSeats, getSeatRecord, getprogramfromtype, setStrength, getStrengthCount, getStrengthRecord, deleteSeatRecord, deleteStrengthRecord };
