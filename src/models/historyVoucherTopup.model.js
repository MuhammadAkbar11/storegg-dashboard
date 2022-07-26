import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

class HistoryVoucherTopup extends Model {}

HistoryVoucherTopup.init(
  {
    history_vcrtopup_id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "history_vcrtopup_id",
    },
    game_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "name",
    },
    coin_name: {
      allowNull: false,
      type: DataTypes.STRING(15),
      field: "game_coin_name",
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
    sequelize: ConnectSequelize,
    modelName: "HistoryVoucherTopups",
    tableName: "gg_history_vcrtopup",
  }
);

export default HistoryVoucherTopup;
