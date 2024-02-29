import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
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

const registerUser = asyncHandler(async (req,res) => {
  const { userName, name, email, passWord} = req.body;

  if([userName,name,email,passWord].some((field) => {
    return field?.trim() === ""
  })){
    throw new ApiError(400,"All Fields are Required!!!")
  }

  const existedUser = User.findOne({
    $or:[
      {userName},
      {email}
    ]
  })

  if(existedUser){
    throw new ApiError(409,"User with email or username already exists!!")
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    name,
    email,
    passWord
  })

  const createdUser = await User.findById(user._id).select(
    "-passWord -refreshToken"
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, passWord } = req.body;

  if (!(username || email)){
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

export {
  generateAccessAndRefreshTokens,
  registerUser,
  loginUser,
  logoutUser
}