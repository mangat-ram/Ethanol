import mongoose,{ Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    userName : {
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      index:true
    },
    name:{
      type:String,
      required:true,
      trim:true,
      index:true
    },
    email:{
      type:String,
      required:true,
      unique:true,
      trim:true,
    },
    passWord:{
      type:String,
      required: [true , "Password is required!"]
    },
    refreshToken:{
      type:String
    },
    labs:[
      {
        type:Schema.Types.ObjectId,
        ref:"Lab"
      }
    ],
    compounds:[
      {
        type:Schema.Types.ObjectId,
        ref:"Task"
      }
    ],
    molecules:[
      {
        type:Schema.Types.ObjectId,
        ref:"Molecule"
      }
    ]
  },{ timestamps:true }
)

// Method to check whether password is modified or not, if not hash the password
userSchema.pre("save", async () => {
  if(!this.isModified("passWord")) return next();
  this.passWord = await bcrypt.hash(this.passWord , 10);
  next();
})

userSchema.methods.isPasswordCorrect = async (password) => {
  return await bcrypt.compare(password,this.passWord)
}

userSchema.methods.generateAccessToken = () => {
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      userName:this.userName,
      name:this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = () => {
  return jwt.sign(
    {
      _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User",userSchema);