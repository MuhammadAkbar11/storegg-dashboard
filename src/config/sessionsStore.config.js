import session from "express-session";
import { DataTypes } from "sequelize";
import sequelizeSession from "connect-session-sequelize";
import MySQLConnection from "./db.config.js";
import Logger from "../helpers/logger.helper.js";
const SequelizeStore = sequelizeSession(session.Store);

// MySQLConnection
MySQLConnection.define(
  "Session",
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: DataTypes.STRING,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
  },
  {
    tableName: "gg_sessions",
  }
);

function extendDefaultFields(defaults, session) {
  Logger.info(`[SESSION] Current User is ${session?.passport?.user || "NULL"}`);
  return {
    data: defaults.data,
    expires: defaults.expires,
    user_id: session?.passport?.user,
  };
}

const sessionStore = new SequelizeStore({
  db: MySQLConnection,
  tableName: "gg_sessions",
  extendDefaultFields: extendDefaultFields,
});

export default sessionStore;
