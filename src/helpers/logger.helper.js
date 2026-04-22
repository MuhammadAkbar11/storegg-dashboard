import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import pino from "pino";
import pinoPretty from "pino-pretty";
import dayjsUTC from "./date.helper.js";

const argv = yargs(hideBin(process.argv)).argv;

const timeformat = "DD.MM.YYYY HH:mm:ss";
const time =
  argv.mode !== "production"
    ? dayjsUTC().tz("Asia/Jakarta").format(timeformat)
    : dayjsUTC().format(timeformat);

const streams = [
  // { stream: process.stdout },
  // {
  //   stream:
  //     argv.mode === "development" ? pino.destination(".dev/logging.log") : null,
  // },
  {
    stream: pinoPretty({
      colorize: true,
      destination: 1,
      ignore: "pid",
    }),
  },
];

const Logger = pino(
  {
    prettifier: true,
    level: "info",
    formatters: {
      level: label => {
        return { level: label };
      },
    },
    timestamp: () => `,"time": "${time}"`,
  },
  pino.multistream(streams)
);

export default Logger;
