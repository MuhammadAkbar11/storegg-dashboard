import path from "path";
import fs from "fs";
import controllerTemplate from "./controllerTemplate.js";
import modelTemplate from "./modelTemplate.js";
import repositoryTempalate from "./repoTemplate.js";
import routesTemplate from "./routesTemplate.js";
import validationTemplate from "./validationTemplate.js";
import consoleLog from "../utils/consoleLog.js";

function generateModules() {
  const argv = process.argv;
  const nameCommandIdx = argv.findIndex(arg => arg === "--name");
  const dbCommandIdx = argv.findIndex(arg => arg == "--db");
  const moduleName = argv[nameCommandIdx + 1];
  const databaseName = argv[dbCommandIdx + 1] ?? "db_name";

  if (!nameCommandIdx) {
    console.log("module name not found");
    process.exit();
  }

  try {
    const moduleFolder = path.resolve(`src/modules/${moduleName}`);
    if (fs.existsSync(moduleFolder)) {
      console.log("create already exist");
      process.exit();
    }

    fs.mkdirSync(moduleFolder);

    fs.writeFileSync(
      `${moduleFolder}/${moduleName}.controller.js`,
      controllerTemplate(moduleName)
    );

    fs.writeFileSync(
      `${moduleFolder}/${moduleName}.model.js`,
      modelTemplate(moduleName, databaseName)
    );
    fs.writeFileSync(
      `${moduleFolder}/${moduleName}.repository.js`,
      repositoryTempalate(moduleName)
    );

    fs.writeFileSync(
      `${moduleFolder}/${moduleName}.routes.js`,
      routesTemplate(moduleName)
    );

    fs.writeFileSync(
      `${moduleFolder}/${moduleName}.validator.js`,
      validationTemplate(moduleName)
    );
    consoleLog.success("[generator] Success generate module");
  } catch (error) {
    consoleLog.error("[generator] Failed Success generate module");
    consoleLog.error(`[EXCEPTION] ${error}`);
  }
}

generateModules();
