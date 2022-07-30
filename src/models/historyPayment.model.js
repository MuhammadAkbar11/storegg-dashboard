import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class HistoryPayment extends Model {}

HistoryPayment.init(
  {
    history_payment_id: {
      primaryKey: true,
      type: DataTypes.STRING(25),
      field: "history_payment_id",
    },
    account_name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "account_name",
    },
    type: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: "type",
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
    sequelize: sequelizeConnection,
    modelName: "HistoryPayments",
    tableName: "gg_history_payments",
    deletedAt: false,
  }
);

export default HistoryPayment;
