import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createTask = asyncHandler(async(req, res) => {
  const { title, description, startDate, dueDate } = req.body;

  if([title,description,startDate,dueDate].some((field) => {
    return field?.trim() === ""
  })){
    throw new ApiError(400,"All fields are required!!")
  }

  const task = await Task.create(
    {
      title: title.toLowerCase(),
      description: description.toLowerCase(),
      startDate,
      dueDate,
      priority,
      status,
      creator,
      assignee,
      category
    }
  )

  const createdTask = await Task.findById(task._id)

  if(!createdTask){
    throw new ApiError(500,"Something went wrong while creating Task!!!")
  }

  return res
  .status(201)
  .json(
    new ApiResponse(200,createdTask,"Task created Successfully.")
  )
})

const updateTitle = asyncHandler(async(req, res) => {
  const { title } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.task?._id,
    {
      $set:{title}
    },
    {new:true}
  )

  return res
  .status(201)
  .json(
    new ApiResponse(200,task,"Task title updated Successfully")
  )
})

const updateDescription = asyncHandler(async(req, res) => {
  const { description } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.task?._id,
    {
      $set: { description }
    },
    {new:true}
  )

  return res
  .status(201)
  .json(
    new ApiResponse(200,task,"Task title updated Successfully")
  )
})
const updateStartDate = asyncHandler(async(req, res) => {
  const { startDate } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.task?._id,
    {
      $set: { startDate }
    },
    {new:true}
  )

  return res
  .status(201)
  .json(
    new ApiResponse(200,task,"Task title updated Successfully")
  )
})
const updateDueDate = asyncHandler(async(req, res) => {
  const { dueDate } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.task?._id,
    {
      $set: { dueDate }
    },
    {new:true}
  )

  return res
  .status(201)
  .json(
    new ApiResponse(200,task,"Task title updated Successfully")
  )
})

const deleteTask = asyncHandler(async(req, res) => {
  const taskId = req.task?._id
  const task = await Task.findByIdAndDelete(taskId)
  if(!task){
    throw new ApiResponse(404,"Task not Found!!!")
  }

  return res
  .status(201)
  .json(new ApiResponse(200,{},"Task Deleted Successfully."))
})

const getTasksByCategory = asyncHandler(async(req, res) => {
  const { category } = req.params;
  if(!category?.trim()){
    throw new ApiError(401,"Category is required!")
  }

  const tasks = await Task.aggregate(
    [
      {
        $match:{
          category:category
        }
      }
    ]
  )

  if(!tasks){
    throw new ApiError(404,"Category not Found!!!");
  }

  return res
  .status(201)
  .json(
    new ApiResponse(200,tasks,`Tasks with category ${category} are fetched.`)
  )
})

const getTaskById = asyncHandler(async(req, res) => {
  const taskId = req.task?._id
  const task = await Task.aggregate(
    [
      {
        $match:{
          _id:taskId
        }
      }
    ]
  )

  if(!task){
    throw new ApiError(404,"Task not found!")
  }

  return res
  .status(201)
  .json(
    new ApiResponse(200,task,"Success Task fetched")
  )
})

const getTasksByStatus = asyncHandler(async(req, res) => {
  const { status } = req.params;
  if(!status){
    throw new ApiError(401,"Status is required!")
  }

  const filteredTasks = await Task.aggregate(
    [
      {
        $match:{
          status:status
        }
      }
    ]
  )

  if(!filteredTasks){
    throw new ApiError(404,"Status Not Found!!!")
  }

  return res
  .status(201)
  .json(
    new ApiResponse(200,filteredTasks,"Success")
  )
})

export {
  createTask,
  updateTitle,
  updateDescription,
  updateStartDate,
  updateDueDate,
  deleteTask,
  getTasksByCategory,
  getTaskById,
  getTasksByStatus
}