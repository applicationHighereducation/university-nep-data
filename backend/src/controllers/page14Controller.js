import { insertEntryExitDataService, fetchDataService } from "../models/page14Model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const insertEntryExitData = asyncHandler(async(req,res) => {
  const {u_id} = req.user
  const {entryData,exitData} = req.body
  if(!entryData || !exitData){
    throw new ApiError(400, 'Entry and Exit data is mandatory')
  }
  const insertedData = await insertEntryExitDataService(u_id,exitData,entryData)

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
  insertEntryExitData,
  fetchData
}