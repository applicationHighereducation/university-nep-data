import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createDepartmentService,
  deleteDepartmentService,
  getAllDepartmentsService,
  getDepartmentByIdService,
  getDepartmentCountService
} from "../models/deptModel.js";
import { getFacultyByNameAndUniversityService } from "../models/facultyModel.js";
import { getDepartmentIdByName } from "../models/deptModel.js";


//here name is faculty name
const createDepartment = asyncHandler(async (req, res) => {
  const {u_id} = req.user;
  const { name, dept_name } = req.body;

  if (!u_id || !name || !dept_name?.trim()) {
    throw new ApiError(400, "University ID, faculty name, and department name are required.");
  }

  // Find the faculty's ID using its name and the university ID.
  
  const faculty = await getFacultyByNameAndUniversityService(name, u_id);

  if (!faculty) {
    throw new ApiError(404, `Faculty '${name}' could not be found for the specified university.`);
  }

  const newDepartment = await createDepartmentService(dept_name.trim(), u_id, faculty.f_id);

  if (!newDepartment) {
      throw new ApiError(500, "Something went wrong while creating the department.");
  }

  return res.status(201).json(
    new ApiResponse(201, newDepartment, "Department created successfully")
  );
});

const getAllDepartments = asyncHandler(async (req, res) => {
  const departmentList = await getAllDepartmentsService();
  return res.status(200).json(
    new ApiResponse(200, departmentList, "All departments fetched successfully")
  );
});

const getDepartmentByName = asyncHandler(async(req,res) => {
  const {name} = req.body
  const data = await getDepartmentIdByName(name)
  return res.status(200).json(
    new ApiResponse(200,data,'Department Id fetched successfully')
  )
})

const getDepartmentById = asyncHandler(async (req, res) => {
    const {f_id} = req.params;
    if (!f_id) {
        throw new ApiError(400, "Department ID is required");
    }

    const department = await getDepartmentByIdService(f_id);
    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    return res.status(200).json(
        new ApiResponse(200, department, "Department fetched successfully")
    );
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const { d_id } = req.params;
  if (!d_id) {
    throw new ApiError(400, "Department ID (d_id) is required");
  }

  const deletedDept = await deleteDepartmentService(d_id);
  if (!deletedDept) {
    throw new ApiError(404, "Department not found or already deleted");
  }

  return res.status(200).json(
    new ApiResponse(200, deletedDept, "Department deleted successfully")
  );
});

const getDepartmentCount = asyncHandler(async(req,res) => {
  const {u_id} = req.user
  const {f_id} = req.body
  if(!f_id){
    throw new ApiError(400, 'Faculty ID is mandatory')
  }
  const count = await getDepartmentCountService(f_id,u_id)
  if(!count){
    throw new ApiError(500, 'Failed to fetch count')
  }
  return res.status(200).json(
    new ApiResponse(200, count, 'Count fetched successfully')
  )
})


export {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  deleteDepartment,
  getDepartmentCount,
  getDepartmentByName
};