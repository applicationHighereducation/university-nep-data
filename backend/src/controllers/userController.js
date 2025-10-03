import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from 'bcrypt'
import pool from "../config/db.js";
import { createUserService, deleteUserService, getAllUsersService, generateRefreshToken, generateAccessToken, loginService, isPasswordValid, selectMaxUniId } from "../models/userModel.js";
import { generateOtp, hashOtp } from "../utils/generateOtp.js";
import nodemailer from 'nodemailer'


const sendOtpEmail = async(toEmail,otp) => {
  const transporter = nodemailer.createTransport({
    service : 'Gmail',
    auth : {
      user : process.env.EMAIL_USER,
      pass : process.env.EMAIL_PASS
    }
  });

  
  const mailOptions = {
    from : `"University Data" ${process.env.EMAIL_USER}`,
    to: toEmail,
    subject : 'Your OTP code',
    text: `Your otp is ${otp}. It will expire in 10 minutes`,
    html: `<p>Your OTP is: <b>${otp}</b></p><p>It will expire in 10 minutes.</p>`,
  }

  await transporter.sendMail(mailOptions);
}

const generateTokens = async(userId) => {
  try {
    const result = await pool.query('SELECT id,email FROM users WHERE id = $1', [userId])
    const user = result.rows[0]
    const accessToken = await generateAccessToken(user.email)
    const refreshToken = await generateRefreshToken(user.id)

    await pool.query( 
      "UPDATE users SET token = $1 WHERE id = $2",
      [refreshToken, userId]
    )

    return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500 , error.message)
  }
}

const sendVerificationEmail = asyncHandler(async(req,res)=>{
  const {email,username,password} = req.body
  if(!email || !username || !password){
    throw new ApiError(400, 'All Fields are mandatory')
  }

 
  const generatedOtp = generateOtp();
  const otpExpiry = new Date(Date.now() + 10 *60*1000)
  const hashedOtp = await bcrypt.hash(generatedOtp.toString(), 10)

 const createdUser = await createUserService(email,password,username,hashedOtp,otpExpiry);

  if(!createdUser){
    throw new ApiError(400,'Error while creating user')
  } 

  await sendOtpEmail(email,generatedOtp)

  return res.status(201).json(
    new ApiResponse(201, { email: createdUser.email, username: createdUser.username }, 
      "OTP sent to email. Please verify to complete registration", 'User created successfully')
  )
})

const verifyAndRegister = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, 'Either email or OTP is missing');
  }

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new ApiError(400, 'No user found with this email');
  }

  const user = result.rows[0];

  
  if (user.otp_expiry && new Date(user.otp_expiry) < new Date()) {
    throw new ApiError(400, 'OTP has expired');
  }


  const verifyOtp = await bcrypt.compare(otp.toString(), user.otp);
  if (!verifyOtp) {
    throw new ApiError(400, 'OTP entered is invalid');
  }

  
  await pool.query(
    'UPDATE users SET is_verified = true, otp = null, otp_expiry = null WHERE email = $1',
    [email]
  );

  return res.status(200).json(
    new ApiResponse(200, 'Registration successful and user verified')
  );
});

const login = asyncHandler(async(req,res) => {
  const {email,password} = req.body
  if(!email||!password){
    throw new ApiError(400, 'All fields are mandatory')
  }

  const user = await loginService(email)
  if(!user){
    throw new ApiError(400, 'No user found with this email id')
  }

  const isPasswordCorrect = await isPasswordValid(password,user.password_hash)
  if(!isPasswordCorrect){
    throw new ApiError(400, 'Password is invalid')
  }

  const {accessToken,refreshToken} = await generateTokens(user.id)

  const options = {
    httpOnly : true,
    secure: true,
    sameSite: "None",
  }

  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
    new ApiResponse(200, user, 'User logged in successfully')
  )

})

const checkIfLoggedIn = asyncHandler((req,res) => {
  const userData = req.user
  return res.status(200).json(
    new ApiResponse(200, userData, 'User is logged in')
  )
})

const logOutUser = asyncHandler(async(req,res) => {
  const userId = req.user.id
  const response = await pool.query('UPDATE users SET token = $1 WHERE id = $2', [null,userId])
  if(!response){
    throw new ApiError(500, 'Unknown error occured')
  }
   const options = {
    httpOnly : true,
    secure: true,
    sameSite: "None",
  }

  return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
    new ApiResponse(200, 'User logged out successfully')
  )
})


const deleteUser = asyncHandler(async(req,res)=>{
  const {userId} = req.params
  if(!userId){
    throw new ApiError(400, 'User Id is mandatory')
  }

  const deletedUser = await deleteUserService(userId)
  if(deletedUser){
    throw new ApiError(400, 'Error while deleting user')
  }

  return res.status(200).json(
    new ApiResponse(200, deletedUser, 'User deleted successfully')
  )
})

const getAllUsers = asyncHandler(async(req,res) => {
  const response = await getAllUsersService()
  if(!response){
    throw new ApiError(500,'Error while fetching all users')
  }
  return res.status(200).json(
    new ApiResponse(200, response, 'Users fetched successfully')
  )
})

const getMaxUID = asyncHandler(async (req, res) => {

 const result = await selectMaxUniId(); 
  
  return res.status(200).json(
    new ApiResponse(200, maxId, "Max UID updated/fetched successfully")
  );
});


export {
  sendVerificationEmail,
  verifyAndRegister,
  deleteUser,
  getAllUsers,
  login,
  logOutUser,
  checkIfLoggedIn,
  getMaxUID
}