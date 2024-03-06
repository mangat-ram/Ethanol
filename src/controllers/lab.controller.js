import { Lab } from "../models/lab.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createLab = asyncHandler(async(req, res) => {
  console.log(req.user);
  const { labName } = req.body;
  const lab = await Lab.create({labName:labName});
  const userId = req._id;
  const user = await User.updateUserForLabCreation(userId, lab._id);

  if(!labName){
    throw new ApiError(401,"Labname is Required.")
  }

  return res
  .status(201)
  .json(
    new ApiResponse(200, user,"Lab created Successfully.")
  )
})

export{
  createLab
}