import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import {uploadAddressService, uploadContactService, uploadRegistrarInfoService, uploadUniNameService, uploadVcInfoService, getUniByIdService } from "../models/universityFormModel.js";

const uploadUniversityName = asyncHandler(async(req,res) => {
  const uniId = req.user?.u_id
  const {uniName} = req.body
  if(!uniId){
    throw new ApiError(400, 'No university Id found')
  }
  if(!uniName){
    throw new ApiError(400, 'Please enter university name')
  }

  const user = await uploadUniNameService(uniName,uniId)
  if(!user){
    throw new ApiError(500, 'Error while uploading')
  }

  return res.status(200).json(
    new ApiResponse(200,user,'University name added to db successfully')
  )
})

const uploadAddress = asyncHandler(async(req,res) => {
  const uniId = req.user?.u_id
  const {street,city,state,pincode} = req.body

  if(!uniId){
    throw new ApiError(400, 'No university Id found')
  }

  if ([street, city, state, pincode].some((field) => String(field || "").trim() === "")) {
  throw new ApiError(400, "All Address Details are mandatory");
  }

  const addressData = await uploadAddressService(uniId,street,city,state,pincode)
  if(!addressData){
    throw new ApiError(500, 'Error while uploading address details')
  }

  return res.status(200).json(
    new ApiResponse(200,addressData,'University address added to db successfully')
  )

})


const uploadContactInfo = asyncHandler(async(req,res) => {
  const uniId = req.user.u_id
  const {phone,website} = req.body

  if(!uniId){
    throw new ApiError(400, 'No university Id found')
  }

  if(!phone || !website){
    throw new ApiError(400 , 'All fields are mandatory')
  }

  const data = await uploadContactService(uniId,phone,website)
  if(!data){
    throw new ApiError(500, 'Error while uploading contact details')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'University contact added to db successfully')
  )
})

const uploadVcInfo = asyncHandler(async(req,res) => {
  const uniId = req.user.u_id
  const {name,mobile,email} = req.body

  if(!uniId){
    throw new ApiError(400, 'No university Id found')
  }

  if(!name || !mobile || !email){
    throw new ApiError(400 , 'All fields are mandatory')
  }

  const data = await uploadVcInfoService(uniId,name,mobile,email)
  if(!data){
    throw new ApiError(500, 'Error while uploading vc details')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'University VC added to db successfully')
  )
})

const uploadRegistrarInfo = asyncHandler(async(req,res) => {
  const uniId = req.user.u_id
  const {name,mobile,email} = req.body

  if(!uniId){
    throw new ApiError(400, 'No university Id found')
  }

  if(!name || !mobile || !email){
    throw new ApiError(400 , 'All fields are mandatory')
  }

  const data = await uploadRegistrarInfoService(uniId,name,mobile,email)
  if(!data){
    throw new ApiError(500, 'Error while uploading vc details')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'University VC added to db successfully')
  )
})

const getUniById = asyncHandler(async(req,res) => {
  const id = req.user.u_id
  const data = await getUniByIdService(id)
  if(!data){
    throw new ApiError(500, 'Error while uploading vc details')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'University Data fetched successfully')
  )

})


export {
  uploadUniversityName,
  uploadAddress,
  uploadContactInfo,
  uploadVcInfo,
  uploadRegistrarInfo,
  getUniById
}