import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  passWord: {
    type: String,
    required: [true, "Password is required!"]
  },
  refreshToken: {
    type: String
  },
  labs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lab"
    }
  ],
  compounds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task"
    }
  ],
  molecules: [
    {
      type: Schema.Types.ObjectId,
      ref: "Molecule"
    }
  ]
}, { timestamps: true }
);

// Method to check whether password is modified or not, if not hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("passWord")) return next();
  this.passWord = await bcrypt.hash(this.passWord, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.passWord);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      name: this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

// Update user when a lab is created
userSchema.statics.updateUserForLabCreation = async function (userId, labId) {
  return await this.findByIdAndUpdate(userId, { $push: { labs: labId } }, { new: true });
}; 

// Update user when a compound is created
userSchema.statics.updateUserForCompoundCreation = async function (userId, compoundId) {
  return await this.findByIdAndUpdate(userId, { $push: { compounds: compoundId } }, { new: true });
};

// Update user when a molecule is created
userSchema.statics.updateUserForMoleculeCreation = async function (userId, moleculeId) {
  return await this.findByIdAndUpdate(userId, { $push: { molecules: moleculeId } }, { new: true });
};

export const User = mongoose.model("User", userSchema);
