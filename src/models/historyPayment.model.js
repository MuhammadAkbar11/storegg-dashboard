import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";
import DayjsUTC from "../helpers/date.helper.js";

class HistoryPayment extends Model {}

HistoryPayment.init(
  {
    history_payment_id: {
      allowNull: true,
      primaryKey: true,
      type: DataTypes.STRING(25),
      field: "history_payment_id",
    },
    payer: {
      allowNull: true,
      type: DataTypes.TEXT("long"),
      field: "payer",
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: "type",
    },
    bank_account_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "account_name",
    },
    bank_name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "bank_name",
    },
    no_rekening: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "no_rekening",
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (records, options) {
        for (let i = 0; i < records.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoNumberField(
            "history_payment_id",
            datePrefix,
            12
          );
          records[i].dataValues.history_payment_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (record, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoNumberField("history_payment_id", datePrefix, 12);
        record.dataValues.history_payment_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "HistoryPayments",
    tableName: "gg_history_payments",
    deletedAt: false,
  }
);

export default HistoryPayment;
