import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";
import { Category } from "./category.model.js"

const moleculeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["toDo", "completed", "inProgress", "qualityAssurance", "deployed"],
      default: "toDo"
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    // category: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Category",
    // }
    category: {
      type: String,
      enum: ["bugFix", "feature", "verification", "qualityAssurance"],
      default: "feature"
    },
    labName: {
      type: Schema.Types.ObjectId,
      ref: "Lab"
    },
    compound:{
      type:Schema.Types.ObjectId,
      ref:"Task"
    }
  },{timestamps:true}
)



export const Molecule = mongoose.model("Molecule", moleculeSchema);