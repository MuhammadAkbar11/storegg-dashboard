import { Sequelize } from "sequelize";
import Logger from "../helpers/logger.helper.js";
import {
  DB_DRIVER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
} from "./env.config.js";

const define = {
  timestamps: true,
  // freezeTableName: true,
  underscored: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
};

const sequelizeConnection = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DRIVER,
  host: DB_HOST,
  define,
  logging: (query, timing) => {
    Logger.info(`[sequelize] ${query} `);
  },
});

export default sequelizeConnection;
