import path from "path";

const __dirname = path.resolve();

export const httpStatusCodes = {
  OK: 200,
  EDIT: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

export const TABLE_AUTO_INCREMENT = {
  users: {
    field: "user_id",
    prefix: "USR",
    increment: 0,
  },
  players: {
    field: "player_id",
    prefix: "PLY",
    increment: 0,
  },
  administrators: {
    field: "admin_id",
    prefix: "ADM",
    increment: 0,
  },
};

export const STATIC_FOLDER = path.join(__dirname, "public");
export const DEV_STATIC_FOLDER = path.join(__dirname, ".dev", "public");
export const ROOT_FOLDER = __dirname;
export const DEFAULT_THUMBNAIL = "/uploads/Default-Thumbnail.png";
export const DEFAULT_USER_PP = "/uploads/Default-Avatar-1.jpg";
