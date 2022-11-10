import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";

class Bank extends Model {}

Bank.init(
  {
    bank_id: {
      primaryKey: true,
      type: DataTypes.STRING(15),
      field: "bank_id",
    },
    account_name: {
      type: DataTypes.STRING(25),
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
          const ID = await AutoNumberField("bank_id", "", 7);
          records[i].dataValues.bank_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (record, options) {
        const ID = await AutoNumberField("bank_id", "", 7);
        console.log(ID, "OYYY");
        record.dataValues.bank_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "Banks",
    tableName: "gg_banks",
    deletedAt: false,
  }
);

export default Bank;
