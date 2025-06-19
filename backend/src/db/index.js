import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `Mongo DB connection done | Host : ${
        (await connectionInstance).connection.host
      }`
    );
  } catch (error) {
    console.error("Mongo DB connection failed !! ", error);
    process.exit(1);
  }
};

export default connectDB;
