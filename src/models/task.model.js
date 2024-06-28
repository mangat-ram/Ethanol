import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title:{
      type:String,
      required:true,
    },
    description:{
      type:String,
      required:true
    },
    startDate:{
      type:String,
      required:true
    },
    dueDate:{
      type:String,
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
      type:Schema.Types.String,
      ref:"User"
    },
    // assignee:{
    //   type:Schema.Types.ObjectId,
    //   ref:"User"
    // },
    // category:{
    //   type:Schema.Types.ObjectId,
    //   ref:"Category",
    // },
    category:{
      type:String,
      enum:["bugFix","feature","verification","qualityAssurance"],
      default:"feature"
    },
    labName :{
      type:Schema.Types.String,
      ref:"Lab"
    },
    molecules:[
      {
        type:Schema.Types.ObjectId,
        ref:"Molecule"
      }
    ]
  },{ timestamps : true }
)

taskSchema.statics.updateTaskOnMolCreation = async function (TaskId, MolId) {
  return await this.findByIdAndUpdate(TaskId, { $push: { molecules: MolId } }, { new: true });
};

export const Task = mongoose.model("Task",taskSchema);