import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class HistoryPlayer extends Model {}

HistoryPlayer.init(
  {
    history_player_id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT(20),
      field: "history_player_id",
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "name",
    },
    email: {
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
    sequelize: sequelizeConnection,
    modelName: "HistoryPlayers",
    tableName: "gg_history_players",
    deletedAt: false,
  }
);

export default HistoryPlayer;
