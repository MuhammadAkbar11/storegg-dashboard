import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

class HistoryPlayer extends Model {}

HistoryPlayer.init(
  {
    history_player_id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.BIGINT(20),
      field: "history_player_id",
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "name",
    },
    email: {
      unique: true,
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "email",
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "phone_number",
    },
  },
  {
    sequelize: ConnectSequelize,
    modelName: "HistoryPlayers",
    tableName: "gg_history_players",
    deletedAt: false,
  }
);

export default HistoryPlayer;
