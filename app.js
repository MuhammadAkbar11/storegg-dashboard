import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.config.js";
import { dotenvConfig, MODE, PORT } from "./config/env.config.js";
import routers from "./routes/index.routes.js";
import { consoleLogInfo } from "./utils/console.js";

dotenvConfig;

connectDB();

const app = express();

if (MODE == "development") {
  app.use(morgan("dev"));
}

app.use(routers);

app.listen(PORT, () => {
  consoleLogInfo(
    `\n[Server] Server running in ${MODE} mode on port ${PORT.underline}`.bold
  );
});
