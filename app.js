import express from "express";
import { dotenvConfig, MODE, PORT } from "./config/env.config.js";

dotenvConfig;

const app = express();

app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on ${PORT}`);
});
