import { MYSQLDATABASE } from "../config/env.config.js";
import { TABLE_AUTO_INCREMENT } from "../constants/index.constants.js";
import Logger from "../helpers/logger.helper.js";
import Administrator from "./admin.model.js";
import Category from "./category.model.js";
import Player from "./player.model.js";
import User from "./user.model.js";
import AutoIncrement from "./autoNumber.model.js";
import Voucher from "./voucher.model.js";
import Nominal from "./nominal.model.js";
import VoucherNominal from "./voucherNominal.model.js";
import PaymentMethod from "./paymentMethod.model.js";
import Bank from "./bank.model.js";
import PaymentBank from "./paymentBank.model.js";
import Transaction from "./transaction.model.js";
import History from "./history.model.js";
import HistoryVoucherTopup from "./historyVoucherTopup.model.js";
import HistoryPayment from "./historyPayment.model.js";
import HistoryPlayer from "./historyPlayer.model.js";
import chalk from "chalk";

export default function BoostrapingModels() {
  User.hasOne(Player, {
    foreignKey: "user_id",
    as: "player",
  });
  Player.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    constraints: true,
  });

  User.hasOne(Administrator, {
    foreignKey: "user_id",
    as: "admin",
  });
  Administrator.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    constraints: true,
  });

  Category.hasMany(Player, {
    foreignKey: "favorite",
    as: "player",
  });
  Player.belongsTo(Category, {
    foreignKey: "favorite",
    as: "category",
    constraints: true,
  });

  Category.hasOne(Voucher, {
    foreignKey: "category_id",
    as: "vouchers",
  });

  Administrator.hasMany(Voucher, {
    foreignKey: "admin_id",
    as: "vouchers",
  });

  Voucher.belongsTo(Administrator, {
    foreignKey: "admin_id",
    as: "administrators",
  });
  Voucher.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
    constraints: true,
  });

  Voucher.belongsToMany(Nominal, {
    through: VoucherNominal,
    foreignKey: "voucher_id",
    as: "nominals",
  });
  Nominal.belongsToMany(Voucher, {
    through: VoucherNominal,
    foreignKey: "nominal_id",
    as: "vouchers",
  });

  // Voucher.hasMany(VoucherNominal, {
  //   foreignKey: "voucher_id",
  //   as: "voucher_nominals",
  // });

  // Nominal.hasMany(VoucherNominal, {
  //   foreignKey: "nominal_id",
  //   as: "nominals",
  // });

  // VoucherNominal.belongsTo(Voucher, {
  //   foreignKey: "voucher_id",
  //   as: "voucher",
  // });

  // VoucherNominal.belongsTo(Nominal, {
  //   foreignKey: "nominal_id",
  //   as: "nominal",
  // });

  PaymentMethod.belongsToMany(Bank, {
    through: PaymentBank,
    foreignKey: "payment_method_id",
    as: "banks",
    constraints: true,
  });

  Bank.belongsToMany(PaymentMethod, {
    through: PaymentBank,
    foreignKey: "bank_id",
    as: "payment_methods",
    constraints: true,
  });

  Voucher.hasMany(Transaction, {
    foreignKey: "voucher_id",
    as: "transactions",
  });

  Transaction.belongsTo(Voucher, {
    foreignKey: "voucher_id",
    as: "voucher",
    constraints: true,
  });

  Category.hasMany(Transaction, {
    foreignKey: "category_id",
    as: "transactions",
  });

  Transaction.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
    constraints: true,
  });

  Player.hasMany(Transaction, {
    foreignKey: "player_id",
    as: "transactions",
  });

  PaymentMethod.hasMany(Transaction, {
    foreignKey: "payment_method_id",
    as: "transactions",
  });

  Transaction.belongsTo(Player, {
    foreignKey: "player_id",
    as: "player",
    constraints: true,
  });
  Transaction.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    as: "payment_methods",
    constraints: true,
  });

  History.hasOne(Transaction, {
    foreignKey: "history_id",
    as: "transaction",
  });
  Transaction.belongsTo(History, {
    foreignKey: "history_id",
    as: "history",
    constraints: true,
  });

  HistoryVoucherTopup.hasOne(History, {
    foreignKey: "history_vcrtopup_id",
    as: "history",
  });
  History.belongsTo(HistoryVoucherTopup, {
    foreignKey: "history_vcrtopup_id",
    as: "history_voucher",
  });

  HistoryPayment.hasOne(History, {
    foreignKey: "history_payment_id",
    as: "history",
  });

  History.belongsTo(HistoryPayment, {
    foreignKey: "history_payment_id",
    as: "history_payment",
  });

  History.belongsTo(HistoryPlayer, {
    foreignKey: "history_player_id",
    as: "history_player",
  });
  HistoryPlayer.hasOne(History, {
    foreignKey: "history_player_id",
    as: "history",
  });
}

export async function createAutoNumberTable(tables) {
  const data = [];

  Logger.info("[SEQUELIZE] Setup AutoNumber table...");

  for (const table of tables["0"]) {
    const tbName = table[`Tables_in_${MYSQLDATABASE}`];
    if (tbName) {
      const splitTbName = tbName?.split("_");
      const shortTbName = splitTbName.splice(1, splitTbName.length).join("_");
      const tbData = {
        table_name: table[`Tables_in_${MYSQLDATABASE}`],
        ...TABLE_AUTO_INCREMENT[shortTbName],
      };

      if (tbData.field) {
        data.push(tbData);

        const existTable = await AutoIncrement.findOne({
          where: {
            table_name: tbName,
          },
        });

        if (!existTable) {
          const result = await AutoIncrement.create(tbData);
          Logger.info(`[SEQUELIZE] successfully added the "${chalk.bold(
            result.table_name
          )}" table to the autonumber table and "${chalk.bold(
            result.field
          )}" as auto number field
          `);
        }
      }
    }
  }

  Logger.info("[SEQUELIZE] Setup AutoNumber table Done!");
}
