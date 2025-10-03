import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


export const verifyJWT = asyncHandler(async(req,res,next) => {
try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
      throw new ApiError(401, "Unauthorized Request")
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
    const result = await pool.query('SELECT email,username,id,u_id FROM users WHERE id = $1', [decodedToken?.id])
    const user = result.rows[0]
  
    if(!user){
      throw new ApiError(400 , 'Invalid Access Token')
    }
  
    req.user = user;
    next();
} catch (error) {
  throw new ApiError(500, error.message)
}
})