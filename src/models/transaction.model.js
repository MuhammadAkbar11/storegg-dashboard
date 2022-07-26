import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

class Transaction extends Model {}

Transaction.init(
  {
    transaction_id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.BIGINT(20),
      field: "transaction_id",
    },
    transaction_code: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true,
      field: "transaction_code",
    },
    name: {
      type: DataTypes.STRING(20),
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
    history_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "history_id",
    },
    category_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: "category_id",
    },
    player_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "player_id",
    },
    payment_method_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: "payment_method_id",
    },
  },
  {
    sequelize: ConnectSequelize,
    modelName: "Transactions",
    tableName: "gg_transactions",
    deletedAt: false,
  }
);

export default Transaction;
