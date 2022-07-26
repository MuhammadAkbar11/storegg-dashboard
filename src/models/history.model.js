import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

class History extends Model {}

History.init(
  {
    history_id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.BIGINT(20),
      field: "history_id",
    },
    history_vcrtopup_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "history_vchrtopup_id",
    },
    history_payment_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "history_payment_id",
    },
    history_player_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "history_player_id",
    },
  },
  {
    sequelize: ConnectSequelize,
    modelName: "Histories",
    tableName: "gg_histories",
  }
);

export default History;
