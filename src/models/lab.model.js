//Start soon
import mongoose, { Schema } from "mongoose";

const labSchema = new Schema(
  {
    labName:{
      type:String,
      required:true,
      lowercase:true,
      trim:true
    },
    labMaker:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    compounds:[
      {
        type:Schema.Types.ObjectId,
        ref:"Task"
      }
    ],
    molecules:[
      {
        type: Schema.Types.ObjectId,
        ref: "Molecule"
      }
    ]
  },{timestamps:true}
)

export const Lab = mongoose.model("Lab",labSchema);