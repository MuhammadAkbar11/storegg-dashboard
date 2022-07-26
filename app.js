import express from "express";
import morgan from "morgan";
import cors from "cors";
import expressMysqlSession from "express-mysql-session";
import session from "express-session";
import passport from "passport";
import methodOverride from "method-override";
import connectFlash from "connect-flash";
import * as envConfigs from "./src/config/env.config.js";
import {
  isOperationalError,
  logError,
  logErrorMiddleware,
  return404,
  returnError,
} from "./src/middleware/errorHandler.js";

import {
  DEV_STATIC_FOLDER,
  STATIC_FOLDER,
} from "./src/constants/index.constants.js";
import passportConfig from "./src/config/passport.config.js";
import MainRoutes from "./src/routes/index.routes.js";
import { responseType } from "./src/middleware/responseType.js";
import Logger from "./src/helpers/logger.helper.js";
import ConnectSequelize from "./src/helpers/connect.helper.js";
import BootstrapModels, {
  initAutoIncrementsData,
} from "./src/models/index.model.js";

const MySQLStore = expressMysqlSession(session);

envConfigs.dotenvConfig;

passportConfig();
// connectDB();

const app = express();
// Store Session

const sessiontStore = new MySQLStore({
  checkExpirationInterval: 900000,
  expiration: 86400000,
  insecureAuth: true,
  host: envConfigs.DB_HOST,
  database: envConfigs.DB_NAME,
  user: envConfigs.DB_USERNAME,
  password: envConfigs.DB_PASSWORD,
  schema: {
    tableName: "gg_sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
});

app.set("view engine", "ejs");
app.set("views", "src/views");

// Body Parse
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cors
app.use(cors());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Flash
app.use(connectFlash());

// Session
app.use(
  session({
    secret: envConfigs.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessiontStore,
  })
);

if (envConfigs.MODE == "development") {
  app.use(morgan("dev"));
}

// Passport middleware
app.use(passport.initialize());
app.use(passport.session({}));

app.use((req, res, next) => {
  if (req.user) {
    res.locals.userAuth = req.user;
  } else {
    res.locals.userAuth = null;
  }

  next();
});

app.use(express.static(STATIC_FOLDER));
if (envConfigs.MODE == "development") {
  app.use(express.static(DEV_STATIC_FOLDER));
}

app.use(responseType);

MainRoutes(app);

app.use(logErrorMiddleware);
app.use(return404);
app.use(returnError);

BootstrapModels();

(async () => {
  // let force = false;
  let force = true;
  const connect = await ConnectSequelize.sync({ force }).then(res => res);

  // const models = co;
  const tables = await connect.query("SHOW TABLES;");

  if (force) initAutoIncrementsData(tables);

  app.listen(envConfigs.PORT, () =>
    Logger.info(`Server Running on port ${envConfigs.PORT}`)
  );
})();

process.on("unhandledRejection", error => {
  throw error;
});

process.on("uncaughtException", error => {
  logError(error);

  if (!isOperationalError(error)) {
    process.exit(1);
  }
});
