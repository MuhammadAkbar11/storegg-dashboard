#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import * as envConfigs from "../../config/env.config.js";
import ConnectSequelize from "../../helpers/connect.helper.js";
import Logger from "../../helpers/logger.helper.js";
import { seedImportUsers } from "./user.seed.js";

envConfigs.dotenvConfig;

const argv = yargs(hideBin(process.argv)).argv;

async function importSeeds() {
  try {
    await seedImportUsers();
    Logger.info("[seed] success import data");
    process.exit();
  } catch (error) {
    Logger.error(error);
    Logger.error("[seed] Import data is failed!");
    process.exit();
  }
}

(async () => {
  // let force = false;
  const connect = await ConnectSequelize.sync({ force: false }).then(
    res => res
  );

  if (argv.import) {
    await importSeeds();
  }
})();
