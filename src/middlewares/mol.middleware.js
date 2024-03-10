import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Molecule } from "../models/molecule.model.js";

export const getCurrentMol = asyncHandler(async(req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;
    const labId = req.lab._id;
    const taskId = req.task._id;
    const mol = req.params.mol;

    if (!(labId || taskId || mol)){
      throw new ApiError(401,"Something went wrong in try Block of mol middleware.")
    }
  
    const molecule = await Molecule.findOne(
      {
        creator:userId,
        labName:labId,
        compound:taskId,
        title: mol, 
      }
    )
  
    req.mol = molecule
    next()
  } catch (error) {
    throw new ApiError(401,error?.message || "Something went wrong while in catch block of mol middleware")
  }
})