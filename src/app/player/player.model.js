import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../../config/db.config.js";

class Player extends Model {}

Player.init(
  {
    player_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT(20),
    },
    user_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "user_id",
    },
    phone_number: {
      type: DataTypes.STRING,
      field: "phone_number",
    },
    favorite: {
      allowNull: true,
      type: DataTypes.INTEGER,
      field: "favorite",
    },
  },
  {
    sequelize: MySQLConnection,
    modelName: "Players",
    tableName: "gg_players",
    deletedAt: false,
  }
);

export default Player;
