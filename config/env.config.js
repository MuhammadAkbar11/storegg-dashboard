import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();

const DEV_ENV = path.resolve(__dirname, ".env.dev");
const PRODUCTION_ENV = path.resolve(__dirname, ".env");
const DEV_MODE = process.argv.find(arg => arg.includes("--dev"));

export const dotenvConfig = dotenv.config({
  path: DEV_MODE ? DEV_ENV : PRODUCTION_ENV,
});

export const PORT = process.env.PORT;
export const MODE = DEV_MODE ? "development" : "production";
export const MONGO_URI = process.env.MONGO_URI;
export const SESSION_SECRET = process.env.SESSION_SECRET;
