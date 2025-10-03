import pool from "../config/db.js";
import { createProgramService, getProgramTypeByIdService, getProgramTypeIdByName } from "../models/programDataModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



const getAllPrograms = asyncHandler(async(req,res) => {
  const result = await pool.query('SELECT * FROM program_type')
  const programs = result.rows

  return res.status(200).json(
    new ApiResponse(200, programs, 'Programs fetched successfully')
  )
})

const createNewProgram = asyncHandler(async(req,res) => {
  const {name} = req.body
  if(!name){
    throw new ApiError(400, 'Name is mandatory')
  }

  const result = await createProgramService(name)
  if(!result){
    throw new ApiError(500, 'Error while creating program')
  }

  return res.status(200).json(
    new ApiResponse(200, result, 'Program added successfully')
  )

})

const getProgramTypeByName = asyncHandler(async(req,res) => {
  const {pt_name} = req.body
  if(!pt_name){
    throw new ApiError(400, 'Name is mandatory')
  }

  const data = await getProgramTypeIdByName(pt_name)
  if(!data){
    throw new ApiError(500, 'Failed to fetch id')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'ID fetched successfully')
  )
})

const getProgramTypeById = asyncHandler(async(req,res) => {
  const {pt_id} = req.body
  const data = await getProgramTypeByIdService(pt_id)
  return res.status(200).json(
    new ApiResponse(200,data,'Program name fetched successfully')
  )
})
export {
  getAllPrograms,
  createNewProgram,
  getProgramTypeByName,
  getProgramTypeById
}
