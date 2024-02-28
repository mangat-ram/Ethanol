import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try{
    const instance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB Connected Succesfully !! HOST:${instance.connection.host}`);
  }catch(err){
    console.log("Connection Failed!!! due to ",err);
    process.exit(1);
  }
}

export { connectDB }