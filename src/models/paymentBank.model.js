import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";

class PaymentBank extends Model {}

PaymentBank.init(
  {
    payment_bank_id: {
      primaryKey: true,
      type: DataTypes.STRING(15),
      field: "payment_bank_id",
      allowNull: true,
    },
    bank_id: {
      allowNull: false,
      type: DataTypes.STRING(15),
      field: "bank_id",
    },
    payment_method_id: {
      allowNull: false,
      type: DataTypes.STRING(15),
      field: "payment_method_id",
    },
    self_granted: DataTypes.BOOLEAN,
  },
  {
    hooks: {
      beforeBulkCreate: async function (records, options) {
        for (let i = 0; i < records.length; i++) {
          const ID = await AutoNumberField("payment_bank_id", "", 7);
          records[i].dataValues.payment_bank_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (record, options) {
        const ID = await AutoNumberField("payment_bank_id", "", 7);
        record.dataValues.payment_bank_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "PaymentBanks",
    tableName: "gg_payment_banks",
  }
);

export default PaymentBank;
