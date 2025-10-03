import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createFacultyService,
  deleteFacultyService,
  getAllFacultyService,
  getFacultyByIdService,
  getFacultyIdByNameService,
} from "../models/facultyModel.js";


const createFaculty = asyncHandler(async (req, res) => {
  const u_id = req.user.u_id
  const { name } = req.body;

  if (!u_id || !name || name.trim() === "") {
    throw new ApiError(400, "User ID (u_id) and faculty name are required");
  }

  const newFacultyMember = await createFacultyService(u_id, name);
  console.log(newFacultyMember)

  if (!newFacultyMember) {
    throw new ApiError(500, "Something went wrong while creating the faculty member");
  }

  return res.status(201).json(
    new ApiResponse(201, newFacultyMember, "Faculty member created successfully")
  );
});


const getAllFaculty = asyncHandler(async (req, res) => {
  // MODIFIED: Get u_id from the authenticated user and pass to the service
  const u_id = req.user?.u_id; 

  if (!u_id) {
    // This assumes verifyJWT middleware is active and attaches user object
    throw new ApiError(401, "User not authenticated");
  }

  const facultyList = await getAllFacultyService(u_id);

  return res.status(200).json(
    new ApiResponse(200, facultyList, "Faculty members fetched successfully")
  );
});

const getFacultyIdByName = asyncHandler(async(req,res) => {
  const {name} = req.body

  if(!name){
    throw new ApiError(400, 'Please enter faculty name')
  }

  const facultyId = await getFacultyIdByNameService(name)
  if(!facultyId){
    throw new ApiError(500, 'Error while fetching faculty id')
  }

  return res.status(200).json(
    new ApiResponse(200, facultyId, 'Faculty Id fetched successfully')
  )
})

const deleteFaculty = asyncHandler(async (req, res) => {
  const { f_id } = req.params;

  if (!f_id) {
    throw new ApiError(400, "Faculty ID (f_id) is required");
  }

  const deletedFaculty = await deleteFacultyService(f_id);

  if (!deletedFaculty) {
    throw new ApiError(404, "Faculty member not found or already deleted");
  }

  return res.status(200).json(
    new ApiResponse(200, deletedFaculty, "Faculty member deleted successfully")
  );
});


const getFacultyById = asyncHandler(async (req, res) => {
  const { f_id } = req.params;
  console.log(f_id)

  if (!f_id) {
    throw new ApiError(400, "Faculty ID (f_id) is required");
  }

  const facultyMember = await getFacultyByIdService(f_id);

  if (!facultyMember) {
    throw new ApiError(404, "Faculty member not found");
  }

  return res.status(200).json(
    new ApiResponse(200, facultyMember, "Faculty member fetched successfully")
  );
});

export {
  createFaculty,
  getAllFaculty,
  deleteFaculty,
  getFacultyById,
  getFacultyIdByName
};