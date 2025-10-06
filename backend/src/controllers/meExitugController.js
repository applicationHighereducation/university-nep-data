import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { } from '../models/meExitugModel.js';
import { setSection1Service, setSection2Service, getSection1Service, getSection2Service } from '../models/meExitugModel.js';

const setSection1 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  const { ug_appear_1yr_count, ug_exit_1yr_percent, ug_enter_2yr_count, ug_appear_2yr_count, ug_exit_2yr_percent } = req.body;
  if (!u_id) throw new ApiError(401, 'User not authenticated');

  const result = await setSection1Service(u_id, ug_appear_1yr_count, ug_exit_1yr_percent, ug_enter_2yr_count, ug_appear_2yr_count, ug_exit_2yr_percent);
    return res
    .status(200)
    .json(new ApiResponse(200, result, "ME Exit UG details updated successfully"));

});

const setSection2 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  const { ug_enter_3yr_count, ug_appear_3yr_count, ug_exit_3yr_percent,  ug_enter_4yr_percent} = req.body;
  if (!u_id) throw new ApiError(401, 'User not authenticated');
  const result = await setSection2Service(u_id, ug_enter_3yr_count, ug_appear_3yr_count, ug_exit_3yr_percent,  ug_enter_4yr_percent );
    return res
    .status(200)
    .json(new ApiResponse(200,result, "ME Exit UG details updated successfully"));
  
  });

const getSection1 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  if (!u_id) throw new ApiError(401, 'User not authenticated');
  const result = await getSection1Service(u_id);
  if (!result) throw new ApiError(404, 'ME Exit UG details not found');
  return res
    .status(200)
    .json(new ApiResponse(200,result,"ME Exit UG details fetched successfully"));
});

const getSection2 = asyncHandler(async (req, res) => {
  const { u_id } = req.user;
  if (!u_id) throw new ApiError(401, 'User not authenticated'); 
  const result = await getSection2Service(u_id);
  if (!result) throw new ApiError(404, 'ME Exit UG details not found');
  return res
    .status(200)
    .json(new ApiResponse(200, result, "ME Exit UG details fetched successfully"));
});

export { setSection1, setSection2, getSection1, getSection2 };

