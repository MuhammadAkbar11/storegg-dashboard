import { DB_NAME } from "../config/env.config.js";
import { TABLE_AUTO_INCREMENT } from "../constants/index.constants.js";
import Logger from "../helpers/logger.helper.js";
import Administrator from "./admin.model.js";
import Category from "./category.model.js";
import Player from "./player.model.js";
import User from "./user.model.js";
import AutoIncrement from "./autoIncrement.model.js";
import Voucher from "./voucher.model.js";
import Nominal from "./nominal.model.js";
import VoucherNominal from "./voucherNominal.model.js";
import PaymentMethod from "./paymentMethod.model.js";
import Bank from "./bank.model.js";
import PaymentBank from "./paymentBank.model.js";
import Transaction from "./transaction.model.js";

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
    as: "categories",
    constraints: true,
    onDelete: "CASCADE",
  });

  Category.hasOne(Voucher, {
    foreignKey: "category_id",
    as: "vouchers",
  });
  Voucher.belongsTo(Category, {
    foreignKey: "category_id",
    as: "categories",
    constraints: true,
    onDelete: "CASCADE",
  });

  Voucher.belongsToMany(Nominal, {
    through: VoucherNominal,
    foreignKey: "nominal_id",
    as: "nominals",
    constraints: true,
    onDelete: "CASCADE",
  });
  Nominal.belongsToMany(Voucher, {
    through: VoucherNominal,
    foreignKey: "voucher_id",
    as: "vouchers",
    constraints: true,
    onDelete: "CASCADE",
  });

  PaymentMethod.belongsToMany(Bank, {
    through: PaymentBank,
    foreignKey: "bank_id",
    as: "banks",
    constraints: true,
    onDelete: "CASCADE",
  });

  Bank.belongsToMany(PaymentMethod, {
    through: PaymentBank,
    foreignKey: "payment_method_id",
    as: "payment_methods",
    constraints: true,
    onDelete: "CASCADE",
  });

  Category.hasMany(Transaction, {
    foreignKey: "category_id",
    as: "transactions",
  });

  Transaction.belongsTo(Category, {
    foreignKey: "category_id",
    as: "categories",
    constraints: true,
    onDelete: "CASCADE",
  });

  Player.hasMany(Transaction, {
    foreignKey: "player_id",
    as: "transactions",
  });

  Transaction.belongsTo(Player, {
    foreignKey: "player_id",
    as: "players",
    constraints: true,
    onDelete: "CASCADE",
  });

  PaymentMethod.hasMany(Transaction, {
    foreignKey: "payment_method_id",
    as: "transactions",
  });

  Transaction.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "payment_methods",
    constraints: true,
    onDelete: "CASCADE",
  });
}

export async function initAutoIncrementsData(tables) {
  const data = [];

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
        Logger.info("Table AutoIncrement Created!");
      }
    }
  }
}
