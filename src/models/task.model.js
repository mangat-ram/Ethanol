import mongoose from "mongoose";
import { User } from "./user.model.js";
import { Molecule } from "./molecule.model.js";
import { Category } from "./category.model.js"

const { Schema } = mongoose;

const taskSchema = new Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true
  },
  startDate:{
    type:Date,
    required:true
  },
  dueDate:{
    type:Date,
    required:true
  },
  priority:{
    type:String,
    enum:["High","Medium","Low"],
    default:"Medium"
  },
  status:{
    type:String,
    enum:["toDo","completed","inProgress","qualityAssurance","deployed"],
    default:"toDo"
  },
  isCompleted:{
    type:Boolean,
    default:false
  },
  creator:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  assignee:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  category:{
    type:Schema.Types.ObjectId,
    ref:"Category",
  },
  molecules:[
    {
      type:Schema.Types.ObjectId,
      ref:"Molecule"
    }
  ]
},{ timestamps : true })

export const Task = mongoose.model("Task",taskSchema);