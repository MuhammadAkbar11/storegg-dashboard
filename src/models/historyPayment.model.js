import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

class HistoryPayment extends Model {}

HistoryPayment.init(
  {
    history_payment_id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.BIGINT(20),
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
    sequelize: ConnectSequelize,
    modelName: "HistoryPayments",
    tableName: "gg_history_payments",
    deletedAt: false,
  }
);

export default HistoryPayment;
