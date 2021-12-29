import mongoose from "mongoose";
import { consoleLogError } from "../utils/console.js";
import { MONGO_URI } from "./env.config.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
    });

    console.log(`[MongoDB] Connected : ${conn.connection.host} \n`.cyan);
  } catch (error) {
    consoleLogError(`[MongoDB] Error : ${error.message} \n`.underline);
    process.exit(1);
  }
};

export default connectDB;
