import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";
import DayjsUTC from "../helpers/date.helper.js";

class Voucher extends Model {}

Voucher.init(
  {
    voucher_id: {
      primaryKey: true,
      type: DataTypes.STRING(25),
    },
    admin_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "admin_id",
    },
    game_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "name",
    },
    game_coin_name: {
      allowNull: false,
      type: DataTypes.STRING(15),
      field: "game_coin_name",
    },
    status: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
      field: "status",
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    category_id: {
      allowNull: true,
      type: DataTypes.STRING(15),
      field: "category_id",
    },
  },
  {
    hooks: {
      beforeCreate: async function (voucher, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoNumberField("voucher_id", datePrefix, 12);
        voucher.dataValues.voucher_id = ID;
      },
      beforeBulkCreate: async function (vouchers, options) {
        for (let i = 0; i < vouchers.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoNumberField("voucher_id", datePrefix, 12);

          vouchers[i].dataValues.voucher_id = ID;
        }
        options.individualHooks = false;
      },
    },
    sequelize: MySQLConnection,
    modelName: "Vouchers",
    tableName: "gg_vouchers",
  }
);

export default Voucher;
