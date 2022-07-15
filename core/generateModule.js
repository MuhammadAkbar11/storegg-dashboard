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

    consoleLog.info(`> creating ${moduleName} module...`);

    const seedTextToArr = seedData.split(",");

    const moduleFolder = path.resolve(`src/modules/${moduleName}`);
    const copyPath = moduleFolder;
    const srcPathIdx = copyPath.split("/").findIndex(p => p == "src");
    const modulePathInfo = copyPath.split("/").splice(srcPathIdx).join("/");

    consoleLog.info(`> checking folder...`);
    if (fs.existsSync(moduleFolder)) {
      consoleLog.error(
        `[!] failed create module folder, because ${modulePathInfo} already exist`
      );
      process.exit();
    }
    consoleLog.info(`> ${modulePathInfo}/ folder not found!`);
    consoleLog.info(`> creating ${modulePathInfo}/ folder...`);
    fs.mkdirSync(moduleFolder);
    consoleLog.success(`> create ${modulePathInfo}/ folder`);

    const ctrlFileName = `${moduleName}.controller.js`;
    const modelFileName = `${moduleName}.model.js`;
    const repoFileName = `${moduleName}.repository.js`;
    const validationFileName = `${moduleName}.validator.js`;
    const routesFileName = `${moduleName}.routes.js`;

    const modelTemplate = _modelFileTemplate(moduleName, tbName, seedTextToArr);
    const controllerTemplate = _controllerFileTemplate(
      moduleName,
      seedTextToArr
    );
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

    consoleLog.success(`> create ${modulePathInfo}/${ctrlFileName} file`);
    consoleLog.success(`> create ${modulePathInfo}/${modelFileName} file`);
    consoleLog.success(`> create ${modulePathInfo}/${repoFileName} file`);
    consoleLog.success(`> create ${modulePathInfo}/${routesFileName} file`);
    consoleLog.success(`> create ${modulePathInfo}/${validationFileName} file`);
    consoleLog.success("> success created module");
  } catch (error) {
    console.log(error);
    consoleLog.error("[!] failed create module");
    consoleLog.error(`[EXCEPTION] ${error}`);
  }
}

generateModules();
