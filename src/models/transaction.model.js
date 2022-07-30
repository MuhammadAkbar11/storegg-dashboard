import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

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
    history_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "history_id",
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
    sequelize: sequelizeConnection,
    modelName: "Transactions",
    tableName: "gg_transactions",
    deletedAt: false,
  }
);

export default Transaction;
