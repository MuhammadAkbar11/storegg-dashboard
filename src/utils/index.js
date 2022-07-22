import fs from "fs";
import path from "path";
import BaseError from "../helpers/baseError.helper.js";
import dateHelper from "../helpers/date.helper.js";
import { PREFIX_VERSION } from "../helpers/version.helper.js";
import { ROOT_FOLDER } from "./constants.js";

export function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function deleteFile(filePath) {
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

export function joinAPIsURL(path = "/") {
  return `${PREFIX_VERSION}${path}`;
}

export function transformFilename(originalname, prefix = "GG", name = "Name") {
  const resultFileName = name
    .replace(/[^A-Za-z0-9]/g, "")
    .replace(/\s+/g, "")
    .trim()
    .toLocaleLowerCase();
  const filenameToArr = originalname.split(" ").join("").split(".");
  const ext = filenameToArr[filenameToArr.length - 1];
  return `${prefix}_${resultFileName}_${dateHelper().valueOf()}.${ext}`;
}
