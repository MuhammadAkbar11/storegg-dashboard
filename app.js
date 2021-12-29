import express from "express";
import { dotenvConfig, MODE, PORT } from "./config/env.config.js";
import routers from "./routes/index.routes.js";

dotenvConfig;

const app = express();

app.use(routers);

app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on ${PORT}`);
});
