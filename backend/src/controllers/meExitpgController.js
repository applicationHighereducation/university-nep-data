import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { setSection1Service, getSection1Service } from '../models/meExitpgModel.js';

const setSection1 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  const { pg_appear_1yr_count, pg_exit_1yr_percent, pg_enter_2yr_after4yrhonour_count, pg_enter_2yr_afterexit_count } = req.body;
  if (!u_id) throw new ApiError(401, 'User not authenticated');

  const result = await setSection1Service(u_id, pg_appear_1yr_count, pg_exit_1yr_percent, pg_enter_2yr_after4yrhonour_count, pg_enter_2yr_afterexit_count);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "ME Exit PG details updated successfully"));

});


const getSection1 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  if (!u_id) throw new ApiError(401, 'User not authenticated');
  const result = await getSection1Service(u_id);
  if (!result) throw new ApiError(404, 'ME Exit UG details not found');
  return res
    .status(200)
    .json(new ApiResponse(200, result, "ME Exit UG details fetched successfully"));
});



export { setSection1,getSection1};

