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
    enum:["pending","completed","inProgress","qualityAssurance","deployed"],
    default:"inProgress"
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
  }
},{ timestamps : true })

export const Task = mongoose.model("Task",taskSchema);