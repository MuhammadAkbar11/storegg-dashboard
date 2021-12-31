import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.config.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import methodOverride from "method-override";
import connectFlash from "connect-flash";
import * as envConfigs from "./config/env.config.js";
import {
  isOperationalError,
  logError,
  logErrorMiddleware,
  returnError,
} from "./middleware/errorHandler.js";
import routers from "./routes/index.routes.js";
import consoleLog from "./utils/consoleLog.js";

import { STATIC_FOLDER } from "./utils/constants.js";
import passportConfig from "./config/passport.config.js";

envConfigs.dotenvConfig;

passportConfig();
connectDB();

const app = express();
// Store Session
const store = MongoStore.create({
  mongoUrl: envConfigs.MONGO_URI,
});

app.set("view engine", "ejs");
app.set("views", "views");

// Body Parse
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
    store: store,
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

app.use(routers);

app.use(logErrorMiddleware);
app.use(returnError);

app.listen(envConfigs.PORT, () => {
  consoleLog.success(
    `[server] server running in ${envConfigs.MODE} mode on port ${envConfigs.PORT}`
  );
});

process.on("unhandledRejection", error => {
  throw error;
});

process.on("uncaughtException", error => {
  logError(error);

  if (!isOperationalError(error)) {
    process.exit(1);
  }
});
