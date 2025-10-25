import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import { setSection1Service, getSection1Service, setSection2Service, getSection2Service } from '../models/page17Model.js';

const setSection1 = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const { proj_morethan10cr_count, proj_between1to10cr_count, proj_between50lto1cr_count, proj_between10lto50l_count, proj_lessthan10l_count } = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
     const result = await setSection1Service(u_id, proj_morethan10cr_count, proj_between1to10cr_count, proj_between50lto1cr_count, proj_between10lto50l_count, proj_lessthan10l_count );
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Page 17 Section 1 data saved successfully"));
});

const getSection1 = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await getSection1Service(u_id);
    if (!result) throw new ApiError(404, 'Page 17 Section 1 data not found');
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Page 17 Section 1 data fetched successfully"));
});

const setSection2 = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    const { industry_funded_proj_count, ngo_funded_proj_count, sci_paper_count, esci_paper_count, scopus_paper_count, q1_count, q2_count, q3_count, q4_count, peer_reviewed_count, institute_hindex } = req.body;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await setSection2Service(u_id, industry_funded_proj_count, ngo_funded_proj_count, sci_paper_count, esci_paper_count, scopus_paper_count, q1_count, q2_count, q3_count, q4_count, peer_reviewed_count, institute_hindex );
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Page 17 Section 2 data saved successfully"));
});

const getSection2 = asyncHandler(async (req, res) => {
    const { u_id } = req.user;
    if (!u_id) throw new ApiError(401, 'User not authenticated');
    const result = await getSection2Service(u_id);
    if (!result) throw new ApiError(404, 'Page 17 Section 2 data not found');
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Page 17 Section 2 data fetched successfully"));
});

export {
    setSection1,
    getSection1,
    setSection2,
    getSection2
};
