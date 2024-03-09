import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";

export const verifyTask = asyncHandler(async(req, res, next) => {
  const user = req.user;
  const userId = user._id;
  if(!user){
    throw new ApiError(404,"User in verifyTask not Found!!!")
  }
  const currentTask = await Task.findOne(
    {
      creator:userId,
      
    }
  )

})