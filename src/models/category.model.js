import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    category:{
      type:String,
      enum:["bugFix","feature","verification","qualityAssurance"],
      unique:true
    }
  },{ timestamps:true }
)

export const Category = mongoose.model("Category",categorySchema);