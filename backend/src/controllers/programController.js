import { getDepartmentByDepartmentId, getDepartmentByIdService } from "../models/deptModel.js";
import { getFacultyByIdService } from "../models/facultyModel.js";
import { getProgramTypeByIdService } from "../models/programDataModel.js";
import { createNewProgramService, getAllProgramsByDepartmentService, deleteProgramService, getUGProgramsService } from "../models/programModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getDepartmentById } from "./deptController.js";
import { getFacultyById } from "./facultyController.js";
import { getProgramTypeById } from "./programDataController.js";


const createNewProgram = asyncHandler(async(req,res) => {
  const {u_id} = req.user
  const {f_id,d_id,name,duration,pt_id} = req.body

   if ([f_id, d_id, pt_id, name, duration].some(field => !field || field.toString().trim() === '')) {
    throw new ApiError(400, 'All details are mandatory');
  }

const createdProgram = await createNewProgramService(u_id,f_id,d_id,name,duration,pt_id)
if(createdProgram.length === 0){
  throw new ApiError(500, 'Error while creating program')
}

return res.status(200).json(
  new ApiResponse(200, createdProgram, 'Program created successfully')
)
})

const getProgramByDepartment = asyncHandler(async (req, res) => {
  const { d_id } = req.body;

  if (!d_id) {
    throw new ApiError(400, "Department id is required");
  }

  const programs = await getAllProgramsByDepartmentService(d_id);

  if (!programs || programs.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, [], "No programs found for this department")
    );
  }

  // Fetch related names
  const result = await Promise.all(
    programs.map(async (prog) => {
      const faculty = await getFacultyByIdService(prog.f_id);
      const department = await getDepartmentByDepartmentId(prog.d_id);
      const programType = await getProgramTypeByIdService(prog.pt_id);

      return {
        ...prog,
        faculty_name: faculty?.name || "Unknown",
        department_name: department?.dept_name || "Unknown",
        program_type: programType?.pt_name || "Unknown"
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, result, "Programs fetched successfully")
  );
});

const deleteProgram = asyncHandler(async(req,res) => {
  const {p_id} = req.params
  if(!p_id){
    throw new ApiError(400, 'Program ID not found')
  }
  const data = await deleteProgramService(p_id)
  if(!data){
    throw new ApiError(500, 'Couldnt delete program')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Program deleted successfully')
  )
})

const getUGPrograms = asyncHandler(async(req,res) => {
  const pt_id = 1
  const {u_id} = req.user
  const programs = await getUGProgramsService(pt_id,u_id) 
  if(!programs){
    throw new ApiError(500, 'Failed to fetch programs')
  }
  return res.status(200).json(
    new ApiResponse(200, programs, 'Programs fetched successfully')
  )
})


export {
  createNewProgram,
  getProgramByDepartment,
  deleteProgram,
  getUGPrograms
}
