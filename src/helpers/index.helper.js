import fs from "fs";
import path from "path";
import BaseError from "./baseError.helper.js";
import { ROOT_FOLDER } from "../constants/index.constants.js";
import { PREFIX_VERSION } from "./version.helper.js";
import DayjsUTC from "./date.helper.js";

export function GetRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function UnlinkFile(filePath) {
  const file = path.join(ROOT_FOLDER, filePath);

  if (fs.existsSync(file)) {
    return fs.unlink(file, err => {
      if (err) {
        console.log(err);
        throw new BaseError(err);
      }
      return file;
    });
  }

  return false;
}

export function ApiURL(path = "/") {
  return `${PREFIX_VERSION}${path}`;
}

export function RenameImageFile(originalname, prefix = "GG", name = "Name") {
  const resultFileName = name
    .replace(/[^A-Za-z0-9]/g, "")
    .replace(/\s+/g, "")
    .trim()
    .toLocaleLowerCase();
  const filenameToArr = originalname.split(" ").join("").split(".");
  const ext = filenameToArr[filenameToArr.length - 1];
  return `${prefix}_${resultFileName}_${DayjsUTC().valueOf()}.${ext}`;
}
