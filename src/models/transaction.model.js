import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";
import DayjsUTC from "../helpers/date.helper.js";

class Transaction extends Model {}

Transaction.init(
  {
    transaction_id: {
      primaryKey: true,
      type: DataTypes.STRING(30),
      field: "transaction_id",
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "name",
    },
    account_game: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "account_game",
    },
    tax: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "tax",
    },
    value: {
      type: DataTypes.BIGINT(30),
      allowNull: false,
      field: "value",
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      field: "status",
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
    },
    history_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "history_id",
    },
    voucher_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "voucher_id",
    },
    category_id: {
      allowNull: false,
      type: DataTypes.STRING(15),
      field: "category_id",
    },
    player_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "player_id",
    },
    payment_method_id: {
      allowNull: false,
      type: DataTypes.STRING(15),
      field: "payment_method_id",
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (records, options) {
        for (let i = 0; i < records.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoNumberField(
            "transaction_id",
            `_${datePrefix}`,
            12
          );
          records[i].dataValues.transaction_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (record, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoNumberField(
          "transaction_id",
          `_${datePrefix}`,
          12
        );
        record.dataValues.transaction_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "Transactions",
    tableName: "gg_transactions",
    deletedAt: false,
  }
);

export default Transaction;
