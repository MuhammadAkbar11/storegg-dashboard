import Logger from "../helpers/logger.helper.js";
import { MODE } from "./env.config.js";
import sequelizeConfig from "./sequelize.config.js";

const MySQLConnection = sequelizeConfig[MODE] || sequelizeConfig["producion"];

try {
  await MySQLConnection.authenticate();
  Logger.info(
    `[SEQUELIZE] Connection has been established successfully on ${MODE}`
  );
} catch (error) {
  Logger.error(error, "[SEQUELIZE] Unable to connect to the database ");
}

export default MySQLConnection;
