import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Lab } from "../models/lab.model.js";

export const getCurrentLab = asyncHandler(async(req,res,next) => {
  try {
    const user = req.user;
    const userId = user._id;
    // console.log(userId);
    const labname = req.params.labname
    // console.log(labname);
    if(!labname){
      throw new ApiError(401,"Something went wrong in labname middleware.")
    }
    const lab = await Lab.findOne(
      {
        labName:labname,
        labMaker:userId
      }
    )
    if(!lab){
      throw new ApiError(404,"Lab not found in lab middleware.")
    }
  
    req.lab = lab;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Something went wrong in catch of lab middleware")
  }
})