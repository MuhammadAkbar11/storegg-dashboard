import pino from "pino";
import dayjsUTC from "./date.helper.js";

const Logger = pino({
  prettifier: true,

  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
  },
  timestamp: () => `,"time": "${dayjsUTC().format("")}"`,
});

export default Logger;
