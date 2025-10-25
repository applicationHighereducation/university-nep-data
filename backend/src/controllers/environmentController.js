import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { setSection1Service, getSection1Service, getprogramfromtypeService, getProgramWithoutEnvironmentService, deleteCourseService } from '../models/environmentModel.js';

const setSection1 = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const { prog_name, course_name, assessment_weight } = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await setSection1Service(u_id, prog_name, course_name, assessment_weight); 
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Environment Section 1 data saved successfully"));
});

const getSection1 = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const {prog_name} = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await getSection1Service(u_id, prog_name) 
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Environment Section 1 data fetched successfully"));
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

const getProgramWithoutEnvironment = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await getProgramWithoutEnvironmentService(u_id);
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Programs without environment data fetched successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const { prog_name, course_name } = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await deleteCourseService(u_id, prog_name, course_name);
    return res
        .status(200)
        .json(new ApiResponse(200,result, "Course deleted successfully"));
});
export {
    setSection1,
    getSection1,
    getprogramfromtype,
    getProgramWithoutEnvironment,
    deleteCourse
};
