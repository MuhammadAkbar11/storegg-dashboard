import dotenv from "dotenv";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import fs from "fs";
import Logger from "../helpers/logger.helper.js";
import { ROOT_FOLDER } from "../constants/index.constants.js";

const argv = yargs(hideBin(process.argv)).argv;

const mode = argv.mode;
const envPath = {
  production: path.join(ROOT_FOLDER, ".env"),
  development: path.join(ROOT_FOLDER, ".env.dev"),
  testing: path.join(ROOT_FOLDER, ".env.test"),
};

export const dotenvConfig = dotenv.config({
  path: envPath[mode],
});

// let uploadPath = "public/uploads";

// if (mode == "development" || mode === "testing") {
//   uploadPath = process.env.UPLOAD_PATH;
//   if (!fs.existsSync(path.join(ROOT_FOLDER, uploadPath))) {
//     Logger.warn("Development directory not found!");
//     fs.mkdirSync(path.join(ROOT_FOLDER, uploadPath), { recursive: true });
//     Logger.info("[CONFIG] Development directory created!");
//   } else {
//     Logger.info("[CONFIG] Development directory founded!");
//   }
// }

export const PORT = process.env.PORT | 3000;
/** constant variabel for application. mode development or production */
export const MODE = mode;
export const DB_URI = process.env.DB_URI;
export const MYSQLDATABASE = process.env.MYSQLDATABASE;
export const MYSQLUSERNAME = process.env.MYSQLUSERNAME;
export const MYSQLPASSWORD = process.env.MYSQLPASSWORD;
export const MYSQLHOST = process.env.MYSQLHOST;
export const MYSQLPORT = process.env.MYSQLPORT;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const MAIL_USER = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const OAUTH_CLIENTID = process.env.OAUTH_CLIENTID;
export const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
export const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
export const OAUTH_PLAYGROUND = process.env.OAUTH_PLAYGROUND;
export const EMAIL = process.env.EMAIL;
// export const UPLOAD_PATH = uploadPath;
