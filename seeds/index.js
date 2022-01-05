import path from "path";
import fs from "fs";
import connectDB from "../config/db.config.js";
import { dotenvConfig } from "../config/env.config.js";
import consoleLog from "../utils/consoleLog.js";
import UserModel from "../models/User.model.js";
import bcryptjs from "bcryptjs";

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

    consoleLog.info("Imported");
    process.exit();
  } catch (error) {
    consoleLog.error("Import data is failed!");
    process.exit();
  }
}

async function destroyData() {
  try {
    await UserModel.deleteMany();
    consoleLog.error("Destroyed");
    process.exit();
  } catch (error) {
    consoleLog.error("Import data is failed!");
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
