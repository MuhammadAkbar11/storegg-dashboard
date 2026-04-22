import path from "path";
import { dotenvConfig } from "../../config/env.config";
import connectDB from "../../config/db.config";
import { seedDestroyUsers, seedImportUsers } from "./user.seed";
import consoleLog from "../../utils/consoleLog";

dotenvConfig;

connectDB;

async function importData() {
  try {
    await seedImportUsers();

    consoleLog.info("Imported");
    process.exit();
  } catch (error) {
    console.log(error);
    consoleLog.error("Import data is failed!");
    process.exit();
  }
}

async function destroyData() {
  try {
    await seedDestroyUsers();
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
