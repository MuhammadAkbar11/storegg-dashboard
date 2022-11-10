import { Sequelize } from "sequelize";
import {
  DB_DRIVER,
  MYSQLHOST,
  MYSQLDATABASE,
  MYSQLPASSWORD,
  MYSQLUSERNAME,
  MYSQLPORT,
} from "./env.config.js";

const define = {
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
};

const sequelizeConfig = {
  producion: new Sequelize(MYSQLDATABASE, MYSQLUSERNAME, MYSQLPASSWORD, {
    dialect: DB_DRIVER,
    host: MYSQLHOST,
    port: MYSQLPORT,
    define,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 10000,
      evict: 10000,
      handleDisconnects: true,
    },
    logging: (query, timing) => {
      // Logger.info(`[SEQUELIZE] ${query} `);
    },
  }),
  // dev
  development: new Sequelize(MYSQLDATABASE, MYSQLUSERNAME, MYSQLPASSWORD, {
    dialect: "mysql",
    host: MYSQLHOST,
    define,
    logging: (query, timing) => {
      // Logger.info(`[SEQUELIZE] ${query} `);
    },
  }),
  testing: new Sequelize(MYSQLDATABASE, MYSQLUSERNAME, MYSQLPASSWORD, {
    dialect: "mysql",
    host: MYSQLHOST,
    define,
    logging: (query, timing) => {
      // Logger.info(`[SEQUELIZE] ${query} `);
    },
  }),
};

export default sequelizeConfig;
