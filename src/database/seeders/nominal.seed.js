import fs from "fs";
import path from "path";
import { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Nominal from "../../models/nominal.model.js";

export async function seedImportNominals() {
  const jsonFile = path.resolve("src/database/data/nominals.json");
  const dataJson = fs.readFileSync(jsonFile, "utf8");

  try {
    await Nominal.destroy({ where: {} });

    const nominals = JSON.parse(dataJson);

    await Nominal.bulkCreate(nominals, {
      individualHooks: false,
      returning: true,
    });

    // // await UserModel.insertMany(users);
    Logger.info("[seed] Nominals imported!");
    return true;
  } catch (error) {
    throw new TransfromError(error);
  }
}
