import fs from "fs";
import path from "path";
import BaseError from "../helpers/baseError.helper.js";
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
        console.log(error);
        throw new BaseError(err);
      }
    });
  }
}

export function joinAPIsURL(path = "/") {
  return `${PREFIX_VERSION}${path}`;
}
