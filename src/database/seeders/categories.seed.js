import fs from "fs";
import path from "path";
import { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Category from "../../models/category.model.js";

export async function seedImportCategories() {
  const jsonFile = path.resolve("src/database/data/categories.json");
  const dataJson = fs.readFileSync(jsonFile, "utf8");

  try {
    await Category.destroy({ where: {} });

    const categories = JSON.parse(dataJson);

    const createdCategories = await Category.bulkCreate(categories, {
      individualHooks: false,
      returning: true,
    });

    // // await UserModel.insertMany(users);
    Logger.info("[seed] Categories imported!");
    return true;
  } catch (error) {
    throw new TransfromError(error);
  }
}
