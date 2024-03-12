import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { Molecule } from "../models/molecule.model.js";
import { User } from "../models/user.model.js";
import { Lab } from "../models/lab.model.js";

const createMol = asyncHandler(async(req, res) =>{
  const { title, description, startDate, dueDate } = req.body;

  if ([title, description, startDate, dueDate].some((field) => {
    return field?.trim() === ""
  })) {
    throw new ApiError(400, "All fields are required!!")
  }
  const userId = req.user._id
  const labId = req.lab._id
  const taskId = req.task._id
  if (!labId || !taskId) {
    throw new ApiError(401, "LabId not found!!!")
  }

  const createdMol = await Molecule.create(
    {
      title: title.toLowerCase(),
      description: description.toLowerCase(),
      startDate,
      dueDate,
      creator: userId,
      labName: labId,
      compound:taskId
    }
  )

  await User.updateUserForMoleculeCreation(userId, createdMol._id)
  await Lab.updateLabOnMolCreation(labId, createdMol._id)
  await Task.updateTaskOnMolCreation(taskId, createdMol._id)

  return res
  .status(201)
  .json(
    new ApiResponse(200,createdMol,"Molecule created successfully.")
  )
})

export {
  createMol
}