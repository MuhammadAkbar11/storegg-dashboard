import fs from "fs";
import path from "path";
import { DEFAULT_THUMBNAIL } from "../../constants/index.constants.js";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { GetRandom } from "../../helpers/index.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Administrator from "../../models/admin.model.js";
import Category from "../../models/category.model.js";
import Voucher from "../../models/voucher.model.js";

export async function seedImportVouchers() {
  const jsonFile = path.resolve("src/database/data/vouchers.json");
  const dataJson = fs.readFileSync(jsonFile, "utf8");
  const vouchersData = JSON.parse(dataJson);

  try {
    await Voucher.destroy({ where: {} });
    const categories = await Category.findAll({});
    const admins = await Administrator.findAll({});
    for (const vcr of vouchersData) {
      const category = GetRandom(categories);
      const selectedAdm = GetRandom(admins);
      const post = {
        game_name: vcr.name,
        game_coin_name: vcr.game_coin_name,
        status: "Y",
        thumbnail: DEFAULT_THUMBNAIL,
        category_id: category.category_id,
        admin_id: selectedAdm.admin_id,
      };

      await Voucher.create(post);
    }

    // // await UserModel.insertMany(users);
    Logger.info("[seed] Vouchers imported!");
  } catch (error) {
    throw new TransfromError(error);
  }
}
