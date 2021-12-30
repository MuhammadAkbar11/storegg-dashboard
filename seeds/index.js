import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import colors from "colors";
import connectDB from "../config/db.config.js";
import { dotenvConfig } from "../config/env.config.js";
import { consoleLogError } from "../utils/consoleLog.js";
import UserModel from "../models/User.model.js";
import bcryptjs from "bcryptjs";

const __dirname = path.resolve();

dotenvConfig;

connectDB();

async function importData() {
  try {
    const usersJson = await fs.readFileSync(path.resolve("data/users.json"));
    const users = JSON.parse(usersJson).map(user => {
      return {
        ...user,
        password: bcryptjs.hashSync(user.password, 12),
      };
    });

    await UserModel.insertMany(users);

    console.log("Imported".green);
    process.exit();
  } catch (error) {
    console.log(`\n${error}`.bgRed.grey);
    consoleLogError("Import data is failed!");
    process.exit();
  }
}

async function destroyData() {
  try {
    await UserModel.deleteMany();
    console.log("Destroyed".red);
    process.exit();
  } catch (error) {
    console.log(`\n${error}`.bgRed.grey);
    consoleLogError("Import data is failed!");
    process.exit();
  }
}

function unknownSeed() {
  console.log("Unknown command");
  process.exit();
}

const command = process.argv.find(arg => arg.includes("seed=")).split("=")[1];

switch (command) {
  case "import":
    importData();
    break;
  case "destroy":
    destroyData();
    break;
  default:
    unknownSeed();
    break;
}
