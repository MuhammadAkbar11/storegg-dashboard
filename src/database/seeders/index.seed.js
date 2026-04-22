#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import * as envConfigs from "../../config/env.config.js";
import MySQLConnection from "../../config/db.config.js";
import Logger from "../../helpers/logger.helper.js";
import { seedImportUsers } from "./user.seed.js";
import { seedImportCategories } from "./categories.seed.js";
import { seedImportVouchers } from "./voucher.seed.js";
import { seedImportNominals } from "./nominal.seed.js";

envConfigs.dotenvConfig;

const argv = yargs(hideBin(process.argv)).argv;

async function importSeeds() {
  try {
    await seedImportUsers();
    // await seedImportNominals();
    await seedImportCategories();

    // if (createdCategries) {
    //   await seedImportVouchers();
    // }
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
  const connect = await MySQLConnection.sync({ force: argv.force }).then(
    res => res
  );

  if (argv.import) {
    await importSeeds();
  }
})();
