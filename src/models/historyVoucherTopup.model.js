import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";
import DayjsUTC from "../helpers/date.helper.js";

class HistoryVoucherTopup extends Model {}

HistoryVoucherTopup.init(
  {
    history_vcrtopup_id: {
      primaryKey: true,
      allowNull: true,
      type: DataTypes.STRING(25),
      field: "history_vcrtopup_id",
    },
    game_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "game_name",
    },
    coin_name: {
      allowNull: false,
      type: DataTypes.STRING(45),
      field: "coin_name",
    },
    category: {
      allowNull: true,
      type: DataTypes.STRING(20),
      field: "category",
    },
    coin_quantity: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      field: "coin_quantity",
    },
    price: {
      type: DataTypes.BIGINT(30),
      allowNull: false,
      field: "price",
      defaultValue: 0,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (records, options) {
        for (let i = 0; i < records.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoNumberField(
            "history_vcrtopup_id",
            datePrefix,
            13
          );
          records[i].dataValues.history_vcrtopup_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (record, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoNumberField("history_vcrtopup_id", datePrefix, 13);
        record.dataValues.history_vcrtopup_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "HistoryVoucherTopups",
    tableName: "gg_history_vcrtopup",
  }
);

export default HistoryVoucherTopup;
