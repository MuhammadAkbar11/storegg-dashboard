import path from "path";

const __dirname = path.resolve();

export const STATIC_FOLDER = path.join(__dirname, "public");
export const DEV_STATIC_FOLDER = path.join(__dirname, ".dev", "public");
export const ROOT_FOLDER = __dirname;
export const DEFAULT_THUMBNAIL = "/uploads/Default-Thumbnail.png";
export const DEFAULT_USER_PP = "/uploads/Default-Avatar-1.jpg";
