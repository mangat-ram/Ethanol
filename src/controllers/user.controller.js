import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try{
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false})

    return { accessToken, refreshToken }
  }catch(err){
    throw new ApiError(500,"Something went wrong while generating access or refresh Tokens!!")
  }
}

const checkUniqueUser = asyncHandler(async (req,res) => {
  const {userName} = req.params
  const user = await User.findOne({userName})
  if(user){
    return res
      .status(201)
      .json(
        new ApiResponse(200, {}, "Username is already Taken.")
      )
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200,{},"Username is available.")
    )
})

const registerUser = asyncHandler(async (req,res) => {
  const { userName, name, email, passWord} = req.body;

  if([userName,name,email,passWord].some((field) => {
    return field?.trim() === ""
  })){
    throw new ApiError(400,"All Fields are Required!!!")
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }, { verifyCode:true}]
  })

  if(existedUser){
    throw new ApiError(409,"User with email or username already exists!!")
  }

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
  const verifyCodeExpiry = new Date();
  verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)

  const user = await User.create({
    userName: userName.toLowerCase(),
    name,
    email,
    passWord,
    verifyCode,
    verifyCodeExpiry,
    isVerified:false
  })

  const createdUser = await User.findById(user._id).select(
    "-passWord -refreshToken -verifyCode -verifyCodeExpiry"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering User!")
  }

  return res
  .status(201)
  .json(
    new ApiResponse(200,createdUser,"User Registred Successfully.")
  )
})

const verifyEmail = asyncHandler(async (req,res) => {
  const { username,code } = req.body
  const decodedUsername = decodeURIComponent(username);
  const user = await User.findOne({userName:decodedUsername})
  if(!user){
    return res
      .status(404)
      .json(
        new ApiResponse(404,{},"User not found.")
      )
  }

  const isCodeValid = user.verifyCode === code
  const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

  if(isCodeValid && isCodeNotExpired){
    user.isVerified = true
    await user.save()

    return res
      .status(201)
      .json(
        new ApiResponse(200,{},"User is Verified Successfully.")
      )
  }else if(!isCodeNotExpired){
    return res
      .status(201)
      .json(
        new ApiResponse(200,{},"User not found")
      )
  }else{
    return res
      .status(201)
      .json(
        new ApiResponse(200,{},"Incorrect Verification code!")
      )
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, passWord } = req.body;

  if (!(userName || email)){
    throw new ApiError(400,"email or username Required!")
  }

  const user = await User.findOne({
    $or :[
      {userName},
      {email}
    ]
  })

  if(!user){
    throw new ApiError(404,"User does not exists!!")
  }

  const isPasswordValid = await user.isPasswordCorrect(passWord);
  if(!isPasswordValid){
    throw new ApiError(401,"Password incorrect!!")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select(
    "-passWord -refreshToken"
  )

  const options = {
    httpOnly :true,
    secure :true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {user: loggedInUser,accessToken,refreshToken},
      "User Logged In Successfully."
    )
  )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )

  const options = {
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,{},"User Logged Out.")
  )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized Request!")
  }

  try{
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)
    if(!user){
      throw new ApiError(401,"Invalid Refresh Token!!")
    }

    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,"Refresh Token is expired!")
    }

    const options = {
      httpOnly:true,
      secure:true
    }

    const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken", newrefreshToken,options)
      .json(
        new ApiResponse(
          200,
          {accessToken,newrefreshToken},
          "Access Token Refreshed Successfully."
        )
      )
  }catch(err){
    throw new ApiError(401,err?.message || "Invalid Refresh Token Catched!!")
  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?._id;

  // Find the user by ID
  const user = await User.findById(userId);

  // Check if the old password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password!");
  }

  // Update the user's password
  user.passWord = newPassword; // Update the password field directly

  // Save the user with the new password
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully."));
});


const getCurrentUser = asyncHandler(async(req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(200,req.user,"Current User Fetched Successfully."))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { userName, name, email } = req.body;
  if (!userName && !name && !email) {
    throw new ApiError(400, "At least one field is required to update!");
  }

  const updateFields = {};
  if (userName) updateFields.userName = userName;
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true }
  ).select("-passWord");

  return res
    .status(201)
    .json(new ApiResponse(200, user, "Account Details updated Successfully."));
});


export {
  generateAccessAndRefreshTokens,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  checkUniqueUser,
  verifyEmail
}