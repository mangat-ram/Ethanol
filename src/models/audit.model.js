import mongoose, { Schema } from "mongoose";

const auditSchema = new Schema(
    {
      user:{
        type:Schema.Types.ObjectId,
        ref:"User"
      },
      action:{
        type:String,
        enum:["created", "updated", "deleted"],
      },
      taskId:{
        type:Schema.Types.ObjectId,
        ref:"Task"
      }
    },
  {timestamps:true}
)

export const Audit = mongoose.model("Audit",auditSchema);