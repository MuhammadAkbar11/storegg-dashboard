import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();

export const MODE = process.env.NODE_ENV;

const DEV_ENV = path.resolve(__dirname, ".env.dev");
const PRODUCTION_ENV = path.resolve(__dirname, ".env");

const DEV_MODE = "development";

export const dotenvConfig = dotenv.config({
  path: MODE == DEV_MODE ? DEV_ENV : PRODUCTION_ENV,
});

export const PORT = process.env.PORT | 3000;

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
export const UPLOAD_PATH =
  MODE == DEV_MODE ? process.env.UPLOAD_PATH : "public/uploads";
