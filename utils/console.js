import colors from "colors";
import { MODE } from "../config/env.config.js";

export const consoleLogDev = text => {
  if (MODE === "development") {
    console.log(text);
  }
};

export const consoleLogError = text => {
  console.log(`\n${text} \n`.red.bold);
};

export const consoleLogWarn = text => {
  console.log(`${text}`.yellow);
};

export const consoleLogInfo = (text = "") => {
  console.log(`${text}`.blue);
};

export const consoleLogVerbose = (text = "") => {
  console.log(`${text}`.magenta);
};
