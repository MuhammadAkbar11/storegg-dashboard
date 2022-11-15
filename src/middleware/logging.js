import chalk from "chalk";
import pinoHtpp from "pino-http";
import Logger from "../helpers/logger.helper.js";

const textWhite = chalk.hex("#DFDFDE");
const bgWhite = chalk.bgHex("#DFDFDE");

const httpMethodColors = {
  GET: value => bgWhite(chalk.black(`[${value}]`)),
  POST: value => chalk.bgGreen(chalk.black(`[${value}]`)),
  PUT: value => chalk.bgCyan(chalk.black(`[${value}]`)),
  DELETE: value => chalk.bgRed(chalk.black(`[${value}]`)),
  DEFAULT: value => chalk.bgCyan(chalk.black(`[${value}]`)),
};

const log = pinoHtpp({
  logger: Logger,
  serializers: {
    res() {
      return undefined;
    },
    req() {
      return undefined; // Remove 'req' from logs
    },
    timeTaken() {
      return undefined;
    },
  },

  customSuccessMessage: function (req, res) {
    const method = (
      httpMethodColors[req.method] || httpMethodColors["DEFAULT"]
    )(req.method);

    const agent = `[${req.headers["user-agent"]}]`;
    const url = textWhite(`- ${req.url} - `);

    if (res.statusCode >= 200 && res.statusCode < 300) {
      return `${method} ${url} ${chalk.green(res.statusCode)} ${agent}`;
    }

    if (res.statusCode === 404) {
      return `${method} ${url} ${chalk.yellow(res.statusCode)} ${agent}`;
    }

    if (res.statusCode >= 300 && res.statusCode < 400) {
      return `${method} ${url} ${chalk.white(res.statusCode)} ${agent}`;
    }

    if (res.statusCode === 500) {
      return `${method} ${url} ${chalk.red(res.statusCode)} ${agent}`;
    }
    // Logger.info();
    return `${method} ${url} ${res.statusCode} ${agent}`;
  },

  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "timeTaken",
  },
});

export default function pinoHttpLogger(req, res, next) {
  log(req, res);
  next();
}
