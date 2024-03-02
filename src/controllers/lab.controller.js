import { Lab } from "../models/lab.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createLab = asyncHandler(async(req, res) => {
  const { labName } = req.body;

  if(!labName){
    throw new ApiError(401,"Labname is Required.")
  }

  const lab = await Lab.create({
    labName:labName
  })
})

export{
  createLab
}