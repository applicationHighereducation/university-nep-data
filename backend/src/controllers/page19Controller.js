import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { setSection19Service, getSection19Service } from '../models/page19Model.js';

const setSection19 = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const { mou_research_count, active_mou_count, signed_inactive_2yr_count, faculty_exchange_count, mou_labusage_count, interdisc_center_count, ongoing_interdisc_research_count } = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
     const result = await setSection19Service(u_id, mou_research_count, active_mou_count, signed_inactive_2yr_count, faculty_exchange_count, mou_labusage_count, interdisc_center_count, ongoing_interdisc_research_count ); 
    return res
        .status(200)
        .json(new ApiResponse(200, "Page 19 Section data saved successfully"));
});

const getSection19 = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
     const result = await getSection19Service(u_id); 
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Page 19 Section data fetched successfully"));
});

export {
    setSection19,
    getSection19
};
