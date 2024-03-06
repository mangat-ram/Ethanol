import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";

const createCategory = asyncHandler(async(req, res) => {
  const { category } = req.body;
  
  if(!category){
    throw new ApiError(401,"Category is required!")
  }

  const isExists = await Category.findOne({
    category:category
  })

  if(isExists){
    throw new ApiError(402,"Category already exists!!")
  }

  const newCategory = await Category.create(
    {
      category: category
    }
  )

  return res
  .status(201)
  .json(
    new ApiResponse(200,newCategory,"New Category Created successfully.")
  )
})

const getAllCategory = asyncHandler(async(req, res) => {

  const allCategories = await Category.find();

  return res
  .status(200)
  .json(
    new ApiResponse(200,allCategories,"Categories Fetched Successfully")
  )
})

const updateCategory = asyncHandler(async(req,res) => {
  const { oldCategoryName,newCategoryName } = req.body;
  if(!newCategoryName){
    throw new ApiError(401,"Categoryname is Required")
  }

  const category = await Category.findOneAndUpdate(
    { category:oldCategoryName },
    {
      $set:{
        category:newCategoryName
      }
    },
    {new:true}
  )

  return res
  .status(201)
  .json(
    new ApiResponse(200,category,"Category Updated Successfully.")
  )
})


const deleteCategory = asyncHandler(async(req, res) => {
  const { category } = req.body;

  await Category.deleteOne({ category: category});
  return res
  .status(201)
  .json(
    new ApiResponse(200, {}, "Category deleted Successfully.")
  )
})

export {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory
}