import { Lab } from "../models/lab.model.js";
import { User } from "../models/user.model.js";
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
  const isExists = await Lab.findOne(
    {
      labName: labName,
      labMaker: userId
    }
  )
  if (isExists) {
    throw new ApiError(409, "Choose diffrent labname, already exists.")
  }
  const lab = new Lab({
    labName,
    labMaker:userId
  })
  const user = await User.updateUserForLabCreation(userId,lab._id) 
  await lab.save()

  return res
  .status(201)
  .json(
    new ApiResponse(200,lab,"Lab created Successfully.")
  )
})

const createLabByUsername = asyncHandler( async(req, res) => {
  const { userName } = req.params;
  const { labName } = req.body;
  if (!userName || !labName) {
    throw new ApiError(400, "userName is required in params!!!")
  }
  if (!labName) {
    throw new ApiError(400, "labName is required!!!")
  }

  const user = await User.findOne({userName});
  const userId = user._id;

  const isExists = await Lab.findOne({
    labName,
    labMaker: userId
  })

  if(isExists){
    throw new ApiError(409, "Choose diffrent labname, already exists.")
  }

  const lab = new Lab({
    labName,
    labMaker: userId
  })

  const newUser = await User.updateUserForLabCreation(userId, lab._id);
  await lab.save();

  return res
    .status(201)
    .json(
      new ApiResponse(200, lab, "Lab created Successfully.")
    )
})

const updateLabname = asyncHandler(async(req, res) => {
  const { oldLabname,newLabname } = req.body;
  if(!oldLabname && !newLabname){
    throw new ApiError(401,"old and new labnames are mandatory!!")
  }
  const userId = req.user._id;
  const isExists = await Lab.findOne(
    {
      labName:newLabname,
      labMaker:userId
    }
  )
  if(isExists){
    throw new ApiError(409,"Choose diffrent labname newlabname already exists.")
  }
  const lab = await Lab.findOneAndUpdate(
    {
      $and: [
        { labMaker: userId },
        { labName: oldLabname }
      ]
    },
    { $set: { labName: newLabname } },
    { new: true } // to return the updated document
  );

  return res
  .status(201)
  .json(
    new ApiResponse(200,lab,"Labname updated successfully.")
  )
})

const getLabByLabname = asyncHandler(async(req,res) => {
  return res
  .status(201)
  .json(
    new ApiResponse(200,req.lab,"lab by labname fetched successfully.")
  )
})

const deleteLab = asyncHandler(async(req, res) =>{
  const labId = req.lab?._id;
  await Lab.findByIdAndDelete(labId);
  return res
  .status(200)
  .json(
    new ApiResponse(200, {}, `task with taskId ${labId} deleted successfully.`)
  )
})

const updateLabDetails = asyncHandler(async(req, res) => {
  const { newlabName } = req.body;
  if (!newlabName){
    throw new ApiError(401,"labname is required!!!")
  }

  const labId = req.lab?._id;
  const updatedLab = await Lab.findByIdAndUpdate(
    labId,
    {
      $set:{
        labName: newlabName
      },
    },
    {new:true}
  )

  return res
  .status(200)
  .json(
    new ApiResponse(200,updatedLab,"Labname updated successfully")
  )
})

export{
  createLab,
  updateLabname,
  getLabByLabname,
  deleteLab,
  updateLabDetails,
  createLabByUsername
}