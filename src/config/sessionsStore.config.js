import session from "express-session";
import sequelizeSession from "connect-session-sequelize";
import MySQLConnection from "./db.config.js";

const SequelizeStore = sequelizeSession(session.Store);

const sessionStore = new SequelizeStore({
  checkExpirationInterval: 900000,
  expiration: 86400000,
  db: MySQLConnection,
  tableName: "gg_sessions",
});

sessionStore.sync();

export default sessionStore;
