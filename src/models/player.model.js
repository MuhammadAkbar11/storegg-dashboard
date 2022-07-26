import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

class Player extends Model {}

Player.init(
  {
    player_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT(20),
      field: "player_id",
    },
    user_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "user_id",
    },

    favorite: {
      allowNull: true,
      type: DataTypes.INTEGER,
      field: "favorite",
    },
  },
  {
    sequelize: ConnectSequelize,
    modelName: "Players",
    tableName: "gg_players",
    deletedAt: false,
  }
);

export default Player;
