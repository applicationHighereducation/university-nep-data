import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { getProgramIdService, getTotalProgramsService, getUniByNameService,insert3yearBachelorProgramsService,insertUGProgramWithFlexibilityService,insert4yearIntegratedDegreeProgramService,insertBvocProgramsService, insertProgramsService, insertRegulatingProgramsService, setCCFUGPService, set_section_3Service, set_section_4Service, set_section_5Service,set_section_6Service,set_section_7Service,set_section_8Service, insert4yearBachelorProgramService, insert4yearHonourProgramService, insert5yearIntegratedDegreeProgramService } from '../models/ugFormModel.js';


const getTotalPrograms = asyncHandler(async (req, res) => {
   const  {u_id}  = req.user;
    if (!u_id) {
        throw new ApiError(401, "User not authenticated");
    }
    const totalPrograms = await getTotalProgramsService(u_id);
    return res.status(200).json(
        new ApiResponse(200, totalPrograms, "Total programs fetched successfully"))
});


const getUniByName = asyncHandler(async(req,res) => {
  const {u_id} = req.user
   if (!u_id) {
        throw new ApiError(401, "User not authenticated");
    }
    const uniName = await getUniByNameService(u_id)
    if(!uniName){
      throw new ApiError(500,uniName, 'University Name could not be fetched')
    }
    return res.status(200).json(
      new ApiResponse(200, uniName, 'University Name fetched')
    )
})

const setCCFUGP = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  const { isFollowed, count } = req.body;

  if (!u_id) {
    throw new ApiError(401, "User not authenticated");
  }

  let ccfugpData;

  if (isFollowed === true) {
    ccfugpData = await setCCFUGPService(u_id, true, count);
  } else {
    ccfugpData = await setCCFUGPService(u_id, false, 0);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ccfugpData, "UGC_CCFUGP status updated successfully"));
});

const getProgramId = asyncHandler(async(req,res) => {
  const {names} = req.body
  if(!names){
    throw new ApiError(400, 'Enter names')
  }
  
  const data = await getProgramIdService(names)
  if(!data){
    throw new ApiError(500, 'Couldnt fetch data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Program details fetched.')
  )
})

const insertProgram = asyncHandler(async(req,res) => {
  const {u_id} = req.user
  const {programIds} = req.body
  if(!programIds){
    throw new ApiError(400, "Provide Program IDs")
  }

  const data = await insertProgramsService(u_id,programIds)
  if(data.length === 0){
    throw new ApiError(500, 'Error while posting data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Programs inserted successfully')
  )
})

const insertRegulatingProgram = asyncHandler(async(req,res) => {
  const {u_id} = req.user
  const {programIds} = req.body
  if(!programIds){
    throw new ApiError(400, "Provide Program IDs")
  }

  const data = await insertRegulatingProgramsService(u_id,programIds)
  if(data.length === 0){
    throw new ApiError(500, 'Error while posting data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Programs inserted successfully')
  )
})

const setSection3 = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const { count_regulating,count_others } = req.body;
    if (!u_id) {
        throw new ApiError(401, "User not authenticated");
    }
    const result = await set_section_3Service(u_id, count_regulating,count_others);
    return res.status(200).json(
        new ApiResponse(200, result, "Regulating council count set successfully"))
});

const setSection4 = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const { count_non_bvoc,count_bvoc } = req.body;
    if (!u_id) {
        throw new ApiError(401, "User not authenticated");
    }
    const result = await set_section_4Service(u_id, count_non_bvoc,count_bvoc);
    return res.status(200).json(
        new ApiResponse(200, result, "Regulating council count set successfully"))
});



const setSection5 = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const { count_bach,count_honor } = req.body;
    if (!u_id) {
        throw new ApiError(401, "User not authenticated");
    }
    const result = await set_section_5Service(u_id, count_bach,count_honor);
    return res.status(200).json(
        new ApiResponse(200, result, "Regulating council count set successfully"))
});

const setSection6 = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const { count_ITEP, ITEP_level, count_4year_integrated, count_PhD_after4years } = req.body;
    if (!u_id) {
        throw new ApiError(401, "User not authenticated");
    }
    const result = await set_section_6Service(u_id,count_ITEP, ITEP_level, count_4year_integrated, count_PhD_after4years);
    return res.status(200).json(
        new ApiResponse(200, result, "Regulating council count set successfully"))
});

const setSection7 = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const { count_5years_integrated} = req.body;
    if (!u_id) {
        throw new ApiError(401, "User not authenticated");
    }
    const result = await set_section_7Service(u_id,count_5years_integrated);
    return res.status(200).json(
        new ApiResponse(200, result, "Regulating council count set successfully"))
});

const setSection8 = asyncHandler(async (req, res) => {
    const {u_id} = req.user;
    const {count_ordinance,count_actual} = req.body;
    if (!u_id) {
        throw new ApiError(401, "User not authenticated");
    }
    const result = await set_section_8Service(u_id,count_ordinance,count_actual);
    return res.status(200).json(
        new ApiResponse(200, result, "Regulating council count set successfully"))
});

const insert3yearBachelorProgram = asyncHandler(async (req, res) => {
    const {u_id} = req.user
  const {programIds} = req.body
  if(!programIds){
    throw new ApiError(400, "Provide Program IDs")
  }

  const data = await insert3yearBachelorProgramsService(u_id,programIds)
  if(data.length === 0){
    throw new ApiError(500, 'Error while posting data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Programs inserted successfully')
  )
});

const insertBvocProgram = asyncHandler(async (req, res) => {
    const {u_id} = req.user
  const {programIds} = req.body
  if(!programIds){
    throw new ApiError(400, "Provide Program IDs")
  }

  const data = await insertBvocProgramsService(u_id,programIds)
  if(data.length === 0){
    throw new ApiError(500, 'Error while posting data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Programs inserted successfully')
  )
});

const insert4yearBachelorProgram = asyncHandler(async (req, res) => {
    const {u_id} = req.user
  const {programIds} = req.body
  if(!programIds){
    throw new ApiError(400, "Provide Program IDs")
  }

  const data = await insert4yearBachelorProgramService(u_id,programIds)
  if(data.length === 0){
    throw new ApiError(500, 'Error while posting data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Programs inserted successfully')
  )
});

const insert4yearHonourProgram = asyncHandler(async (req, res) => {
    const {u_id} = req.user
  const {programIds} = req.body
  if(!programIds){
    throw new ApiError(400, "Provide Program IDs")
  }

  const data = await insert4yearHonourProgramService(u_id,programIds)
  if(data.length === 0){
    throw new ApiError(500, 'Error while posting data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Programs inserted successfully')
  )
});

const insert4yearIntegratedDegreeProgram = asyncHandler(async (req, res) => {
    const {u_id} = req.user
  const {programIds} = req.body
  if(!programIds){
    throw new ApiError(400, "Provide Program IDs")
  }

  const data = await insert4yearIntegratedDegreeProgramService(u_id,programIds)
  if(data.length === 0){
    throw new ApiError(500, 'Error while posting data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Programs inserted successfully')
  )
});

const insert5yearIntegratedDegreeProgram = asyncHandler(async (req, res) => {
    const {u_id} = req.user
  const {programIds} = req.body
  if(!programIds){
    throw new ApiError(400, "Provide Program IDs")
  }

  const data = await insert5yearIntegratedDegreeProgramService(u_id,programIds)
  if(data.length === 0){
    throw new ApiError(500, 'Error while posting data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Programs inserted successfully')
  )
});

const insertUGProgramWithFlexibility = asyncHandler(async (req, res) => {
    const {u_id} = req.user
  const {programIds} = req.body
  if(!programIds){
    throw new ApiError(400, "Provide Program IDs")
  }

  const data = await insertUGProgramWithFlexibilityService(u_id,programIds)
  if(data.length === 0){
    throw new ApiError(500, 'Error while posting data')
  }

  return res.status(200).json(
    new ApiResponse(200,data,'Programs inserted successfully')
  )
});

export {
  getTotalPrograms,
  getUniByName,
  setCCFUGP,
  getProgramId,
  insertProgram,
  insertRegulatingProgram,
  setSection3,
  setSection4,
  setSection5,
  setSection6,
  setSection7,
  setSection8,
  insert3yearBachelorProgram,
  insertBvocProgram,
  insert4yearBachelorProgram,
  insert4yearHonourProgram,
  insert4yearIntegratedDegreeProgram,
  insert5yearIntegratedDegreeProgram,
  insertUGProgramWithFlexibility
}