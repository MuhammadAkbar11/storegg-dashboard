import dotenv from "dotenv";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import fs from "fs";
import Logger from "../helpers/logger.helper.js";

const argv = yargs(hideBin(process.argv)).argv;

const __dirname = path.resolve();

const mode = argv.mode;

const envPath = {
  production: path.resolve(__dirname, ".env.dev"),
  development: path.resolve(__dirname, ".env.dev"),
};

export const dotenvConfig = dotenv.config({
  path: envPath[mode],
});

let uploadPath = "public/uploads";

if (mode == "development") {
  let uploadPath = process.env.UPLOAD_PATH;
  if (!fs.existsSync(path.resolve(__dirname, uploadPath))) {
    Logger.warn("Development directory not found!");
    fs.mkdirSync(path.resolve(__dirname, uploadPath), { recursive: true });
    Logger.info("[server] Development directory created!");
  } else {
    Logger.info("[server] Development directory founded!");
  }
}

export const PORT = process.env.PORT | 3000;
export const MODE = mode;
export const MONGO_URI = process.env.MONGO_URI;
export const DB_NAME = process.env.DB_DATABASE;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_DRIVER = process.env.DB_DRIVER;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const MAIL_USER = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const OAUTH_CLIENTID = process.env.OAUTH_CLIENTID;
export const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
export const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
export const OAUTH_PLAYGROUND = process.env.OAUTH_PLAYGROUND;
export const EMAIL = process.env.EMAIL;
export const UPLOAD_PATH = uploadPath;
