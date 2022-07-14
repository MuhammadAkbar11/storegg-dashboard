import path from "path";
import fs from "fs";
import consoleLog from "../src/utils/consoleLog.js";
import inquirer from "inquirer";
import _modelFileTemplate from "./templates/_modelFile.js";
import _controllerFileTemplate from "./templates/_controllerFile.js";
import _repositoryFileTempalate from "./templates/_repositoryFile.js";
import _routesFileTemplate from "./templates/_routesFile.js";
import _validationFileTemplate from "./templates/_validationFile.js";

const questions = [
  {
    type: "input",
    name: "moduleName",
    message: "Module name",
    validate(value) {
      if (value.trim() === "") {
        throw Error("Please provide a module name.");
      }
      return true;
    },
    filter(val) {
      return val.toLowerCase();
    },
  },
  {
    type: "input",
    name: "tbName",
    message: "Database table name",
    validate(value) {
      if (value.trim() === "") {
        throw Error("Please provide a database table name.");
      }
      return true;
    },
    filter(val) {
      return val.toLowerCase();
    },
  },
  {
    type: "input",
    name: "seedData",
    message:
      "Input your seed data (example : username,email,password,..etc) \n : ",
    validate(value) {
      if (value.trim() === "") {
        throw Error("Please provide a seed.");
      }
      return true;
    },
  },
];

async function generateModules() {
  try {
    consoleLog.info("[core] create a module");
    const { seedData, moduleName, tbName, isApi } = await inquirer.prompt(
      questions
    );

    consoleLog.info(`[core] creating ${moduleName} module...`);

    const seedTextToArr = seedData.split(",");

    const moduleFolder = path.resolve(`src/modules/${moduleName}`);

    console.info(`[core] checking folder...`);
    if (fs.existsSync(moduleFolder)) {
      consoleLog.log(`modules/${moduleName} already exist`);
      process.exit();
    }

    consoleLog.info(`[core] creating ${moduleName}/ folder...`);
    fs.mkdirSync(moduleFolder);
    consoleLog.info(`[core] success create ${moduleName} folder`);
    const ctrlFileName = `${moduleName}.controller.js`;
    const modelFileName = `${moduleName}.model.js`;
    const repoFileName = `${moduleName}.repository.js`;
    const validationFileName = `${moduleName}.validator.js`;
    const routesFileName = `${moduleName}.routes.js`;

    const modelTemplate = _modelFileTemplate(moduleName, tbName, seedTextToArr);
    const controllerTemplate = _controllerFileTemplate(moduleName, isApi);
    const repoTemplate = _repositoryFileTempalate(moduleName);
    const routesTemplate = _routesFileTemplate(moduleName);
    const validationTemplate = _validationFileTemplate(
      moduleName,
      seedTextToArr
    );

    fs.writeFileSync(`${moduleFolder}/` + modelFileName, modelTemplate);
    fs.writeFileSync(`${moduleFolder}/` + ctrlFileName, controllerTemplate);
    fs.writeFileSync(`${moduleFolder}/` + repoFileName, repoTemplate);
    fs.writeFileSync(`${moduleFolder}/` + routesFileName, routesTemplate);
    fs.writeFileSync(
      `${moduleFolder}/` + validationFileName,
      validationTemplate
    );

    consoleLog.success(`[core] success created ${ctrlFileName} file`);
    consoleLog.success(`[core] success created ${modelFileName} file`);
    consoleLog.success(`[core] success created ${repoFileName} file`);
    consoleLog.success(`[core] success created ${routesFileName} file`);
    consoleLog.success(`[core] success created ${validationFileName} file`);
    consoleLog.success("[core] Success created module");
  } catch (error) {
    consoleLog.error("[core] Failed generate module");
    consoleLog.error(`[EXCEPTION] ${error}`);
  }
}

generateModules();
