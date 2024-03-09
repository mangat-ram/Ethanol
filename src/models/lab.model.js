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

labSchema.statics.updateLabOnTaskCreation = async function (labId,taskId) {
  return await this.findByIdAndUpdate(labId, { $push: { compounds: taskId } }, { new: true });
};

labSchema.statics.updateLabOnMolCreation = async function (labId,MolId) {
  return await this.findByIdAndUpdate(labId, { $push: { molecules: MolId } }, { new: true });
};
export const Lab = mongoose.model("Lab",labSchema);