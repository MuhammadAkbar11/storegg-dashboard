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

    const url = textWhite(`- ${req.url} -`);
    const apiBadge = url.includes("/api/")
      ? (httpMethodColors[req.method] || httpMethodColors["DEFAULT"])("API") +
        " "
      : "";
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return `${apiBadge}${method} ${url} ${chalk.green(res.statusCode)}`;
    }

    if (res.statusCode === 404) {
      return `${apiBadge}${method} ${url} ${chalk.yellow(res.statusCode)}`;
    }

    if (res.statusCode >= 300 && res.statusCode < 400) {
      return `${apiBadge}${method} ${url} ${chalk.white(res.statusCode)}`;
    }

    if (res.statusCode === 500) {
      return `${apiBadge}${method} ${url} ${chalk.red(res.statusCode)}`;
    }
    // Logger.info();
    return `${apiBadge}${method} ${url} ${res.statusCode}`;
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
