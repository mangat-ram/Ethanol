import mongoose, { Schema } from "mongoose";

const sharedTaskSchema = new Schema(
  {
    taskId:{
      type:Schema.Types.ObjectId,
      ref:"Task"
    },
    userId:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    permissions:{
      enum:["readOnly","canEdit"],
      default:"canEdit"
    }
  },
  {
    timestamps:true
  }
)

export const SharedTask = mongoose.model("SharedTask",sharedTaskSchema);