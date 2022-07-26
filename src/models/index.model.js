import { DB_NAME } from "../config/env.config.js";
import { TABLE_AUTO_INCREMENT } from "../constants/index.constants.js";
import ConnectSequelize from "../helpers/connect.helper.js";
import Logger from "../helpers/logger.helper.js";
import Administrator from "../modules/admin/admin.model.js";
import Category from "../modules/category/category.model.js";
import Player from "../modules/player/player.model.js";
import User from "../modules/user/user.model.js";
import AutoIncrement from "./autoIncrement.model.js";

export default function BootstrapModels() {
  User.hasOne(Player, {
    foreignKey: "user_id",
    as: "players",
  });
  Player.belongsTo(User, {
    foreignKey: "user_id",
    as: "users",
    constraints: true,
    onDelete: "CASCADE",
  });

  User.hasOne(Administrator, {
    foreignKey: "user_id",
    as: "administrators",
  });
  Administrator.belongsTo(User, {
    foreignKey: "user_id",
    as: "users",
    constraints: true,
    onDelete: "CASCADE",
  });

  Category.hasOne(Player, {
    foreignKey: "favorite",
    as: "players",
  });
  Player.belongsTo(Category, {
    foreignKey: "favorite",
    as: "Categories",
    constraints: true,
    onDelete: "CASCADE",
  });
}

export async function initAutoIncrementsData(tables) {
  const data = [];

  const tr = await ConnectSequelize.transaction();

  for (const table of tables["0"]) {
    const tbName = table[`Tables_in_${DB_NAME}`];
    const shortTbName = tbName.split("_")[1];
    const tbData = {
      table_name: table[`Tables_in_${DB_NAME}`],
      ...TABLE_AUTO_INCREMENT[shortTbName],
    };

    data.push(tbData);

    if (tbData.attribute) {
      const existTable = await AutoIncrement.findOne({
        where: {
          table_name: tbName,
        },
      });

      if (!existTable) {
        await AutoIncrement.create(tbData);
        console.log("");
        Logger.info(" Table AutoIncrement Created!");
      }
    }
  }
}
