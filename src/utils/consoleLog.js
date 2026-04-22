import chalk from "chalk";
import { MODE } from "../config/env.config.js";

const success = chalk.green;
const danger = chalk.hex("#DC3545");
const warning = chalk.hex("#FFC107");
const info = chalk.hex("#0DCAF0");

const consoleLog = {
  dev: text => {
    if (MODE === "development") {
      console.log(text);
    }
  },
  error: value => console.log(danger(value)),
  success: value => console.log(success(value)),
  info: value => console.log(info(value)),
  warning: value => console.log(warning(value)),
};

export default consoleLog;
