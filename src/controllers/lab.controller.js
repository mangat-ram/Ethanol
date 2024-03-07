import { Lab } from "../models/lab.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createLab = asyncHandler(async(req,res) => {
  const { labName } = req.body;
  if(!labName){
    throw new ApiError(400,"Lab Name is required!!!")
  }
  const userId = req.user._id;
  const lab = new Lab({
    labName,
    labMaker:userId
  }) 

  await lab.save()

  return res
  .status(201)
  .json(
    new ApiResponse(200,lab,"Lab created Successfully.")
  )
})

const updateLabname = asyncHandler(async(req, res) => {
  const { newLabname } = req.body;
  const userId = req.user._id;
  const userName = req.user.userName
  console.log(userId);
  console.log(userName);
  // const lab = await Lab.aggregate(
  //   [
  //     {
  //       $match:{
  //         labMaker:userId,

  //       }
  //     }
  //   ]
  // )
})

export{
  createLab,
  updateLabname
}