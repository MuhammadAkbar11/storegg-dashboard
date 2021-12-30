import mongoose from "mongoose";
import consoleLog from "../utils/consoleLog.js";
import { MONGO_URI } from "./env.config.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
    });

    consoleLog.info(`[MongoDB] Connected : ${conn.connection.host} `);
  } catch (error) {
    consoleLog.error(`[MongoDB] Error : ${error.message} `.underline);
    process.exit(1);
  }
};

export default connectDB;
