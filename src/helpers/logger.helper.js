import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import dayjs from "dayjs";
import pino from "pino";
import dayjsUTC from "./date.helper.js";

const argv = yargs(hideBin(process.argv)).argv;

const timeformat = "DD.MM.YYYY HH:mm:ss";
const time =
  argv.mode === "development"
    ? dayjs().format(timeformat)
    : dayjsUTC().format(timeformat);

const Logger = pino({
  prettifier: true,

  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
  },
  timestamp: () => `,"time": "${time}"`,
});

export default Logger;
