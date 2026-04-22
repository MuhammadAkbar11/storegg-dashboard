import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import * as envConfigs from "./src/config/env.config.js";
import { isOperationalError, logError } from "./src/middleware/errorHandler.js";
import Logger from "./src/helpers/logger.helper.js";
import MySQLConnection from "./src/config/db.config.js";
import { createAutoNumberTable } from "./src/models/index.model.js";
import createServer from "./src/server.js";
import chalk from "chalk";

const argv = yargs(hideBin(process.argv)).argv;
envConfigs.dotenvConfig;

const app = createServer();

(async () => {
  let force = argv.force ?? false;

  force && Logger.info("[SEQUELIZE] Sync force sequelize...");

  const connect = await MySQLConnection.sync({ force });

  const tables = await connect.query("SHOW TABLES;");

  if (force) createAutoNumberTable(tables);
  force && Logger.info("[SEQUELIZE] Sync sequelize done!");

  Logger.info(
    `[SEQUELIZE] Database connected on ${chalk.bold(
      `${connect.config.host}:${connect.config.port}`
    )} with the database name is ${chalk.bold(connect.config.database)}`
  );
  app.listen(envConfigs.PORT, () =>
    Logger.info(`[SERVER] app running on port ${envConfigs.PORT}`)
  );
})();

process.on("unhandledRejection", error => {
  Logger.error(error, `[unhandledRejection] ${error.message}`);
  throw error;
});

process.on("uncaughtException", error => {
  logError(error);

  if (!isOperationalError(error)) {
    process.exit(1);
  }
});
