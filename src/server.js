import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import methodOverride from "method-override";
import connectFlash from "connect-flash";
import passportConfig from "./config/passport.config.js";
import * as ENV from "./config/env.config.js";
import pinoHttpLogger from "./middleware/logging.js";
import {
  ENV_STATIC_FOLDER_PATH,
  LOCALS_STATIC,
  ROLES_ARR,
  STATIC_FOLDER,
} from "./constants/index.constants.js";
import { responseType } from "./middleware/responseType.js";
import MainRoutes from "./routes/index.routes.js";
import {
  logErrorMiddleware,
  return404,
  returnError,
} from "./middleware/errorHandler.js";
import BoostrapingModels from "./models/index.model.js";
import sessionStore from "./config/sessionsStore.config.js";

ENV.dotenvConfig;

function createServer() {
  passportConfig();

  const app = express();

  app.set("view engine", "ejs");
  app.set("views", "src/views");

  // Body Parse
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cors());

  app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === "object" && "_method" in req.body) {
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
      secret: ENV.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      store: sessionStore,
    })
  );

  sessionStore.sync();

  app.use(pinoHttpLogger);

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session({}));

  app.use((req, res, next) => {
    if (req.user) {
      const userAuth = req.user;
      userAuth.role_data = ROLES_ARR.find(r => r.value === userAuth?.role);
      res.locals.userAuth = userAuth;
    } else {
      res.locals.userAuth = null;
    }

    next();
  });

  // Dymanic static file like css/js
  app.use((_req, res, next) => {
    res.locals.stylesheet = LOCALS_STATIC;
    res.locals.script = LOCALS_STATIC.script;
    next();
  });

  app.use(express.static(STATIC_FOLDER));
  if (ENV.MODE !== "production") {
    app.use(express.static(ENV_STATIC_FOLDER_PATH));
  }

  app.use(responseType);

  MainRoutes(app);

  app.use(logErrorMiddleware);
  app.use(return404);
  app.use(returnError);

  BoostrapingModels();

  return app;
}

export default createServer;
