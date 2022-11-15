import fs from "fs";
import path from "path";
import chalk from "chalk";
import BaseError from "./baseError.helper.js";
import { ROOT_FOLDER, STATIC_FOLDER } from "../constants/index.constants.js";
import { PREFIX_VERSION } from "./version.helper.js";
import DayjsUTC from "./date.helper.js";
import Logger from "./logger.helper.js";

const bgWarn = chalk.bgHex("#EA7A20");

export function GetRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function UnlinkFile(filePath, isRootPath = true) {
  let file = path.join(filePath);

  if (isRootPath) {
    file = path.join(ROOT_FOLDER, filePath);
  }

  if (fs.existsSync(file)) {
    return fs.unlink(file, err => {
      if (err) {
        console.log(err);
        throw new BaseError(err);
      }
      Logger.warn(
        `${bgWarn(
          chalk.black(`[HELPER]`)
        )} Delete file in with the path is ${file}`
      );
      return true;
    });
  }

  return false;
}

export function ApiURL(path = "/") {
  return `${PREFIX_VERSION}${path}`;
}

export function RenameFile(originalname, prefix = "GG", name = "Name") {
  const resultFileName = name
    .replace(/[^A-Za-z0-9]/g, "")
    .replace(/\s+/g, "")
    .trim();
  const filenameToArr = originalname.split(" ").join("").split(".");
  const ext = filenameToArr[filenameToArr.length - 1];
  return `${prefix}_${resultFileName}_${DayjsUTC().valueOf()}.${ext}`;
}

export function Rupiah(values) {
  return values.toLocaleString("id", {
    style: "currency",
    currency: "IDR",
  });
}

export function ToCapitalize(value) {
  return `${value.charAt(0).toUpperCase() + value.slice(1)}`;
}

export function ToPlainObject(data) {
  let rows = data;

  rows = JSON.stringify(rows);
  rows = JSON.parse(rows);

  return rows;
}

export function HTMLStylesheet(styleSheetsFile = [], res) {
  // console.log(stylesheets);
  // const data = styleSheetsFile;
  let stylesheet = {};

  const arr = [];
  for (let i = 0; i < styleSheetsFile.length; i++) {
    const obj = {};
    for (let j = 0; j < styleSheetsFile[i].length; j++) {
      const key = styleSheetsFile[i][1];
      const value = styleSheetsFile[i][0];
      obj[key] = value;
    }
    stylesheet[styleSheetsFile[i][1]] = [];
    arr.push(obj);
  }

  Object.keys(stylesheet).map(k => {
    arr.map(x => {
      const file = x[k];
      if (file) {
        if (fs.existsSync(path.join(STATIC_FOLDER, file))) {
          Logger.info(
            `[HELPER] Stylesheet file ${chalk.bold.underline(file)} exits!`
          );
        } else {
          Logger.warn(
            `[HELPER] Stylesheet file ${chalk.bold.underline(
              file
            )} does not exist`
          );
        }

        stylesheet[k]?.push(file);
      }
    });
  });

  return (res.locals.stylesheet = {
    ...res.locals.stylesheet,
    ...stylesheet,
  });
}

export function HTMLScript(scriptFiles = [], res) {
  let script = {};

  const arr = [];
  for (let i = 0; i < scriptFiles.length; i++) {
    const obj = {};
    for (let j = 0; j < scriptFiles[i].length; j++) {
      const key = scriptFiles[i][1];
      const value = scriptFiles[i][0];
      obj[key] = value;
    }
    script[scriptFiles[i][1]] = [];
    arr.push(obj);
  }

  Object.keys(script).map(k => {
    arr.map(x => {
      const file = x[k];
      if (file) {
        if (fs.existsSync(path.join(STATIC_FOLDER, file))) {
          Logger.info(
            `[HELPER] Script file ${chalk.bold.underline(file)} exits!`
          );
        } else {
          Logger.warn(
            `[HELPER] Script file ${chalk.bold.underline(file)} does not exist`
          );
        }

        script[k]?.push(file);
      }
    });
  });

  return (res.locals.script = {
    ...res.locals.script,
    ...script,
  });
}
