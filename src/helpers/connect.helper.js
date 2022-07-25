import { Sequelize } from "sequelize";

import {
  DB_DRIVER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
} from "../config/env.config.js";
import Logger from "./logger.helper.js";

const define = {
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
};

const ConnectSequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DRIVER,
  host: DB_HOST,
  define,
  timezone: "+00:00",
  logging: (query, options, time) => {
    Logger.info(query);
  },
});

export default ConnectSequelize;
// export default connectDB;
