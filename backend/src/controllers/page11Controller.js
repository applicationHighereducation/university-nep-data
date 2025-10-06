import { insertDataService, fetchDataService } from "../models/page11Model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const insertData = asyncHandler(async(req,res) => {
  const {u_id} = req.user
  const {total,registeredStudents,uploadedStudents,moocCnt,moocManualCnt} = req.body
  if(!total || !registeredStudents || !uploadedStudents || !moocCnt || !moocManualCnt){
    throw new ApiError(400, 'All data is mandatory')
  }
  const insertedData = await insertDataService(u_id,total,registeredStudents,uploadedStudents,moocCnt,moocManualCnt)

  return res.status(200).json(
    new ApiResponse(200, insertedData, 'Data inserted successfully')
  )
})

const fetchData = asyncHandler(async(req,res) => {
  const {u_id} = req.user
  const data = await fetchDataService(u_id)
  return res.status(200).json(
    new ApiResponse(200,data,'Data fetched successfully')
  )
})

export {
  insertData,
  fetchData
}