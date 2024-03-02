import mongoose,{ Schema } from "mongoose";

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
    types:Schema.Types.ObjectId,
    ref:"User"
  },
  assignee:{
    types:Schema.Types.ObjectId,
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