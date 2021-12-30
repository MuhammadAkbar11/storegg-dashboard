import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.config.js";
import { dotenvConfig, MODE, PORT } from "./config/env.config.js";
import {
  isOperationalError,
  logError,
  logErrorMiddleware,
  returnError,
} from "./middleware/errorHandler.js";
import routers from "./routes/index.routes.js";
import consoleLog from "./utils/consoleLog.js";

dotenvConfig;

connectDB();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// Body Parse
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (MODE == "development") {
  app.use(morgan("dev"));
}

app.use(routers);

app.use(logErrorMiddleware);
app.use(returnError);

app.listen(PORT, () => {
  consoleLog.success(`[server] Server running in ${MODE} mode on port ${PORT}`);
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
