import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { getTotalProgramsService , setSection1Service , getProgramIdService , setSection2Service , setSection3Service , insertpgCCFUGPService , insertpgOtherThanCCFUGPService , insertRegulatingProgramsService , insert2YearpgService , insert1YearpgService , insert5YearIntegratedpgService} from '../models/pgFormModel.js';
import { getPGProgramsService } from '../models/pgFormModel.js';

const getTotalPrograms = asyncHandler(async (req, res) => {
   const  {u_id}  = req.user;
    if (!u_id) {
        throw new ApiError(401, "User not authenticated");
    }
    const totalPrograms = await getTotalProgramsService(u_id);
    return res.status(200).json(
        new ApiResponse(200, totalPrograms, "Total programs fetched successfully"))
});

const getPGPrograms = asyncHandler(async(req,res) => {
  const {u_id} = req.user
  const programs = await getPGProgramsService(u_id)
  return res.status(200).json(
    new ApiResponse(200,programs,'PG Programs fetched successfully')
  )
});

const getProgramId = asyncHandler(async (req, res) => {
  const { names } = req.body;
  if (!names) throw new ApiError(400, 'Enter names');
    
  const data = await getProgramIdService(names);
  if (!data) throw new ApiError(500, 'Couldnt fetch data');

  return res.status(200).json(new ApiResponse(200, data, 'Program details fetched.'));
});

const setSection1 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  const { isFollowed, count_ccfpp, pg_other_count} = req.body;
  if (!u_id) throw new ApiError(401, 'User not authenticated');

  const ccfppData = await setSection1Service(u_id, isFollowed, isFollowed ? count_ccfpp : 0, isFollowed ? pg_other_count : 0 );
  return res
    .status(200)
    .json(new ApiResponse(200, ccfppData, 'UGC CCFPP status updated successfully'));
});

const setSection2 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  const { count_regulating, count_2year } = req.body;
  if (!u_id) throw new ApiError(401, 'User not authenticated');

  const result = await setSection2Service(u_id, count_regulating, count_2year);
  return res.status(200).json(new ApiResponse(200, result, 'Regulating council count set successfully'));
});

const setSection3 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  const { count_1year, count_5year_integrated } = req.body;
  if (!u_id) throw new ApiError(401, 'User not authenticated');

  const result = await setSection3Service(u_id, count_1year, count_5year_integrated);
  return res.status(200).json(new ApiResponse(200, result, 'Regulating council count set successfully'));
});


const handleInsertPrograms = (insertService) =>
  asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const { programIds } = req.body;

    if (!u_id) throw new ApiError(401, 'User not authenticated');
    if (!programIds) throw new ApiError(400, 'Provide Program IDs');

    const data = await insertService(u_id, programIds);

    if (!data || data.length === 0) {
      throw new ApiError(500, 'Error while posting data');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, data, 'Programs inserted successfully'));
  });

    const insertpgCCFFP = handleInsertPrograms(insertpgCCFUGPService);
    const insertpgOtherThanCCFUGP = handleInsertPrograms(insertpgOtherThanCCFUGPService);
    const insertRegulatingProgram = handleInsertPrograms(insertRegulatingProgramsService);
    const insert2Yearpg = handleInsertPrograms(insert2YearpgService);
    const insert1Yearpg = handleInsertPrograms(insert1YearpgService);
    const insert5YearIntegratedpg = handleInsertPrograms(insert5YearIntegratedpgService);

export { getTotalPrograms , getProgramId , setSection1 , setSection2 , setSection3 , insertpgCCFFP , insertpgOtherThanCCFUGP , insertRegulatingProgram , insert2Yearpg , insert1Yearpg , insert5YearIntegratedpg, getPGPrograms};
