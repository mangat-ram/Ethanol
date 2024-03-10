import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";

export const verifyTask = asyncHandler(async(req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;
    const labname = req.params.labname;
    const title = req.params.title;
    if(!(user && labname && taskTitle)){
      throw new ApiError(404,"User,labname or title in verifyTask not Found!!!")
    }
    const currentTask = await Task.findOne(
      {
        creator:userId,
        labname:labname,
        title:title
      }
    )
  
    req.task = currentTask;
    next()
  } catch (error) {
    throw new ApiError(401,error?.message || "Something went wrong in catch of task middleware")
  }

})